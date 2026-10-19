/** 平滑滚动到首页中的某个区块，并更新地址栏哈希 */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  });
  window.history.replaceState(null, '', `#${id}`);
}
