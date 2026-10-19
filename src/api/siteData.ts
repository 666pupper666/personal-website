import { createDefaultData } from '../data/defaultData';
import { DATA_VERSION, LIMITS, SITE } from '../data/limits';
import type { SiteData } from '../types';
import { validateSiteData, type ValidationResult } from './validate';

/** 数据层抛出的可展示错误，界面可以直接读取 message */
export class SiteDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SiteDataError';
  }
}

export type LoadSiteDataResult =
  | { status: 'ok'; data: SiteData; source: 'storage' | 'default' }
  | { status: 'corrupted'; message: string; raw: string }
  | { status: 'unavailable'; message: string };

/** 读取本地数据；首次访问返回默认数据，数据损坏时只报告，不覆盖原数据 */
export function loadSiteData(): LoadSiteDataResult {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(SITE.storageKey);
  } catch {
    return {
      status: 'unavailable',
      message:
        '无法访问浏览器本地存储，当前展示的是示例数据。请检查浏览器的隐私设置或是否禁用了本地存储。',
    };
  }

  if (!raw) {
    return { status: 'ok', data: createDefaultData(), source: 'default' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      status: 'corrupted',
      message:
        '本地保存的数据不是有效的 JSON，当前暂时展示示例数据。原始数据仍保留在浏览器中，未被覆盖。',
      raw,
    };
  }

  const result = validateSiteData(parsed);
  if (!result.ok) {
    const first = result.errors[0] ?? '未知结构错误';
    const rest = result.errors.length > 1 ? `（另有 ${result.errors.length - 1} 项问题）` : '';
    return {
      status: 'corrupted',
      message: `本地保存的数据格式不正确：${first}${rest}。当前暂时展示示例数据，原始数据未被覆盖。`,
      raw,
    };
  }

  return { status: 'ok', data: result.data, source: 'storage' };
}

/** 保存完整数据；写入前再次校验，失败时抛出 SiteDataError */
export function saveSiteData(data: SiteData): SiteData {
  const validation = validateSiteData({
    ...data,
    version: DATA_VERSION,
    updatedAt: new Date().toISOString(),
  });

  if (!validation.ok) {
    throw new SiteDataError(`保存失败：${validation.errors[0] ?? '数据格式不正确'}`);
  }

  try {
    window.localStorage.setItem(SITE.storageKey, JSON.stringify(validation.data));
  } catch {
    throw new SiteDataError('保存失败：浏览器本地存储不可用或空间已满，请尝试导出备份后清理空间。');
  }

  return validation.data;
}

/** 清除本地数据并返回默认数据 */
export function clearSiteData(): SiteData {
  try {
    window.localStorage.removeItem(SITE.storageKey);
  } catch {
    throw new SiteDataError('重置失败：浏览器本地存储不可用。');
  }
  return createDefaultData();
}

/** 导出为可读的 JSON 文本 */
export function serializeSiteData(data: SiteData): string {
  return JSON.stringify(data, null, 2);
}

/** 解析并校验导入的 JSON 文本 */
export function parseImportedData(text: string): ValidationResult {
  if (!text.trim()) {
    return { ok: false, errors: ['文件内容为空'] };
  }

  const bytes = new TextEncoder().encode(text).length;
  if (bytes > LIMITS.importFileSize) {
    return { ok: false, errors: ['文件超过 1 MB，请导入本站导出的备份文件'] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, errors: ['文件不是有效的 JSON，请检查文件内容是否完整'] };
  }

  return validateSiteData(parsed);
}
