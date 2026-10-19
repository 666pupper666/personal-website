/** 星空背景：多层星点与蓝紫色光晕，纯 CSS 实现 */
export function StarryBackground() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield__nebula starfield__nebula--one" />
      <div className="starfield__nebula starfield__nebula--two" />
      <div className="starfield__stars starfield__stars--small" />
      <div className="starfield__stars starfield__stars--medium" />
      <div className="starfield__stars starfield__stars--large" />
    </div>
  );
}
