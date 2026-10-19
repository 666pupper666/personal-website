/** 生成带前缀的唯一 ID，只包含字母、数字和短横线 */
export function createId(prefix: 'skill' | 'project' | 'post'): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(36).slice(2, 14).padEnd(12, '0');
  return `${prefix}-${randomPart}`;
}
