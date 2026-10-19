import type { Post } from '../types';

/** 以中文格式展示日期，输入为 YYYY-MM-DD */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return value;
  }
  return `${match[1]} 年 ${Number(match[2])} 月 ${Number(match[3])} 日`;
}

/** 展示精确到分钟的本地时间 */
export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未知';
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** 今天的本地日期，格式 YYYY-MM-DD */
export function todayString(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

/** 按日期倒序排列文章，不修改原数组 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    if (a.date === b.date) {
      return a.title.localeCompare(b.title, 'zh-CN');
    }
    return a.date < b.date ? 1 : -1;
  });
}

/** 导出文件名中的时间戳 */
export function fileStamp(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}`;
}
