import { useEffect, useState, type FormEvent } from 'react';
import { TextAreaField, TextField } from '../../components/admin/Field';
import { useConfirm } from '../../context/ConfirmContext';
import { useSiteData } from '../../context/SiteDataContext';
import { useToast } from '../../context/ToastContext';
import { LIMITS } from '../../data/limits';
import type { Skill } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { validateRequired, type FormErrors } from '../../utils/form';
import { createId } from '../../utils/id';

interface SkillDraft {
  id: string | null;
  name: string;
  category: string;
  description: string;
}

const EMPTY_DRAFT: SkillDraft = { id: null, name: '', category: '', description: '' };

export function SkillsPanel() {
  const { data, update } = useSiteData();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [draft, setDraft] = useState<SkillDraft | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = draft !== null;

  useEffect(() => {
    setDraft(null);
    setErrors({});
  }, [data.skills]);

  useEffect(() => {
    if (isEditing) {
      document.getElementById('skill-name')?.focus({ preventScroll: true });
    }
  }, [isEditing]);

  const setField = (key: 'name' | 'category' | 'description', value: string) => {
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
    const nameError = validateRequired(draft.name, '技能名称', LIMITS.skill.name);
    const categoryError = validateRequired(draft.category, '分类', LIMITS.skill.category);
    const descriptionError = validateRequired(
      draft.description,
      '技能说明',
      LIMITS.skill.description,
    );
    if (nameError) nextErrors.name = nameError;
    if (categoryError) nextErrors.category = categoryError;
    if (descriptionError) nextErrors.description = descriptionError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast('请先修正表单中的问题', 'error');
      return;
    }

    const exists = draft.id !== null && data.skills.some((skill) => skill.id === draft.id);
    const nextSkill: Skill = {
      id: draft.id ?? createId('skill'),
      name: draft.name.trim(),
      category: draft.category.trim(),
      description: draft.description.trim(),
    };

    try {
      update((current) => {
        const hasSkill = current.skills.some((skill) => skill.id === nextSkill.id);
        return {
          ...current,
          skills: hasSkill
            ? current.skills.map((skill) => (skill.id === nextSkill.id ? nextSkill : skill))
            : [...current.skills, nextSkill],
        };
      });
      showToast(exists ? '技能已更新' : '技能已添加', 'success');
      setDraft(null);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleDelete = async (skill: Skill) => {
    const accepted = await confirm({
      title: '删除这项技能？',
      message: `将删除技能「${skill.name}」。删除会立即保存，无法撤销。`,
      confirmLabel: '删除',
      danger: true,
    });
    if (!accepted) {
      return;
    }

    try {
      update((current) => ({
        ...current,
        skills: current.skills.filter((item) => item.id !== skill.id),
      }));
      if (draft?.id === skill.id) {
        setDraft(null);
      }
      showToast(`已删除技能「${skill.name}」`, 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  return (
    <div className="panel-stack">
      <div className="panel-heading">
        <div>
          <h2>技能管理</h2>
          <p>共 {data.skills.length} 项技能，前台会按分类分组展示。</p>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => {
            setDraft({ ...EMPTY_DRAFT });
            setErrors({});
          }}
        >
          + 新增技能
        </button>
      </div>

      {draft ? (
        <form className="editor-card" onSubmit={handleSubmit} noValidate>
          <div className="editor-card__head">
            <h3>{draft.id ? '编辑技能' : '新增技能'}</h3>
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

          <div className="form-grid">
            <TextField
              id="skill-name"
              label="技能名称"
              value={draft.name}
              onChange={(value) => setField('name', value)}
              error={errors.name}
              maxLength={LIMITS.skill.name}
              required
              placeholder="例如：React"
            />
            <TextField
              id="skill-category"
              label="分类"
              value={draft.category}
              onChange={(value) => setField('category', value)}
              error={errors.category}
              hint="相同分类会归到一组。"
              maxLength={LIMITS.skill.category}
              required
              placeholder="例如：前端框架"
            />
          </div>

          <TextAreaField
            id="skill-description"
            label="说明"
            value={draft.description}
            onChange={(value) => setField('description', value)}
            error={errors.description}
            maxLength={LIMITS.skill.description}
            rows={3}
            required
            placeholder="用一两句话描述掌握程度或使用场景，避免夸大。"
          />

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setDraft(null)}>
              取消
            </button>
            <button type="submit" className="btn btn--primary">
              保存技能
            </button>
          </div>
        </form>
      ) : null}

      {data.skills.length === 0 ? (
        <p className="empty-inline">还没有技能，点击「新增技能」添加第一项。</p>
      ) : (
        <ul className="admin-list">
          {data.skills.map((skill) => (
            <li className="admin-list__item" key={skill.id}>
              <div className="admin-list__main">
                <div className="admin-list__title-row">
                  <h3>{skill.name}</h3>
                  <span className="chip">{skill.category}</span>
                </div>
                <p>{skill.description}</p>
              </div>
              <div className="admin-list__actions">
                <button
                  type="button"
                  className="btn btn--small btn--ghost"
                  onClick={() => {
                    setDraft({
                      id: skill.id,
                      name: skill.name,
                      category: skill.category,
                      description: skill.description,
                    });
                    setErrors({});
                  }}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className="btn btn--small btn--danger-ghost"
                  onClick={() => handleDelete(skill)}
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
