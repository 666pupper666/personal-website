import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { StorageNotice } from '../components/StorageNotice';
import { useSiteData } from '../context/SiteDataContext';
import { SITE } from '../data/limits';
import { usePageTitle } from '../hooks/usePageTitle';
import { DataPanel } from './admin/DataPanel';
import { PostsPanel } from './admin/PostsPanel';
import { ProfilePanel } from './admin/ProfilePanel';
import { ProjectsPanel } from './admin/ProjectsPanel';
import { SkillsPanel } from './admin/SkillsPanel';

type TabId = 'profile' | 'skills' | 'projects' | 'posts' | 'data';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'profile', label: '个人信息' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'posts', label: '博客' },
  { id: 'data', label: '数据备份' },
];

export function AdminPage() {
  usePageTitle('本地演示管理');
  const { data } = useSiteData();
  const [tab, setTab] = useState<TabId>('profile');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const counts: Record<TabId, number | null> = {
    profile: null,
    skills: data.skills.length,
    projects: data.projects.length,
    posts: data.posts.length,
    data: null,
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % TABS.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setTab(TABS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container admin-header__inner">
          <div>
            <Link className="back-link" to="/">
              <span aria-hidden="true">←</span>
              返回网站首页
            </Link>
            <h1>本地演示管理</h1>
            <p className="admin-header__desc">
              修改个人信息、技能、项目和博客。保存后前台立即更新。
            </p>
          </div>
          <span className="admin-badge">本地演示 · 无账号登录</span>
        </div>
      </header>

      <main id="main" className="container admin-main">
        <StorageNotice />

        <div className="admin-hint">
          <strong>这是本地内容编辑器</strong>
          <p>
            本站不提供真实登录和服务器存储，后台入口仅用于课程演示。数据保存在当前浏览器同一网站地址下的
            localStorage 中；更换浏览器、清理站点数据或使用无痕模式后，内容不会保留。
          </p>
        </div>

        <div className="tabs" role="tablist" aria-label="管理内容分类">
          {TABS.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              className={`tab${tab === item.id ? ' is-active' : ''}`}
              aria-selected={tab === item.id}
              aria-controls={`panel-${item.id}`}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {item.label}
              {counts[item.id] !== null ? (
                <span className="tab__count">{counts[item.id]}</span>
              ) : null}
            </button>
          ))}
        </div>

        <section
          className="panel admin-panel"
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
        >
          {tab === 'profile' ? <ProfilePanel /> : null}
          {tab === 'skills' ? <SkillsPanel /> : null}
          {tab === 'projects' ? <ProjectsPanel /> : null}
          {tab === 'posts' ? <PostsPanel /> : null}
          {tab === 'data' ? <DataPanel /> : null}
        </section>

        <p className="admin-footnote">
          路由 <code>/admin</code> · 数据键名 <code>{SITE.storageKey}</code> ·
          数据不会上传到任何服务器
        </p>
      </main>
    </div>
  );
}
