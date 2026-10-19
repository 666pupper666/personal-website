import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** 路由切换时回到顶部，带哈希时滚动到对应区块 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (target) {
        const frame = window.requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        });
        return () => window.cancelAnimationFrame(frame);
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash]);

  return null;
}
