import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Sparkles,
  FileText,
  Briefcase,
  Cpu,
  FolderGit2,
  GraduationCap,
  Award,
  Share2,
  MessageCircle,
  FileDown,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  ChevronRight,
  Pin,
  PinOff,
  RotateCw,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { checkApiHealth } from '../../services/api';
import '../../styles/admin.css';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Content Modules',
    items: [
      { label: 'Profile', path: '/admin/profile', icon: User },
      { label: 'Hero Section', path: '/admin/hero', icon: Sparkles },
      { label: 'About Section', path: '/admin/about', icon: FileText },
      { label: 'Experience', path: '/admin/experience', icon: Briefcase },
      { label: 'Skills', path: '/admin/skills', icon: Cpu },
      { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
      { label: 'Education', path: '/admin/education', icon: GraduationCap },
      { label: 'Certifications', path: '/admin/certifications', icon: Award },
    ],
  },
  {
    title: 'Channels & Media',
    items: [
      { label: 'Social Links', path: '/admin/social-links', icon: Share2 },
      { label: 'WhatsApp & Telegram', path: '/admin/contact-settings', icon: MessageCircle },
      { label: 'Resume', path: '/admin/resume', icon: FileDown },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'SEO & Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

export const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_sidebar_pinned');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  });

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_pinned', String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleToggleHamburger = () => {
    if (window.innerWidth <= 992) {
      setSidebarOpen((prev) => !prev);
    } else {
      togglePin();
    }
  };

  // Completely isolate sidebar scrolling so main page content never scrolls
  const handleSidebarWheel = (e) => {
    e.stopPropagation();
    const el = e.currentTarget;
    const isScrollingDown = e.deltaY > 0;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    const isAtTop = el.scrollTop <= 0;

    if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
      e.preventDefault();
    }
  };

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Check DB status
  useEffect(() => {
    let mounted = true;
    checkApiHealth().then((res) => {
      if (mounted && res?.database?.status === 'connected') {
        setDbConnected(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Mobile Pull-to-Refresh Gesture Listener
  const [pullY, setPullY] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isPullingRef = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e) => {
      // Trigger only if user starts touch at the very top of page
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      if (currentScroll <= 3 && e.touches.length === 1) {
        touchStartY.current = e.touches[0].clientY;
        isPullingRef.current = true;
      } else {
        isPullingRef.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPullingRef.current || isPullRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;

      if (diff > 0 && currentScroll <= 3) {
        // Natural resistance formula
        const distance = Math.min(diff * 0.42, 85);
        setPullY(distance);
      } else {
        setPullY(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      if (pullY >= 50 && !isPullRefreshing) {
        setIsPullRefreshing(true);
        setPullY(55);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        setPullY(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullY, isPullRefreshing]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Build current breadcrumb title
  const currentPath = location.pathname;
  let pageTitle = 'Dashboard';
  for (const group of navGroups) {
    for (const item of group.items) {
      if (currentPath === item.path) {
        pageTitle = item.label;
        break;
      }
    }
  }

  return (
    <div className="admin-layout-root">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 95,
          }}
        />
      )}

      {/* Reopen Floating Trigger & Left Edge Hover Trigger (IntellMeet pattern) */}
      {!isPinned && !isHovered && (
        <>
          <div
            className="admin-sidebar-hover-zone"
            onMouseEnter={() => setIsHovered(true)}
          />
          <button
            type="button"
            className="admin-sidebar-reopen-tab"
            onMouseEnter={() => setIsHovered(true)}
            onClick={() => {
              setIsHovered(true);
              togglePin();
            }}
            title="Open Sidebar"
          >
            <ChevronRight size={15} />
          </button>
        </>
      )}

      {/* IntellMeet Style Sidebar: Fully open or completely closed with hover & pin */}
      <aside
        className={`admin-sidebar ${isPinned || isHovered ? 'open-flow' : 'closed-flow'} ${isPinned ? 'pinned' : ''} ${sidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleSidebarWheel}
      >
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-brand">
            <div className="admin-brand-icon">
              <Sparkles size={20} />
            </div>
            <div className="admin-brand-text">
              <div style={{ lineHeight: 1.2, fontWeight: 700 }}>
                <span>Momin </span>
                <span style={{ color: 'var(--accent-cyan)' }}>M.</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                Portfolio Admin
              </div>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="mobile-hamburger-btn"
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* WORKSPACE MENU Header with Pin/Unpin Button */}
        <div className="admin-menu-section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
            <span style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', lineHeight: 0.8 }}>•</span>
            <span>WORKSPACE MENU</span>
          </div>
          <button
            type="button"
            onClick={togglePin}
            className={`admin-pin-toggle-btn ${isPinned ? 'pinned' : ''}`}
            title={isPinned ? 'Sidebar is pinned open. Click to unpin (auto-closes when cursor leaves)' : 'Click to pin sidebar open permanently'}
          >
            {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: '0.5rem' }}>
              <div className="admin-nav-section-title">{group.title}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    title={item.label}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user-avatar">
            {(admin?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-user-name">
              {admin?.name || 'Administrator'}
            </div>
            <div className="admin-sidebar-user-email">
              {admin?.email || 'admin@portfolio.dev'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="admin-sidebar-logout-btn"
            aria-label="Log out of admin panel"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              onClick={handleToggleHamburger}
              className="admin-topbar-toggle-btn"
              title={isPinned ? 'Collapse sidebar' : 'Open & Pin sidebar'}
              aria-label="Toggle navigation sidebar"
            >
              <Menu size={18} />
            </button>

            <div className="admin-breadcrumbs">
              <Link to="/admin/dashboard">Admin</Link>
              <ChevronRight size={13} className="admin-breadcrumbs-separator" />
              <span className="admin-breadcrumbs-current">{pageTitle}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Database indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: dbConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: dbConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: dbConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              }}
              title="MongoDB Atlas connection status"
            >
              <Database size={13} />
              <span className="admin-topbar-atlas-text">{dbConnected ? 'Atlas Live' : 'Atlas Standby'}</span>
            </div>

            {/* Dedicated Page Refresh Button (Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="admin-topbar-refresh-btn"
              title="Refresh page to load latest updates"
              aria-label="Refresh page"
            >
              <RotateCw size={13} className="admin-refresh-spin-icon" />
              <span className="admin-topbar-refresh-text">Refresh</span>
            </button>

            {/* View live public portfolio */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              title="Open public portfolio website in new tab"
            >
              <span className="admin-view-portfolio-text">View Site</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Mobile Pull-to-Refresh Indicator Banner */}
        {(pullY > 15 || isPullRefreshing) && (
          <div
            style={{
              position: 'fixed',
              top: `${Math.min(pullY - 8, 48)}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              background: '#0f172a',
              border: '1px solid var(--accent-cyan)',
              borderRadius: '9999px',
              padding: '0.35rem 0.95rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-cyan)',
              fontSize: '0.8rem',
              fontWeight: 600,
              pointerEvents: 'none',
              transition: pullY === 0 ? 'top 0.2s ease, opacity 0.2s ease' : 'none',
            }}
          >
            <RotateCw
              size={14}
              style={{
                animation: isPullRefreshing || pullY >= 50 ? 'spin 0.75s linear infinite' : 'none',
                transform: `rotate(${pullY * 4.5}deg)`,
              }}
            />
            <span>{isPullRefreshing ? 'Reloading page...' : pullY >= 50 ? 'Release to reload' : 'Pull down to refresh'}</span>
          </div>
        )}

        {/* Content Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-topbar-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: var(--accent-cyan);
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .admin-topbar-refresh-btn:hover,
        .admin-topbar-refresh-btn:active {
          background: rgba(56, 189, 248, 0.22);
          border-color: var(--accent-cyan);
          color: #ffffff;
        }
        .admin-topbar-refresh-btn:active .admin-refresh-spin-icon {
          transform: rotate(180deg);
          transition: transform 0.25s ease;
        }
        @media (max-width: 992px) {
          .admin-sidebar {
            box-shadow: var(--shadow-lg);
          }
          .admin-sidebar .mobile-hamburger-btn {
            display: block !important;
          }
        }
        @media (min-width: 993px) {
          .admin-mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
