import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { SectionHeading } from '../components/SectionHeading';
import { StorageNotice } from '../components/StorageNotice';
import { useSiteData } from '../context/SiteDataContext';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Skill } from '../types';
import { formatDate, sortPostsByDate } from '../utils/format';

function EmptyInline({ children }: { children: string }) {
  return <p className="empty-inline">{children}</p>;
}

export function HomePage() {
  usePageTitle();
  const { data } = useSiteData();
  const { profile } = data;

  const skillGroups = useMemo(() => {
    const groups = new Map<string, Skill[]>();
    data.skills.forEach((skill) => {
      const list = groups.get(skill.category);
      if (list) {
        list.push(skill);
      } else {
        groups.set(skill.category, [skill]);
      }
    });
    return Array.from(groups.entries());
  }, [data.skills]);

  const posts = useMemo(() => sortPostsByDate(data.posts), [data.posts]);
  const heroSkills = data.skills.slice(0, 3);

  return (
    <div className="page">
      <Navbar />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero__inner">
            <div className="hero__content">
              <p className="eyebrow">
                <span className="eyebrow__dot" aria-hidden="true" />
                个人作品集 · Portfolio
              </p>
              <h1 className="hero__name" id="hero-title">
                {profile.name}
              </h1>
              <p className="hero__tagline">{profile.tagline}</p>
              <p className="hero__intro">{profile.intro}</p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#projects">
                  查看项目
                  <span className="btn__arrow" aria-hidden="true">
                    ↓
                  </span>
                </a>
                <a className="btn btn--ghost" href="#blog">
                  阅读博客
                </a>
              </div>
            </div>

            {heroSkills.length > 0 ? (
              <div className="hero__visual" aria-hidden="true">
                <div className="orb">
                  <span className="orb__glow" />
                  <span className="orb__ring orb__ring--one" />
                  <span className="orb__ring orb__ring--two" />
                  <span className="orb__core">
                    <span className="orb__core-label">Research</span>
                    <span className="orb__core-amp">&amp;</span>
                    <span className="orb__core-label">Code</span>
                  </span>
                  {heroSkills.map((skill, index) => (
                    <span className={`orb__chip orb__chip--${index + 1}`} key={skill.id}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="hero__scroll" aria-hidden="true">
            <span className="hero__scroll-line" />
            向下浏览
          </div>
        </section>

        <div className="container">
          <StorageNotice />
        </div>

        <section className="section" id="about">
          <div className="container">
            <SectionHeading
              eyebrow="About"
              title="关于我"
              description="教育背景、研究方向与在校经历。"
            />
            <div className="about-grid">
              <div className="panel about-card">
                <p className="panel__label">个人简介</p>
                {profile.about.split(/\n{2,}/).map((paragraph, index) => (
                  <p className="about-card__text" key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <aside className="panel about-aside">
                <p className="panel__label">学习方向</p>
                <p className="about-card__text">{profile.learning}</p>
                <dl className="about-stats">
                  <div>
                    <dt>技能</dt>
                    <dd>{data.skills.length}</dd>
                  </div>
                  <div>
                    <dt>项目</dt>
                    <dd>{data.projects.length}</dd>
                  </div>
                  <div>
                    <dt>文章</dt>
                    <dd>{data.posts.length}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="container">
            <SectionHeading
              eyebrow="Skills"
              title="技能"
              description="按分类整理研究方向与在用的技能，描述保持真实。"
            />
            {skillGroups.length === 0 ? (
              <EmptyInline>还没有添加技能，可以前往管理后台新增。</EmptyInline>
            ) : (
              <div className="skill-groups">
                {skillGroups.map(([category, skills]) => (
                  <div className="skill-group" key={category}>
                    <div className="skill-group__head">
                      <h3>{category}</h3>
                      <span>{skills.length} 项</span>
                    </div>
                    <div className="card-grid card-grid--skills">
                      {skills.map((skill) => (
                        <article className="panel skill-card" key={skill.id}>
                          <span className="skill-card__glyph" aria-hidden="true">
                            {skill.name.slice(0, 1)}
                          </span>
                          <h4>{skill.name}</h4>
                          <p>{skill.description}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section" id="projects">
          <div className="container">
            <SectionHeading
              eyebrow="Projects"
              title="项目"
              description="科研与工程项目的真实记录，标签中标注了参与时间。"
            />
            {data.projects.length === 0 ? (
              <EmptyInline>还没有添加项目，可以前往管理后台新增。</EmptyInline>
            ) : (
              <div className="project-grid">
                {data.projects.map((project, index) => (
                  <article className="panel project-card" key={project.id}>
                    <div className="project-card__head">
                      <span className="project-card__index" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3>{project.name}</h3>
                    </div>
                    <p className="project-card__desc">{project.description}</p>
                    <div className="project-card__foot">
                      {project.tags.length > 0 ? (
                        <ul className="tag-list" aria-label="技术标签">
                          {project.tags.map((tag) => (
                            <li className="chip" key={tag}>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="project-card__muted">暂无技术标签</span>
                      )}
                      {project.link ? (
                        <a
                          className="text-link"
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          访问项目
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section section--last" id="blog">
          <div className="container">
            <SectionHeading
              eyebrow="Writing"
              title="博客"
              description="记录学习过程中的想法，示例文章可以在后台修改或删除。"
            />
            {posts.length === 0 ? (
              <EmptyInline>还没有文章，可以前往管理后台写第一篇。</EmptyInline>
            ) : (
              <div className="post-list">
                {posts.map((post) => (
                  <Link className="panel post-row" key={post.id} to={`/posts/${post.id}`}>
                    <div className="post-row__aside">
                      <time className="post-row__date" dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                    </div>
                    <div className="post-row__body">
                      <h3>{post.title}</h3>
                      <p>{post.summary}</p>
                      <div className="post-row__meta">
                        {post.tags.map((tag) => (
                          <span className="chip" key={tag}>
                            {tag}
                          </span>
                        ))}
                        <span className="post-row__more">
                          阅读全文
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
