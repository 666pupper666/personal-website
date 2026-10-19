import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { parseImportedData, serializeSiteData } from '../../api/siteData';
import { useConfirm } from '../../context/ConfirmContext';
import { useSiteData } from '../../context/SiteDataContext';
import { useToast } from '../../context/ToastContext';
import { LIMITS, SITE } from '../../data/limits';
import { getErrorMessage } from '../../utils/error';
import { fileStamp, formatDateTime } from '../../utils/format';

const MAX_ERRORS_SHOWN = 8;

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function DataPanel() {
  const { data, save, resetToDefault, reload } = useSiteData();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  const size = useMemo(() => new Blob([JSON.stringify(data)]).size, [data]);

  const handleExport = () => {
    try {
      const blob = new Blob([serializeSiteData(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `personal-website-backup-${fileStamp()}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('已导出 JSON 备份文件', 'success');
    } catch {
      showToast('导出失败，请检查浏览器是否允许下载文件', 'error');
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }

    if (file.size > LIMITS.importFileSize) {
      setImportErrors([
        `文件大小为 ${(file.size / 1024 / 1024).toFixed(2)} MB，超过 1 MB 限制。`,
      ]);
      showToast('导入失败：文件过大', 'error');
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const result = parseImportedData(text);
      if (!result.ok) {
        setImportErrors(result.errors);
        showToast('导入失败：文件格式不正确', 'error');
        return;
      }

      setImportErrors([]);
      const accepted = await confirm({
        title: '导入并覆盖本地数据？',
        message: `文件包含 ${result.data.skills.length} 项技能、${result.data.projects.length} 个项目和 ${result.data.posts.length} 篇文章。导入后会替换当前浏览器中的全部内容，建议先导出当前数据备份。`,
        confirmLabel: '覆盖导入',
        danger: true,
      });
      if (!accepted) {
        return;
      }

      save(result.data);
      showToast('导入成功，前台内容已更新', 'success');
    } catch (error) {
      const message = getErrorMessage(error);
      setImportErrors([message]);
      showToast('导入失败', 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = async () => {
    const accepted = await confirm({
      title: '恢复示例数据？',
      message:
        '当前的个人信息、技能、项目和文章会被替换为初始示例数据。此操作会立即保存，无法撤销，建议先导出备份。',
      confirmLabel: '恢复示例数据',
      danger: true,
    });
    if (!accepted) {
      return;
    }

    try {
      resetToDefault();
      setImportErrors([]);
      showToast('已恢复示例数据', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleReload = () => {
    reload();
    showToast('已重新读取本地数据', 'info');
  };

  return (
    <div className="panel-stack">
      <div className="panel-heading">
        <div>
          <h2>数据备份</h2>
          <p>导出 JSON 文件备份，或从备份文件恢复内容。导入会覆盖当前数据。</p>
        </div>
      </div>

      <div className="data-grid">
        <section className="panel data-card">
          <h3>导出数据</h3>
          <p>把当前个人信息、技能、项目和文章导出为一个 JSON 文件，便于保存或迁移到其他浏览器。</p>
          <button type="button" className="btn btn--primary" onClick={handleExport}>
            导出 JSON
          </button>
        </section>

        <section className="panel data-card">
          <h3>导入数据</h3>
          <p>支持本站导出的 .json 备份。导入前会校验结构、字段类型和长度，并要求确认覆盖。</p>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? '正在导入…' : '选择 JSON 文件'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            hidden
          />
        </section>

        <section className="panel data-card">
          <h3>当前存储</h3>
          <dl className="info-list">
            <div>
              <dt>存储方式</dt>
              <dd>
                <code>localStorage</code>
              </dd>
            </div>
            <div>
              <dt>数据键名</dt>
              <dd>
                <code>{SITE.storageKey}</code>
              </dd>
            </div>
            <div>
              <dt>最后保存</dt>
              <dd>{formatDateTime(data.updatedAt)}</dd>
            </div>
            <div>
              <dt>数据大小</dt>
              <dd>{formatSize(size)}</dd>
            </div>
          </dl>
          <button type="button" className="btn btn--small btn--ghost" onClick={handleReload}>
            重新读取
          </button>
        </section>

        <section className="panel data-card data-card--danger">
          <h3>恢复示例数据</h3>
          <p>清空当前本地数据，恢复为初始示例内容。适合演示结束后重新开始。</p>
          <button type="button" className="btn btn--danger-ghost" onClick={handleReset}>
            恢复示例数据
          </button>
        </section>
      </div>

      {importErrors.length > 0 ? (
        <div className="import-errors" role="alert">
          <h3>文件存在问题（{importErrors.length} 项）</h3>
          <ul>
            {importErrors.slice(0, MAX_ERRORS_SHOWN).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          {importErrors.length > MAX_ERRORS_SHOWN ? (
            <p>仅展示前 {MAX_ERRORS_SHOWN} 项问题，请修正文件后重新导入。</p>
          ) : null}
        </div>
      ) : null}

      <div className="data-note">
        <strong>关于本地演示的限制</strong>
        <p>
          数据只保存在当前浏览器、当前网站地址下，不会上传到服务器，也不能跨设备同步。
          清理浏览器数据、更换浏览器或切换域名后，内容将无法恢复。重要内容请及时导出备份。
        </p>
      </div>
    </div>
  );
}
