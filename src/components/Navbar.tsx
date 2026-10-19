import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { scrollToSection } from '../utils/scroll';

const NAV_ITEMS = [
  { id: 'about', label: '关于我' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '博客' },
] as const;

export function Navbar() {
  const { data } = useSiteData();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleSectionClick = (id: string) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      scrollToSection(id);
      navigate({ pathname: '/', hash: `#${id}` }, { replace: true });
    }
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">{data.profile.name}</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? '关闭导航菜单' : '打开导航菜单'}</span>
          <span className={`menu-toggle__bars${menuOpen ? ' is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="site-nav"
          className={`site-nav${menuOpen ? ' is-open' : ''}`}
          aria-label="主导航"
        >
          <ul className="site-nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  className="site-nav__link"
                  to={`/#${item.id}`}
                  onClick={(event) => {
                    if (location.pathname === '/') {
                      event.preventDefault();
                      handleSectionClick(item.id);
                    } else {
                      setMenuOpen(false);
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="btn btn--small btn--outline site-nav__admin" to="/admin">
            管理后台
          </Link>
        </nav>
      </div>
    </header>
  );
}
