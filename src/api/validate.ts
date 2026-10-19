import { DATA_VERSION, LIMITS } from '../data/limits';
import type { Post, Profile, Project, SiteData, Skill } from '../types';

export type ValidationResult =
  | { ok: true; data: SiteData }
  | { ok: false; errors: string[] };

const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 校验 YYYY-MM-DD 格式且是真实存在的日期 */
export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function readText(
  value: unknown,
  path: string,
  max: number,
  errors: string[],
): string {
  if (typeof value !== 'string') {
    errors.push(`${path}必须是文本`);
    return '';
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    errors.push(`${path}不能为空`);
    return '';
  }
  if (trimmed.length > max) {
    errors.push(`${path}不能超过 ${max} 个字符`);
    return trimmed.slice(0, max);
  }
  return trimmed;
}

function readOptionalText(
  value: unknown,
  path: string,
  max: number,
  errors: string[],
): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value !== 'string') {
    errors.push(`${path}必须是文本`);
    return '';
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    errors.push(`${path}不能超过 ${max} 个字符`);
  }
  return trimmed.slice(0, max);
}

function readTags(value: unknown, path: string, errors: string[]): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    errors.push(`${path}必须是数组`);
    return [];
  }
  if (value.length > LIMITS.tags.maxCount) {
    errors.push(`${path}最多包含 ${LIMITS.tags.maxCount} 个标签`);
  }
  const tags: string[] = [];
  value.forEach((item, index) => {
    if (typeof item !== 'string') {
      errors.push(`${path}第 ${index + 1} 个标签必须是文本`);
      return;
    }
    const tag = item.trim();
    if (!tag) {
      return;
    }
    if (tag.length > LIMITS.tags.maxLength) {
      errors.push(`${path}中的标签「${tag.slice(0, 10)}…」不能超过 ${LIMITS.tags.maxLength} 个字符`);
      return;
    }
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  });
  return tags;
}

function readId(value: unknown, path: string, errors: string[]): string {
  if (typeof value !== 'string' || !ID_PATTERN.test(value)) {
    errors.push(`${path}必须是 1-64 位的字母、数字、下划线或短横线`);
    return '';
  }
  return value;
}

function readArray(value: unknown, path: string, max: number, errors: string[]): unknown[] {
  if (!Array.isArray(value)) {
    errors.push(`${path}必须是数组`);
    return [];
  }
  if (value.length > max) {
    errors.push(`${path}最多包含 ${max} 项`);
  }
  return value;
}

function readProfile(value: unknown, errors: string[]): Profile {
  if (!isRecord(value)) {
    errors.push('个人信息必须是对象');
    return { name: '', tagline: '', intro: '', about: '', learning: '' };
  }
  return {
    name: readText(value.name, '个人信息.姓名', LIMITS.profile.name, errors),
    tagline: readText(value.tagline, '个人信息.个人定位', LIMITS.profile.tagline, errors),
    intro: readText(value.intro, '个人信息.一句话介绍', LIMITS.profile.intro, errors),
    about: readText(value.about, '个人信息.个人简介', LIMITS.profile.about, errors),
    learning: readText(value.learning, '个人信息.学习方向', LIMITS.profile.learning, errors),
  };
}

function readSkill(value: unknown, index: number, errors: string[]): Skill {
  const path = `技能第 ${index + 1} 项`;
  if (!isRecord(value)) {
    errors.push(`${path}必须是对象`);
    return { id: '', name: '', category: '', description: '' };
  }
  return {
    id: readId(value.id, `${path}.id`, errors),
    name: readText(value.name, `${path}.名称`, LIMITS.skill.name, errors),
    category: readText(value.category, `${path}.分类`, LIMITS.skill.category, errors),
    description: readText(value.description, `${path}.说明`, LIMITS.skill.description, errors),
  };
}

function readProject(value: unknown, index: number, errors: string[]): Project {
  const path = `项目第 ${index + 1} 项`;
  if (!isRecord(value)) {
    errors.push(`${path}必须是对象`);
    return { id: '', name: '', description: '', tags: [], link: '' };
  }
  const link = readOptionalText(value.link, `${path}.链接`, LIMITS.project.link, errors);
  if (link) {
    let valid = false;
    try {
      const url = new URL(link);
      valid = url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      valid = false;
    }
    if (!valid) {
      errors.push(`${path}.链接只允许以 http:// 或 https:// 开头的有效地址`);
    }
  }
  return {
    id: readId(value.id, `${path}.id`, errors),
    name: readText(value.name, `${path}.名称`, LIMITS.project.name, errors),
    description: readText(value.description, `${path}.简介`, LIMITS.project.description, errors),
    tags: readTags(value.tags, `${path}.标签`, errors),
    link,
  };
}

function readPost(value: unknown, index: number, errors: string[]): Post {
  const path = `文章第 ${index + 1} 项`;
  if (!isRecord(value)) {
    errors.push(`${path}必须是对象`);
    return { id: '', title: '', summary: '', content: '', date: '', tags: [] };
  }
  const date = readText(value.date, `${path}.日期`, 10, errors);
  if (date && !isValidDateString(date)) {
    errors.push(`${path}.日期必须是有效的 YYYY-MM-DD 日期`);
  }
  return {
    id: readId(value.id, `${path}.id`, errors),
    title: readText(value.title, `${path}.标题`, LIMITS.post.title, errors),
    summary: readText(value.summary, `${path}.摘要`, LIMITS.post.summary, errors),
    content: readText(value.content, `${path}.正文`, LIMITS.post.content, errors),
    date,
    tags: readTags(value.tags, `${path}.标签`, errors),
  };
}

function checkDuplicateIds(items: { id: string }[], path: string, errors: string[]): void {
  const seen = new Set<string>();
  items.forEach((item) => {
    if (!item.id) {
      return;
    }
    if (seen.has(item.id)) {
      errors.push(`${path}中存在重复的 ID「${item.id}」`);
    }
    seen.add(item.id);
  });
}

/**
 * 校验并规范化一份站点数据。
 * 用于导入文件和从 localStorage 读取数据，所有错误会收集中文提示。
 */
export function validateSiteData(value: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: ['数据根节点必须是 JSON 对象'] };
  }

  if (value.version !== DATA_VERSION) {
    errors.push(`数据版本不受支持，需要 version 为 ${DATA_VERSION}`);
  }

  const profile = readProfile(value.profile, errors);

  const skills = readArray(value.skills, '技能列表', LIMITS.skill.maxCount, errors)
    .map((item, index) => readSkill(item, index, errors));
  checkDuplicateIds(skills, '技能列表', errors);

  const projects = readArray(value.projects, '项目列表', LIMITS.project.maxCount, errors)
    .map((item, index) => readProject(item, index, errors));
  checkDuplicateIds(projects, '项目列表', errors);

  const posts = readArray(value.posts, '文章列表', LIMITS.post.maxCount, errors)
    .map((item, index) => readPost(item, index, errors));
  checkDuplicateIds(posts, '文章列表', errors);

  const updatedAt =
    typeof value.updatedAt === 'string' && !Number.isNaN(Date.parse(value.updatedAt))
      ? value.updatedAt
      : new Date().toISOString();
  if (typeof value.updatedAt !== 'string' || Number.isNaN(Date.parse(value.updatedAt))) {
    errors.push('updatedAt 必须是有效的时间字符串');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      version: DATA_VERSION,
      profile,
      skills,
      projects,
      posts,
      updatedAt,
    },
  };
}
