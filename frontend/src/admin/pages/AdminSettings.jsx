import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Compass,
  FileText,
  KeyRound,
  Save,
  Loader2,
  CheckCircle,
  Plus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetSettings,
  adminUpdateSettings,
  adminUpdateSeo,
  adminUpdateNavigation,
  adminChangePassword,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminSettings = () => {
  const { token, admin } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [activeTab, setActiveTab] = useState('seo');
  const [loading, setLoading] = useState(true);
  const [savingSeo, setSavingSeo] = useState(false);
  const [savingNav, setSavingNav] = useState(false);
  const [savingFooter, setSavingFooter] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // SEO Form State
  const [seoData, setSeoData] = useState({
    siteTitle: '',
    metaDescription: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
  });

  // Navigation Links Form State
  const [navLinks, setNavLinks] = useState([]);
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavHref, setNewNavHref] = useState('');

  // Footer Form State
  const [footerData, setFooterData] = useState({
    description: '',
    statusText: '',
    copyrightText: '',
  });

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await adminGetSettings();
      if (res.success && res.data) {
        if (res.data.seo) {
          const seo = { ...res.data.seo };
          // Remove legacy dummy placeholder domain
          if (seo.canonicalUrl && seo.canonicalUrl.includes('mominmahmmadbhai.dev')) {
            seo.canonicalUrl = '';
          }
          setSeoData(seo);
        }
        if (res.data.navigationLinks) setNavLinks(res.data.navigationLinks);
        if (res.data.footer) setFooterData(res.data.footer);
      }
    } catch (err) {
      showToast('Failed to load settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen to admin topbar refresh event for seamless in-place data update
    const handleRefresh = () => {
      fetchSettings();
    };
    window.addEventListener('admin:refresh', handleRefresh);

    return () => {
      window.removeEventListener('admin:refresh', handleRefresh);
    };
  }, []);

  // SEO Save
  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setSavingSeo(true);
    try {
      const res = await adminUpdateSeo(token, seoData);
      if (res.success) {
        showToast('SEO & Meta tags updated successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update SEO settings.', 'error');
    } finally {
      setSavingSeo(false);
    }
  };

  // Navigation Add & Remove
  const handleAddNavItem = () => {
    if (!newNavLabel.trim() || !newNavHref.trim()) {
      showToast('Please provide both link label and destination #hash/URL.', 'error');
      return;
    }
    const newItem = {
      label: newNavLabel.trim(),
      href: newNavHref.trim(),
      displayOrder: navLinks.length,
      isActive: true,
    };
    setNavLinks([...navLinks, newItem]);
    setNewNavLabel('');
    setNewNavHref('');
  };

  const handleRemoveNavItem = (idx) => {
    setNavLinks(navLinks.filter((_, i) => i !== idx));
  };

  const handleSaveNavigation = async () => {
    setSavingNav(true);
    try {
      const res = await adminUpdateNavigation(token, navLinks);
      if (res.success) {
        showToast('Navigation menu links updated!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update navigation.', 'error');
    } finally {
      setSavingNav(false);
    }
  };

  // Footer Save
  const handleSaveFooter = async (e) => {
    e.preventDefault();
    setSavingFooter(true);
    try {
      const res = await adminUpdateSettings(token, { footer: footerData });
      if (res.success) {
        showToast('Footer settings updated successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update footer.', 'error');
    } finally {
      setSavingFooter(false);
    }
  };

  // Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast('Please enter both current and new passwords.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await adminChangePassword(token, passwordForm.currentPassword, passwordForm.newPassword);
      if (res.success) {
        showToast('Admin password changed successfully!', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Website Settings & Security</h1>
          <p className="admin-page-desc">Configure search engine optimization, navigation links, footer content, and admin credentials</p>
        </div>
      </div>

      {/* Unclipped Modern Module Tabs (2x2 on Mobile, Sleek Strip on Desktop) */}
      <div className="admin-settings-tabs-wrapper">
        <div className="admin-settings-tabs">
          <button
            type="button"
            className={`admin-settings-tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <Globe size={16} />
            <span>SEO & Meta</span>
          </button>

          <button
            type="button"
            className={`admin-settings-tab-btn ${activeTab === 'nav' ? 'active' : ''}`}
            onClick={() => setActiveTab('nav')}
          >
            <Compass size={16} />
            <span>Navigation</span>
          </button>

          <button
            type="button"
            className={`admin-settings-tab-btn ${activeTab === 'footer' ? 'active' : ''}`}
            onClick={() => setActiveTab('footer')}
          >
            <FileText size={16} />
            <span>Footer Details</span>
          </button>

          <button
            type="button"
            className={`admin-settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <KeyRound size={16} />
            <span>Admin Security</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="120px" />
      ) : (
        <>
          {/* TAB 1: SEO & METADATA */}
          {activeTab === 'seo' && (
            <div className="admin-seo-split">
              {/* Left Column: Form Controls */}
              <div className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ minWidth: 0, flex: '1 1 200px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                      Search Engine Optimization (SEO) &amp; Open Graph
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                      Control titles, descriptions, and sharing cards rendered on search engines and social feeds.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={handleSaveSeo}
                    disabled={savingSeo}
                    style={{ flexShrink: 0 }}
                  >
                    {savingSeo ? <Loader2 size={14} className="admin-spinner" /> : <Save size={14} />}
                    <span>Save SEO</span>
                  </button>
                </div>

                <form onSubmit={handleSaveSeo}>
                  <div className="admin-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <label className="admin-label">Page Title (&lt;title&gt;)</label>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: (seoData.siteTitle || '').length > 60 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                        {(seoData.siteTitle || '').length} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      className="admin-input"
                      value={seoData.siteTitle}
                      onChange={(e) => setSeoData({ ...seoData, siteTitle: e.target.value })}
                      placeholder="Momin Mahmmadbhai | Full-Stack Developer (MERN)"
                    />
                  </div>

                  <div className="admin-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <label className="admin-label">Meta Description</label>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: (seoData.metaDescription || '').length > 160 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                        {(seoData.metaDescription || '').length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={seoData.metaDescription}
                      onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                      placeholder="Portfolio of Momin Mahmmadbhai, a Full-Stack MERN Developer specializing in..."
                    />
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block', lineHeight: 1.4 }}>
                      Recommended: 140–160 characters for best Google SERP display.
                    </span>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">SEO Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={seoData.keywords}
                      onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                      placeholder="Momin Mahmmadbhai, MERN Stack Developer, Full Stack Developer, React.js..."
                    />
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Open Graph Title (og:title)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={seoData.ogTitle}
                        onChange={(e) => setSeoData({ ...seoData, ogTitle: e.target.value })}
                        placeholder="Momin Mahmmadbhai | Full-Stack Developer (MERN)"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Canonical URL</label>
                      <input
                        type="url"
                        className="admin-input"
                        value={seoData.canonicalUrl}
                        onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                        placeholder="https://yourdomain.com/"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Open Graph Description (og:description)</label>
                    <textarea
                      className="admin-textarea"
                      rows={2}
                      value={seoData.ogDescription}
                      onChange={(e) => setSeoData({ ...seoData, ogDescription: e.target.value })}
                      placeholder="Portfolio of Momin Mahmmadbhai, a Full-Stack MERN Developer specializing in scalable web applications..."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Open Graph Preview Image URL (og:image)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={seoData.ogImage}
                      onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                      placeholder="/favicon.svg"
                    />
                  </div>

                  <button type="submit" className="admin-btn admin-btn-primary admin-seo-submit-btn" disabled={savingSeo}>
                    {savingSeo ? (
                      <>
                        <Loader2 size={16} className="admin-spinner" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save SEO Settings</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Live SERP & Social Card Previews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                {/* Google SERP Preview Card */}
                <div className="admin-card" style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                      <Search size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Google Search (SERP) Preview
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', padding: '0.2rem 0.5rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      LIVE PREVIEW
                    </span>
                  </div>

                  <div
                    style={{
                      background: '#1f293d',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'arial, sans-serif',
                      boxSizing: 'border-box',
                      width: '100%',
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', width: '100%', minWidth: 0 }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--gradient-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        M
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', flexShrink: 0, fontWeight: 500 }}>
                        Momin Mahmmadbhai
                      </div>
                      {seoData.canonicalUrl && (
                        <>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', flexShrink: 0 }}>•</span>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
                            {seoData.canonicalUrl}
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: '#60a5fa',
                        lineHeight: 1.35,
                        marginBottom: '0.35rem',
                        cursor: 'pointer',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {seoData.siteTitle || 'Momin Mahmmadbhai | Full-Stack Developer (MERN)'}
                    </div>

                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {seoData.metaDescription ||
                        'Portfolio of Momin Mahmmadbhai, a Full-Stack MERN Developer specializing in scalable web applications, secure REST APIs, and MongoDB architecture.'}
                    </div>
                  </div>
                </div>

                {/* Social Card Preview */}
                <div className="admin-card" style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                      <Share2 size={16} color="var(--accent-indigo)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Social Media (Open Graph) Card
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)', padding: '0.2rem 0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                      SOCIAL FEED
                    </span>
                  </div>

                  <div
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        minHeight: '100px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        position: 'relative',
                        padding: '1rem',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                        width: '100%',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                          Momin Mahmmadbhai
                        </div>
                        <div style={{ fontSize: '0.74rem', opacity: 0.9, fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                          Full-Stack MERN Architecture
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '0.85rem 1rem', boxSizing: 'border-box', width: '100%' }}>
                      {seoData.canonicalUrl ? (
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {(() => {
                            try {
                              const u = seoData.canonicalUrl;
                              const valid = u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`;
                              return new URL(valid).hostname;
                            } catch {
                              return seoData.canonicalUrl;
                            }
                          })()}
                        </div>
                      ) : null}
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem', lineHeight: 1.35, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                        {seoData.ogTitle || seoData.siteTitle || 'Momin Mahmmadbhai | Full-Stack Developer'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                        {seoData.ogDescription || seoData.metaDescription || 'Explore enterprise web applications and full-stack engineering portfolio.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Best Practice Audit */}
                <div className="admin-card" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    SEO Health Indicators
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                      <CheckCircle2 size={15} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>Title tag configured ({(seoData.siteTitle || '').length} chars)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                      <CheckCircle2 size={15} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>Meta description active ({(seoData.metaDescription || '').length} chars)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                      <CheckCircle2 size={15} color={seoData.canonicalUrl ? "var(--accent-emerald)" : "var(--text-muted)"} style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                        Canonical link: {seoData.canonicalUrl ? (
                          <code style={{ color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>{seoData.canonicalUrl}</code>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not configured (Optional)</span>
                        )}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                      <CheckCircle2 size={15} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>Open Graph cards configured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NAVIGATION MENU */}
          {activeTab === 'nav' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Navbar Menu Links
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    Control the navigation items shown in the portfolio header bar.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleSaveNavigation}
                  disabled={savingNav}
                >
                  {savingNav ? <Loader2 size={14} className="admin-spinner" /> : <Save size={14} />}
                  <span>Save Navigation</span>
                </button>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {navLinks.map((item, idx) => (
                  <div
                    key={idx}
                    className="admin-nav-link-card"
                  >
                    <div className="admin-nav-link-card-header">
                      <span className="admin-nav-link-badge">
                        #{idx + 1}
                      </span>
                      <div className="admin-nav-link-actions">
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                          <input
                            type="checkbox"
                            checked={item.isActive !== false}
                            onChange={(e) => {
                              const updated = [...navLinks];
                              updated[idx].isActive = e.target.checked;
                              setNavLinks(updated);
                            }}
                          />
                          <span>Active</span>
                        </label>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={() => handleRemoveNavItem(idx)}
                          title="Remove Link"
                          aria-label={`Remove link #${idx + 1}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-nav-link-inputs">
                      <div className="admin-nav-link-input-group">
                        <label className="admin-label-xs">Link Label</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...navLinks];
                            updated[idx].label = e.target.value;
                            setNavLinks(updated);
                          }}
                          placeholder="Label (e.g. About)"
                        />
                      </div>
                      <div className="admin-nav-link-input-group">
                        <label className="admin-label-xs">Target (#hash or URL)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={item.href}
                          onChange={(e) => {
                            const updated = [...navLinks];
                            updated[idx].href = e.target.value;
                            setNavLinks(updated);
                          }}
                          placeholder="Href (e.g. #about)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Item */}
              <div className="admin-nav-add-box">
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1, minWidth: '160px' }}
                  placeholder="New item label (e.g. Testimonials)"
                  value={newNavLabel}
                  onChange={(e) => setNewNavLabel(e.target.value)}
                />
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1, minWidth: '160px' }}
                  placeholder="Href (e.g. #testimonials)"
                  value={newNavHref}
                  onChange={(e) => setNewNavHref(e.target.value)}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={handleAddNavItem}
                >
                  <Plus size={14} />
                  <span>Add Link</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FOOTER DETAILS */}
          {activeTab === 'footer' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Footer Content & Availability Notice
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    Manage brand copy and copyright statements displayed in the public footer.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveFooter}>
                <div className="admin-form-group">
                  <label className="admin-label">Footer Brand Bio / Summary</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={footerData.description}
                    onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                    placeholder="Full-Stack MERN Developer specialized in scalable web architectures..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Live Availability Badge Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={footerData.statusText}
                    onChange={(e) => setFooterData({ ...footerData, statusText: e.target.value })}
                    placeholder="Full-Stack Services Active & Available"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Copyright Notice</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={footerData.copyrightText}
                    onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                    placeholder="All rights reserved."
                  />
                </div>

                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingFooter}>
                  {savingFooter ? (
                    <>
                      <Loader2 size={16} className="admin-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Footer Settings</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: ADMIN SECURITY */}
          {activeTab === 'security' && (
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-rose)',
                  }}
                >
                  <Lock size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Change Admin Password
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                    Secured by bcrypt hashing (minimum 8 characters required)
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Logged in as: <strong style={{ color: 'var(--accent-cyan)' }}>{admin?.email}</strong>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="admin-form-group">
                  <label className="admin-label">
                    Current Password <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="admin-input"
                      placeholder="Enter your current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    New Password <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    className="admin-input"
                    placeholder="At least 8 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    Confirm New Password <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    className="admin-input"
                    placeholder="Repeat new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="admin-btn admin-btn-danger" disabled={changingPassword}>
                  {changingPassword ? (
                    <>
                      <Loader2 size={16} className="admin-spinner" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Update Admin Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* Embedded mobile responsive overrides */}
      <style>{`
        @media (max-width: 992px) {
          .admin-seo-split {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.25rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        @media (max-width: 768px) {
          .admin-settings-tabs-wrapper {
            margin-bottom: 1.25rem !important;
          }
          .admin-settings-tabs {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.45rem !important;
            padding: 5px !important;
            overflow-x: visible !important;
          }
          .admin-settings-tab-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 0.6rem 0.45rem !important;
            font-size: 0.78rem !important;
            gap: 0.4rem !important;
            box-sizing: border-box !important;
          }
          .admin-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .admin-nav-link-inputs {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
          .admin-nav-add-box {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .admin-nav-add-box input,
          .admin-nav-add-box button {
            width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .admin-card {
            padding: 1rem 0.85rem !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .admin-seo-submit-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .admin-input,
          .admin-textarea {
            font-size: 0.88rem !important;
            padding: 0.6rem 0.75rem !important;
            box-sizing: border-box !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
