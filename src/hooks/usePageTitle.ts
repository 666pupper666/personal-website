import { useEffect } from 'react';
import { SITE } from '../data/limits';

/** 设置当前页面标题 */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE.title}` : SITE.title;
  }, [title]);
}
