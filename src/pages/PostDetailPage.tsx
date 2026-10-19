import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { useSiteData } from '../context/SiteDataContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate } from '../utils/format';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSiteData();

  const post = useMemo(
    () => data.posts.find((item) => item.id === id),
    [data.posts, id],
  );

  usePageTitle(post ? post.title : '文章未找到');

  if (!post) {
    return (
      <div className="page">
        <Navbar />
        <main id="main" className="container article-page">
          <div className="panel empty-state">
            <p className="empty-state__code">404</p>
            <h1>没有找到这篇文章</h1>
            <p className="empty-state__text">
              文章可能已经被删除，或者链接地址有误。可以回到博客列表看看其他内容。
            </p>
            <div className="empty-state__actions">
              <Link className="btn btn--primary" to="/#blog">
                返回博客列表
              </Link>
              <Link className="btn btn--ghost" to="/">
                回到首页
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const paragraphs = post.content.split(/\n{2,}/);

  return (
    <div className="page">
      <Navbar />
      <main id="main" className="container article-page">
        <article className="article">
          <Link className="back-link" to="/#blog">
            <span aria-hidden="true">←</span>
            返回博客列表
          </Link>

          <header className="article__header">
            <div className="article__meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.tags.length > 0 ? (
                <ul className="tag-list" aria-label="文章标签">
                  {post.tags.map((tag) => (
                    <li className="chip" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <h1 className="article__title">{post.title}</h1>
            <p className="article__summary">{post.summary}</p>
          </header>

          <div className="article__body">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <footer className="article__footer">
            <Link className="back-link" to="/#blog">
              <span aria-hidden="true">←</span>
              返回博客列表
            </Link>
            <p>本文内容保存在本地浏览器中，可在管理后台修改。</p>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
