import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Briefcase,
  Cpu,
  Award,
  MessageSquare,
  Share2,
  Plus,
  ArrowRight,
  Clock,
  Mail,
  User,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminGetStats } from '../../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminDashboard = () => {
  const { token, admin } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

      const loadStats = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
          const res = await adminGetStats(token);
          if (mounted && res.success) {
            setStats(res.stats);
            setRecentMessages(res.recentMessages || []);
          }
        } catch (err) {
          console.error('Failed to load dashboard stats:', err);
        } finally {
          if (mounted && !isSilent) setLoading(false);
        }
      };

      loadStats();

      // Listen to admin topbar refresh event for seamless in-place data update
      const handleRefresh = () => {
        loadStats(true);
      };
      window.addEventListener('admin:refresh', handleRefresh);

      return () => {
        mounted = false;
        window.removeEventListener('admin:refresh', handleRefresh);
      };
    }, [token]);

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <p className="admin-page-desc">Loading live analytics and portfolio metrics...</p>
          </div>
        </div>
        <LoadingSkeleton rows={6} type="cards" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: FolderGit2,
      color: 'var(--accent-cyan)',
      bg: 'rgba(56, 189, 248, 0.12)',
      link: '/admin/projects',
    },
    {
      label: 'Career Positions',
      value: stats?.totalExperiences ?? 0,
      icon: Briefcase,
      color: 'var(--accent-emerald)',
      bg: 'rgba(16, 185, 129, 0.12)',
      link: '/admin/experience',
    },
    {
      label: 'Technical Skills',
      value: stats?.totalSkills ?? 0,
      icon: Cpu,
      color: 'var(--accent-indigo)',
      bg: 'rgba(99, 102, 241, 0.12)',
      link: '/admin/skills',
    },
    {
      label: 'Certifications',
      value: stats?.totalCertifications ?? 0,
      icon: Award,
      color: 'var(--accent-violet)',
      bg: 'rgba(168, 85, 247, 0.12)',
      link: '/admin/certifications',
    },
    {
      label: 'Social & Direct Links',
      value: stats?.totalSocialLinks ?? 0,
      icon: Share2,
      color: 'var(--accent-amber)',
      bg: 'rgba(245, 158, 11, 0.12)',
      link: '/admin/social-links',
    },
    {
      label: 'Inbound Inquiries',
      value: stats?.totalMessages ?? 0,
      badge: stats?.unreadMessages ? `${stats.unreadMessages} New` : null,
      icon: MessageSquare,
      color: 'var(--accent-rose)',
      bg: 'rgba(244, 63, 94, 0.12)',
      link: '/admin/messages',
    },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="admin-card"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 21, 38, 0.9) 0%, rgba(20, 32, 58, 0.9) 100%)',
          border: '1px solid var(--border-hover)',
          marginBottom: '1.75rem',
          padding: 'clamp(1.2rem, 3vw, 2rem)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
              <span>ADMINISTRATOR CONSOLE</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Welcome back, {admin?.name || 'Momin'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '650px' }}>
              Your portfolio CMS is active. Any updates saved here are instantly propagated to MongoDB Atlas and visible on the public website.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }} className="admin-welcome-actions">
            <Link to="/admin/projects" className="admin-btn admin-btn-primary">
              <Plus size={16} />
              <span>Add New Project</span>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary">
              <span>Preview Live Site</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-stat-grid">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} to={card.link} className="admin-stat-card" style={{ textDecoration: 'none' }}>
              <div className="admin-stat-icon" style={{ backgroundColor: card.bg, color: card.color }}>
                <Icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="admin-stat-value">{card.value}</div>
                  {card.badge && (
                    <span className="admin-badge admin-badge-danger" style={{ fontSize: '0.72rem' }}>
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="admin-stat-label">{card.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Recent Messages Grid */}
      <div className="admin-dashboard-split">
        {/* Recent Messages */}
        <div className="admin-card" style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Recent Inquiries</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest submissions from the contact section</div>
            </div>
            <Link to="/admin/messages" className="admin-btn admin-btn-secondary admin-btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No messages received yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', boxSizing: 'border-box' }}>
              {recentMessages.map((msg) => (
                <div key={msg._id} className="admin-inquiry-card">
                  <div className="admin-inquiry-top">
                    <div className="admin-inquiry-meta-left">
                      <span className="admin-inquiry-sender">{msg.name}</span>
                      {msg.status === 'unread' && (
                        <span className="admin-badge admin-badge-danger" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="admin-inquiry-time">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="admin-inquiry-subject">
                    {msg.subject || 'General Inquiry'}
                  </div>

                  <p className="admin-inquiry-message">
                    {msg.message}
                  </p>

                  <div className="admin-inquiry-bottom">
                    <span className="admin-inquiry-email">{msg.email}</span>
                    <Link
                      to={`/admin/messages?search=${encodeURIComponent(msg.email)}`}
                      className="admin-btn admin-btn-secondary admin-btn-sm admin-inquiry-btn"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Launch Panel */}
        <div className="admin-card" style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Quick Actions</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fast links to major CMS workspace controls</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', boxSizing: 'border-box' }}>
            <Link to="/admin/projects" className="admin-quick-action-card">
              <div className="admin-quick-action-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', color: 'var(--accent-cyan)' }}>
                <FolderGit2 size={18} />
              </div>
              <div className="admin-quick-action-content">
                <span className="admin-quick-action-title">Manage Projects</span>
                <span className="admin-quick-action-desc">Add, edit or organize portfolio showcases</span>
              </div>
              <ChevronRight size={16} className="admin-quick-action-arrow" />
            </Link>

            <Link to="/admin/experience" className="admin-quick-action-card">
              <div className="admin-quick-action-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)' }}>
                <Briefcase size={18} />
              </div>
              <div className="admin-quick-action-content">
                <span className="admin-quick-action-title">Career History</span>
                <span className="admin-quick-action-desc">Update employment timeline & duties</span>
              </div>
              <ChevronRight size={16} className="admin-quick-action-arrow" />
            </Link>

            <Link to="/admin/skills" className="admin-quick-action-card">
              <div className="admin-quick-action-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-indigo)' }}>
                <Cpu size={18} />
              </div>
              <div className="admin-quick-action-content">
                <span className="admin-quick-action-title">Skills & Tech Stack</span>
                <span className="admin-quick-action-desc">Manage categories and technical tools</span>
              </div>
              <ChevronRight size={16} className="admin-quick-action-arrow" />
            </Link>

            <Link to="/admin/contact-settings" className="admin-quick-action-card">
              <div className="admin-quick-action-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)' }}>
                <MessageSquare size={18} />
              </div>
              <div className="admin-quick-action-content">
                <span className="admin-quick-action-title">WhatsApp & Telegram</span>
                <span className="admin-quick-action-desc">Configure instant direct messaging</span>
              </div>
              <ChevronRight size={16} className="admin-quick-action-arrow" />
            </Link>

            <Link to="/admin/resume" className="admin-quick-action-card">
              <div className="admin-quick-action-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.12)', color: 'var(--accent-violet)' }}>
                <Plus size={18} />
              </div>
              <div className="admin-quick-action-content">
                <span className="admin-quick-action-title">Upload PDF Resume</span>
                <span className="admin-quick-action-desc">Deploy latest CV file for downloads</span>
              </div>
              <ChevronRight size={16} className="admin-quick-action-arrow" />
            </Link>

            <Link to="/admin/settings" className="admin-quick-action-card">
              <div className="admin-quick-action-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', color: 'var(--accent-cyan)' }}>
                <ArrowRight size={18} />
              </div>
              <div className="admin-quick-action-content">
                <span className="admin-quick-action-title">SEO & Navigation</span>
                <span className="admin-quick-action-desc">Google SERP card & public menu setup</span>
              </div>
              <ChevronRight size={16} className="admin-quick-action-arrow" />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* Inquiry Card Mobile Optimization */
        .admin-inquiry-card {
          padding: 0.9rem 1rem;
          border-radius: var(--radius-md);
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          transition: all var(--transition-fast);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .admin-inquiry-card:hover {
          background-color: rgba(255, 255, 255, 0.04);
          border-color: var(--border-hover);
        }
        .admin-inquiry-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          width: 100%;
        }
        .admin-inquiry-meta-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          flex: 1;
        }
        .admin-inquiry-sender {
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .admin-inquiry-time {
          font-size: 0.74rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          flex-shrink: 0;
        }
        .admin-inquiry-subject {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--accent-cyan);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .admin-inquiry-message {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }
        .admin-inquiry-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.2rem;
          padding-top: 0.45rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          width: 100%;
        }
        .admin-inquiry-email {
          font-size: 0.76rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          min-width: 0;
        }
        .admin-inquiry-btn {
          padding: 0.22rem 0.55rem !important;
          font-size: 0.75rem !important;
          gap: 0.35rem !important;
          flex-shrink: 0;
        }

        /* Quick Action Cards */
        .admin-quick-action-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-card);
          text-decoration: none;
          color: var(--text-primary);
          transition: all var(--transition-fast);
          width: 100%;
          box-sizing: border-box;
          max-width: 100%;
          overflow: hidden;
        }
        .admin-quick-action-card:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: var(--accent-cyan);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        }
        .admin-quick-action-icon {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }
        .admin-quick-action-card:hover .admin-quick-action-icon {
          transform: scale(1.06);
        }
        .admin-quick-action-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .admin-quick-action-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          white-space: normal;
        }
        .admin-quick-action-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
          line-height: 1.25;
          white-space: normal;
        }
        .admin-quick-action-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
          transition: transform var(--transition-fast), color var(--transition-fast);
        }
        .admin-quick-action-card:hover .admin-quick-action-arrow {
          color: var(--accent-cyan);
          transform: translateX(3px);
        }

        @media (max-width: 992px) {
          .admin-dashboard-split {
            grid-template-columns: 1fr !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
        }
        @media (max-width: 640px) {
          .admin-welcome-actions {
            width: 100%;
          }
          .admin-welcome-actions .admin-btn {
            flex: 1 1 auto;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
