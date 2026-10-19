import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';

export function Footer() {
  const { data } = useSiteData();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__name">
            {data.profile.name}
            <span className="site-footer__dot" aria-hidden="true">
              ·
            </span>
            个人作品集
          </p>
          <p className="site-footer__note">
            页面内容保存在当前浏览器的 localStorage 中，仅用于本地演示。
          </p>
        </div>
        <div className="site-footer__meta">
          <span>© {year}</span>
          <Link to="/admin">本地演示管理</Link>
        </div>
      </div>
    </footer>
  );
}
