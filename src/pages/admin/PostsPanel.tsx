import { useEffect, useState, type FormEvent } from 'react';
import { TextAreaField, TextField } from '../../components/admin/Field';
import { useConfirm } from '../../context/ConfirmContext';
import { useSiteData } from '../../context/SiteDataContext';
import { useToast } from '../../context/ToastContext';
import { LIMITS } from '../../data/limits';
import type { Post } from '../../types';
import { getErrorMessage } from '../../utils/error';
import {
  splitTags,
  tagsToInput,
  validateDateInput,
  validateRequired,
  validateTagsInput,
  type FormErrors,
} from '../../utils/form';
import { formatDate, todayString } from '../../utils/format';
import { createId } from '../../utils/id';

interface PostDraft {
  id: string | null;
  title: string;
  summary: string;
  content: string;
  date: string;
  tagsInput: string;
}

function emptyDraft(): PostDraft {
  return {
    id: null,
    title: '',
    summary: '',
    content: '',
    date: todayString(),
    tagsInput: '',
  };
}

export function PostsPanel() {
  const { data, update } = useSiteData();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [draft, setDraft] = useState<PostDraft | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = draft !== null;

  useEffect(() => {
    setDraft(null);
    setErrors({});
  }, [data.posts]);

  useEffect(() => {
    if (isEditing) {
      document.getElementById('post-title')?.focus({ preventScroll: true });
    }
  }, [isEditing]);

  const setField = (
    key: 'title' | 'summary' | 'content' | 'date' | 'tagsInput',
    value: string,
  ) => {
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
    const titleError = validateRequired(draft.title, '文章标题', LIMITS.post.title);
    const summaryError = validateRequired(draft.summary, '文章摘要', LIMITS.post.summary);
    const contentError = validateRequired(draft.content, '文章正文', LIMITS.post.content);
    const dateError = validateDateInput(draft.date);
    const tagsError = validateTagsInput(draft.tagsInput);
    if (titleError) nextErrors.title = titleError;
    if (summaryError) nextErrors.summary = summaryError;
    if (contentError) nextErrors.content = contentError;
    if (dateError) nextErrors.date = dateError;
    if (tagsError) nextErrors.tagsInput = tagsError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast('请先修正表单中的问题', 'error');
      return;
    }

    const exists = draft.id !== null && data.posts.some((post) => post.id === draft.id);
    const nextPost: Post = {
      id: draft.id ?? createId('post'),
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      content: draft.content.trim(),
      date: draft.date,
      tags: splitTags(draft.tagsInput),
    };

    try {
      update((current) => {
        const hasPost = current.posts.some((post) => post.id === nextPost.id);
        return {
          ...current,
          posts: hasPost
            ? current.posts.map((post) => (post.id === nextPost.id ? nextPost : post))
            : [...current.posts, nextPost],
        };
      });
      showToast(exists ? '文章已更新' : '文章已发布', 'success');
      setDraft(null);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleDelete = async (post: Post) => {
    const accepted = await confirm({
      title: '删除这篇文章？',
      message: `将删除文章「${post.title}」。删除后文章详情页会提示不存在，此操作无法撤销。`,
      confirmLabel: '删除',
      danger: true,
    });
    if (!accepted) {
      return;
    }

    try {
      update((current) => ({
        ...current,
        posts: current.posts.filter((item) => item.id !== post.id),
      }));
      if (draft?.id === post.id) {
        setDraft(null);
      }
      showToast(`已删除文章「${post.title}」`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  return (
    <div className="panel-stack">
      <div className="panel-heading">
        <div>
          <h2>博客管理</h2>
          <p>共 {data.posts.length} 篇文章，正文按空行分段，以纯文本展示。</p>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => {
            setDraft(emptyDraft());
            setErrors({});
          }}
        >
          + 新增文章
        </button>
      </div>

      {draft ? (
        <form className="editor-card" onSubmit={handleSubmit} noValidate>
          <div className="editor-card__head">
            <h3>{draft.id ? '编辑文章' : '新增文章'}</h3>
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
            id="post-title"
            label="文章标题"
            value={draft.title}
            onChange={(value) => setField('title', value)}
            error={errors.title}
            maxLength={LIMITS.post.title}
            required
            placeholder="例如：我的第一篇学习记录"
          />

          <TextAreaField
            id="post-summary"
            label="摘要"
            value={draft.summary}
            onChange={(value) => setField('summary', value)}
            error={errors.summary}
            hint="显示在博客列表中，帮助读者快速了解文章内容。"
            maxLength={LIMITS.post.summary}
            rows={2}
            required
          />

          <div className="form-grid">
            <TextField
              id="post-date"
              label="日期"
              value={draft.date}
              onChange={(value) => setField('date', value)}
              error={errors.date}
              type="date"
              required
            />
            <TextField
              id="post-tags"
              label="标签"
              value={draft.tagsInput}
              onChange={(value) => setField('tagsInput', value)}
              error={errors.tagsInput}
              hint="用中文逗号或英文逗号分隔，最多 8 个。"
              placeholder="例如：学习记录，React"
            />
          </div>

          <TextAreaField
            id="post-content"
            label="正文"
            value={draft.content}
            onChange={(value) => setField('content', value)}
            error={errors.content}
            hint="纯文本内容。空行会分成新段落，不会解析 HTML。"
            maxLength={LIMITS.post.content}
            rows={12}
            required
            placeholder="从这里开始写正文……"
          />

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setDraft(null)}>
              取消
            </button>
            <button type="submit" className="btn btn--primary">
              保存文章
            </button>
          </div>
        </form>
      ) : null}

      {data.posts.length === 0 ? (
        <p className="empty-inline">还没有文章，点击「新增文章」写下第一篇。</p>
      ) : (
        <ul className="admin-list">
          {data.posts.map((post) => (
            <li className="admin-list__item" key={post.id}>
              <div className="admin-list__main">
                <div className="admin-list__title-row">
                  <h3>{post.title}</h3>
                  {post.tags.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p>{post.summary}</p>
                <p className="admin-list__muted">
                  {formatDate(post.date)} · 正文 {post.content.length} 字符
                </p>
              </div>
              <div className="admin-list__actions">
                <button
                  type="button"
                  className="btn btn--small btn--ghost"
                  onClick={() => {
                    setDraft({
                      id: post.id,
                      title: post.title,
                      summary: post.summary,
                      content: post.content,
                      date: post.date,
                      tagsInput: tagsToInput(post.tags),
                    });
                    setErrors({});
                  }}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className="btn btn--small btn--danger-ghost"
                  onClick={() => handleDelete(post)}
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
