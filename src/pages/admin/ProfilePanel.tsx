import { useEffect, useState, type FormEvent } from 'react';
import { TextAreaField, TextField } from '../../components/admin/Field';
import { useSiteData } from '../../context/SiteDataContext';
import { useToast } from '../../context/ToastContext';
import { LIMITS } from '../../data/limits';
import type { Profile } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { validateRequired, type FormErrors } from '../../utils/form';

export function ProfilePanel() {
  const { data, update } = useSiteData();
  const { showToast } = useToast();
  const [form, setForm] = useState<Profile>(data.profile);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(data.profile);
    setErrors({});
  }, [data.profile]);

  const dirty = JSON.stringify(form) !== JSON.stringify(data.profile);

  const setField = (key: keyof Profile, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
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

    const nextErrors: FormErrors = {};
    const checks: Array<[keyof Profile, string | null]> = [
      ['name', validateRequired(form.name, '姓名', LIMITS.profile.name)],
      ['tagline', validateRequired(form.tagline, '个人定位', LIMITS.profile.tagline)],
      ['intro', validateRequired(form.intro, '一句话介绍', LIMITS.profile.intro)],
      ['about', validateRequired(form.about, '个人简介', LIMITS.profile.about)],
      ['learning', validateRequired(form.learning, '学习方向', LIMITS.profile.learning)],
    ];
    checks.forEach(([key, message]) => {
      if (message) {
        nextErrors[key] = message;
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast('请先修正表单中的问题', 'error');
      return;
    }

    try {
      update((current) => ({
        ...current,
        profile: {
          name: form.name.trim(),
          tagline: form.tagline.trim(),
          intro: form.intro.trim(),
          about: form.about.trim(),
          learning: form.learning.trim(),
        },
      }));
      showToast('个人信息已保存，前台已同步更新', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  return (
    <div className="panel-stack">
      <div className="panel-heading">
        <div>
          <h2>个人信息</h2>
          <p>这些内容会出现在首页的顶部介绍和「关于我」区块。</p>
        </div>
        <span className={`save-state${dirty ? ' is-dirty' : ''}`}>
          {dirty ? '有未保存的修改' : '内容已保存'}
        </span>
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <TextField
            id="profile-name"
            label="姓名"
            value={form.name}
            onChange={(value) => setField('name', value)}
            error={errors.name}
            hint="显示在导航、首页标题和页脚。"
            maxLength={LIMITS.profile.name}
            required
            placeholder="例如：我的名字"
          />
          <TextField
            id="profile-tagline"
            label="个人定位"
            value={form.tagline}
            onChange={(value) => setField('tagline', value)}
            error={errors.tagline}
            hint="一句话描述你的方向，例如「前端开发学习者」。"
            maxLength={LIMITS.profile.tagline}
            required
          />
        </div>

        <TextField
          id="profile-intro"
          label="一句话介绍"
          value={form.intro}
          onChange={(value) => setField('intro', value)}
          error={errors.intro}
          hint="显示在首页姓名下方，建议不超过两行。"
          maxLength={LIMITS.profile.intro}
          required
        />

        <TextAreaField
          id="profile-about"
          label="个人简介"
          value={form.about}
          onChange={(value) => setField('about', value)}
          error={errors.about}
          hint="支持换行，空行会分成新段落。请只填写真实信息。"
          maxLength={LIMITS.profile.about}
          rows={7}
          required
        />

        <TextAreaField
          id="profile-learning"
          label="学习方向"
          value={form.learning}
          onChange={(value) => setField('learning', value)}
          error={errors.learning}
          hint="会展示在「关于我」右侧卡片中。"
          maxLength={LIMITS.profile.learning}
          rows={4}
          required
        />

        <div className="form-actions">
          <p className="form-actions__note">保存后立即生效，刷新页面后仍会保留。</p>
          <button type="submit" className="btn btn--primary">
            保存个人信息
          </button>
        </div>
      </form>
    </div>
  );
}
