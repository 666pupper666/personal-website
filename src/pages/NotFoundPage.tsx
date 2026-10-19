import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('页面未找到');

  return (
    <div className="page">
      <Navbar />
      <main id="main" className="container article-page">
        <div className="panel empty-state">
          <p className="empty-state__code">404</p>
          <h1>这个页面不存在</h1>
          <p className="empty-state__text">地址可能输入有误，或者页面已经被移动。</p>
          <div className="empty-state__actions">
            <Link className="btn btn--primary" to="/">
              回到首页
            </Link>
            <Link className="btn btn--ghost" to="/#blog">
              浏览博客
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
