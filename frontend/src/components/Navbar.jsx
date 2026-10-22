import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Terminal,
  ArrowRight,
  Download,
  Database,
  User,
  Briefcase,
  Cpu,
  Compass,
  FolderGit2,
  GraduationCap,
  Mail,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { checkApiHealth } from '../services/api';
import { usePortfolioData } from '../context/PortfolioContext';
import { useToast } from '../admin/components/AdminToast';

const getNavIcon = (href, label) => {
  const key = `${href || ''} ${label || ''}`.toLowerCase();
  if (key.includes('about')) return User;
  if (key.includes('exp')) return Briefcase;
  if (key.includes('skill')) return Cpu;
  if (key.includes('approach') || key.includes('work')) return Compass;
  if (key.includes('project')) return FolderGit2;
  if (key.includes('edu') || key.includes('cert')) return GraduationCap;
  if (key.includes('contact') || key.includes('talk')) return Mail;
  return Sparkles;
};

export const Navbar = ({ theme, toggleTheme, activeSection }) => {
  const { navigationLinks, socialLinks, personalInfo } = usePortfolioData();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  const handleResumeDownload = async (e) => {
    e.preventDefault();
    if (!socialLinks?.resume || socialLinks?.resumeActive === false) {
      showToast('Resume file abhi exist nahi karta.', 'error');
      return;
    }

    try {
      const filename = socialLinks.resumeName || 'Momin-Mahmmadbhai-Resume.pdf';
      const response = await fetch(socialLinks.resume);
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      showToast('Resume file abhi exist nahi karta.', 'error');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Poll DB health status
  useEffect(() => {
    let mounted = true;
    const fetchHealth = () => {
      checkApiHealth()
        .then((res) => {
          if (!mounted) return;
          if (res?.database?.status === 'connected') {
            setDbConnected(true);
          } else {
            setDbConnected(false);
          }
        })
        .catch(() => {
          if (mounted) setDbConnected(false);
        });
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);



  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        transition: 'all var(--transition-normal)',
        backgroundColor: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="nav-container">
        {/* Brand Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
            }}
          >
            <Terminal size={20} />
          </div>
          <span>
            Momin <span className="text-gradient">M.</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'clamp(1rem, 1.6vw, 1.75rem)',
          }}
          className="desktop-nav"
        >
          {navigationLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  position: 'relative',
                  padding: '0.25rem 0',
                  whiteSpace: 'nowrap',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent-cyan)',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 0 8px var(--accent-cyan)',
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem',
            flexShrink: 0,
          }}
          className="desktop-actions"
        >
          {/* Live Atlas DB Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: dbConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: dbConnected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              color: dbConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            title={dbConnected ? 'MongoDB Atlas Cluster Connected' : 'Checking Atlas Database...'}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: dbConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                boxShadow: dbConnected ? '0 0 8px var(--accent-emerald)' : 'none',
                flexShrink: 0,
              }}
            />
            <span>{dbConnected ? 'Atlas Live' : 'Atlas Standby'}</span>
          </div>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <a
            href={socialLinks.resume || '#'}
            onClick={handleResumeDownload}
            className="btn btn-outline"
            style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            title={socialLinks.resumeActive ? "Download Resume" : "Resume abhi exist nahi karta"}
          >
            <Download size={14} />
            <span>Resume</span>
          </a>

          <a
            href="#contact"
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <span>Let's Talk</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile Hamburger & Theme Switcher */}
        <div className="mobile-toggle-group">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            className="mobile-hamburger-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Compact & Short Mobile Navigation Dropdown (Right-aligned, never hides display) */}
      {mobileMenuOpen && (
        <>
          {/* Transparent dismiss overlay - page remains 100% visible */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'transparent',
              zIndex: 490,
            }}
          />

          <div
            className="mobile-nav-compact-card"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: '1rem',
              width: '235px',
              maxWidth: 'calc(100vw - 2rem)',
              backgroundColor: 'rgba(11, 17, 33, 0.97)',
              backgroundImage: 'linear-gradient(180deg, rgba(16, 25, 48, 0.98) 0%, rgba(9, 14, 28, 0.99) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px',
              boxShadow: '0 18px 40px -8px rgba(0, 0, 0, 0.75), 0 0 16px rgba(56, 189, 248, 0.1)',
              padding: '0.45rem',
              zIndex: 500,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              boxSizing: 'border-box',
              animation: 'mobileNavCompactPop 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              transformOrigin: 'top right',
            }}
          >
            {/* Section Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {navigationLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                const Icon = getNavIcon(link.href, link.label);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`mobile-compact-link ${isActive ? 'active' : ''}`}
                  >
                    <div className="mobile-compact-icon">
                      <Icon size={14} />
                    </div>
                    <span className="mobile-compact-label">{link.label}</span>
                    {isActive && <span className="mobile-compact-dot" />}
                  </a>
                );
              })}
            </nav>

            {/* Quick Actions Mini Footer */}
            <div
              style={{
                marginTop: '0.25rem',
                paddingTop: '0.45rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
              }}
            >
              <a
                href={socialLinks.resume || '#'}
                onClick={(e) => {
                  handleNavClick();
                  handleResumeDownload(e);
                }}
                className="btn btn-outline"
                title={socialLinks.resumeActive ? "Download Resume" : "Resume abhi exist nahi karta"}
                style={{
                  padding: '0.38rem 0.5rem',
                  fontSize: '0.75rem',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  fontWeight: 600,
                  gap: '0.35rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <Download size={12} />
                <span>Resume</span>
              </a>

              <a
                href="#contact"
                className="btn btn-primary"
                onClick={handleNavClick}
                style={{
                  padding: '0.38rem 0.5rem',
                  fontSize: '0.75rem',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  fontWeight: 600,
                  gap: '0.35rem',
                }}
              >
                <span>Contact</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </>
      )}

      {/* Media Query CSS for Desktop vs Mobile Nav */}
      <style>{`
        .mobile-compact-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.42rem 0.65rem;
          border-radius: 7px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          background: transparent;
          border: 1px solid transparent;
          transition: all 0.15s ease;
          touch-action: manipulation;
        }

        .mobile-compact-link:hover,
        .mobile-compact-link:active {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .mobile-compact-link.active {
          background: rgba(56, 189, 248, 0.12);
          color: var(--accent-cyan);
          font-weight: 600;
          border-color: rgba(56, 189, 248, 0.25);
        }

        .mobile-compact-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .mobile-compact-link.active .mobile-compact-icon {
          color: var(--accent-cyan);
        }

        .mobile-compact-label {
          flex: 1;
          font-family: var(--font-sans);
          line-height: 1;
        }

        .mobile-compact-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 6px var(--accent-cyan);
          flex-shrink: 0;
        }

        @keyframes mobileNavCompactPop {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle-group { display: none !important; }
          .mobile-hamburger-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-toggle-group { display: flex !important; align-items: center; gap: 0.75rem; }
          .mobile-hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
