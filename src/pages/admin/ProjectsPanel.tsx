import { useEffect, useState, type FormEvent } from 'react';
import { TextAreaField, TextField } from '../../components/admin/Field';
import { useConfirm } from '../../context/ConfirmContext';
import { useSiteData } from '../../context/SiteDataContext';
import { useToast } from '../../context/ToastContext';
import { LIMITS } from '../../data/limits';
import type { Project } from '../../types';
import { getErrorMessage } from '../../utils/error';
import {
  splitTags,
  tagsToInput,
  validateHttpUrl,
  validateRequired,
  validateTagsInput,
  type FormErrors,
} from '../../utils/form';
import { createId } from '../../utils/id';

interface ProjectDraft {
  id: string | null;
  name: string;
  description: string;
  link: string;
  tagsInput: string;
}

const EMPTY_DRAFT: ProjectDraft = {
  id: null,
  name: '',
  description: '',
  link: '',
  tagsInput: '',
};

export function ProjectsPanel() {
  const { data, update } = useSiteData();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = draft !== null;

  useEffect(() => {
    setDraft(null);
    setErrors({});
  }, [data.projects]);

  useEffect(() => {
    if (isEditing) {
      document.getElementById('project-name')?.focus({ preventScroll: true });
    }
  }, [isEditing]);

  const setField = (key: 'name' | 'description' | 'link' | 'tagsInput', value: string) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) {
      return;
    }

    const nextErrors: FormErrors = {};
    const nameError = validateRequired(draft.name, '项目名称', LIMITS.project.name);
    const descriptionError = validateRequired(
      draft.description,
      '项目简介',
      LIMITS.project.description,
    );
    const linkError = validateHttpUrl(draft.link);
    const tagsError = validateTagsInput(draft.tagsInput);
    if (nameError) nextErrors.name = nameError;
    if (descriptionError) nextErrors.description = descriptionError;
    if (linkError) nextErrors.link = linkError;
    if (tagsError) nextErrors.tagsInput = tagsError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast('请先修正表单中的问题', 'error');
      return;
    }

    const exists = draft.id !== null && data.projects.some((project) => project.id === draft.id);
    const nextProject: Project = {
      id: draft.id ?? createId('project'),
      name: draft.name.trim(),
      description: draft.description.trim(),
      link: draft.link.trim(),
      tags: splitTags(draft.tagsInput),
    };

    try {
      update((current) => {
        const hasProject = current.projects.some((project) => project.id === nextProject.id);
        return {
          ...current,
          projects: hasProject
            ? current.projects.map((project) =>
                project.id === nextProject.id ? nextProject : project,
              )
            : [...current.projects, nextProject],
        };
      });
      showToast(exists ? '项目已更新' : '项目已添加', 'success');
      setDraft(null);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleDelete = async (project: Project) => {
    const accepted = await confirm({
      title: '删除这个项目？',
      message: `将删除项目「${project.name}」。删除会立即保存，无法撤销。`,
      confirmLabel: '删除',
      danger: true,
    });
    if (!accepted) {
      return;
    }

    try {
      update((current) => ({
        ...current,
        projects: current.projects.filter((item) => item.id !== project.id),
      }));
      if (draft?.id === project.id) {
        setDraft(null);
      }
      showToast(`已删除项目「${project.name}」`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  return (
    <div className="panel-stack">
      <div className="panel-heading">
        <div>
          <h2>项目管理</h2>
          <p>共 {data.projects.length} 个项目，链接仅支持 http 和 https 地址。</p>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => {
            setDraft({ ...EMPTY_DRAFT });
            setErrors({});
          }}
        >
          + 新增项目
        </button>
      </div>

      {draft ? (
        <form className="editor-card" onSubmit={handleSubmit} noValidate>
          <div className="editor-card__head">
            <h3>{draft.id ? '编辑项目' : '新增项目'}</h3>
            <button
              type="button"
              className="icon-button"
              onClick={() => {
                setDraft(null);
                setErrors({});
              }}
              aria-label="关闭编辑表单"
            >
              ×
            </button>
          </div>

          <TextField
            id="project-name"
            label="项目名称"
            value={draft.name}
            onChange={(value) => setField('name', value)}
            error={errors.name}
            maxLength={LIMITS.project.name}
            required
            placeholder="例如：网页总结工具"
          />

          <TextAreaField
            id="project-description"
            label="项目简介"
            value={draft.description}
            onChange={(value) => setField('description', value)}
            error={errors.description}
            hint="只填写已确认的功能和信息，不虚构成果或获奖。"
            maxLength={LIMITS.project.description}
            rows={4}
            required
          />

          <div className="form-grid">
            <TextField
              id="project-link"
              label="项目链接"
              value={draft.link}
              onChange={(value) => setField('link', value)}
              error={errors.link}
              hint="可以留空。仅支持 https:// 或 http:// 开头的地址。"
              maxLength={LIMITS.project.link}
              type="url"
              placeholder="https://example.com"
            />
            <TextField
              id="project-tags"
              label="技术标签"
              value={draft.tagsInput}
              onChange={(value) => setField('tagsInput', value)}
              error={errors.tagsInput}
              hint="用中文逗号或英文逗号分隔，最多 8 个。"
              placeholder="例如：React，TypeScript"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setDraft(null)}>
              取消
            </button>
            <button type="submit" className="btn btn--primary">
              保存项目
            </button>
          </div>
        </form>
      ) : null}

      {data.projects.length === 0 ? (
        <p className="empty-inline">还没有项目，点击「新增项目」添加第一个。</p>
      ) : (
        <ul className="admin-list">
          {data.projects.map((project) => (
            <li className="admin-list__item" key={project.id}>
              <div className="admin-list__main">
                <div className="admin-list__title-row">
                  <h3>{project.name}</h3>
                  {project.tags.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p>{project.description}</p>
                {project.link ? (
                  <p className="admin-list__link">{project.link}</p>
                ) : (
                  <p className="admin-list__muted">未填写项目链接</p>
                )}
              </div>
              <div className="admin-list__actions">
                <button
                  type="button"
                  className="btn btn--small btn--ghost"
                  onClick={() => {
                    setDraft({
                      id: project.id,
                      name: project.name,
                      description: project.description,
                      link: project.link,
                      tagsInput: tagsToInput(project.tags),
                    });
                    setErrors({});
                  }}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className="btn btn--small btn--danger-ghost"
                  onClick={() => handleDelete(project)}
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
