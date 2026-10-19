import { LIMITS } from '../data/limits';
import { isValidDateString } from '../api/validate';

export type FormErrors = Record<string, string>;

/** 必填文本校验，返回错误文案；通过时返回 null */
export function validateRequired(value: string, label: string, max: number): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return `${label}不能为空`;
  }
  if (trimmed.length > max) {
    return `${label}不能超过 ${max} 个字符`;
  }
  return null;
}

/** 校验可选的 http/https 链接 */
export function validateHttpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.length > LIMITS.project.link) {
    return `链接不能超过 ${LIMITS.project.link} 个字符`;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return '链接只允许以 http:// 或 https:// 开头';
    }
  } catch {
    return '请输入有效的链接，例如 https://example.com';
  }
  return null;
}

/** 支持中英文逗号、顿号和分号分隔标签 */
export function splitTags(input: string): string[] {
  const tags: string[] = [];
  input
    .split(/[,，、;；]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  return tags;
}

/** 把标签数组还原成输入框内容 */
export function tagsToInput(tags: string[]): string {
  return tags.join('，');
}

/** 校验标签输入的数量与单个长度 */
export function validateTagsInput(input: string): string | null {
  const tags = splitTags(input);
  if (tags.length > LIMITS.tags.maxCount) {
    return `最多填写 ${LIMITS.tags.maxCount} 个标签`;
  }
  const tooLong = tags.find((tag) => tag.length > LIMITS.tags.maxLength);
  if (tooLong) {
    return `标签「${tooLong.slice(0, 8)}…」不能超过 ${LIMITS.tags.maxLength} 个字符`;
  }
  return null;
}

/** 校验日期输入 */
export function validateDateInput(value: string): string | null {
  if (!value.trim()) {
    return '日期不能为空';
  }
  if (!isValidDateString(value)) {
    return '请选择有效的日期';
  }
  return null;
}
