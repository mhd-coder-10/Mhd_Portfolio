import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminGetProfile, adminUpdateHero } from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminHero = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [heroData, setHeroData] = useState({
    rotatingRoles: [],
    badgeText: 'Available for Full-Stack Roles',
    primaryCtaText: 'View My Work',
    primaryCtaLink: '#projects',
    secondaryCtaText: 'Download Resume',
    stats: {
      mcaCpi: 8.45,
      enterpriseApps: 3,
      qaReliability: 100,
      techStacks: 10,
    },
  });

  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchHero = async () => {
      try {
        const res = await adminGetProfile();
        if (mounted && res.success && res.data?.hero) {
          setHeroData({
            rotatingRoles: res.data.hero.rotatingRoles || [],
            badgeText: res.data.hero.badgeText || 'Available for Full-Stack Roles',
            primaryCtaText: res.data.hero.primaryCtaText || 'View My Work',
            primaryCtaLink: res.data.hero.primaryCtaLink || '#projects',
            secondaryCtaText: res.data.hero.secondaryCtaText || 'Download Resume',
            stats: res.data.hero.stats || {
              mcaCpi: 8.45,
              enterpriseApps: 3,
              qaReliability: 100,
              techStacks: 10,
            },
          });
        }
      } catch (err) {
        showToast('Failed to load hero configuration', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHero();
    return () => { mounted = false; };
  }, [showToast]);

  const handleAddRole = () => {
    if (!newRole.trim()) return;
    setHeroData((prev) => ({
      ...prev,
      rotatingRoles: [...prev.rotatingRoles, newRole.trim()],
    }));
    setNewRole('');
  };

  const handleRemoveRole = (index) => {
    setHeroData((prev) => ({
      ...prev,
      rotatingRoles: prev.rotatingRoles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminUpdateHero(token, heroData);
      if (res.success) {
        showToast('Hero section settings saved successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update hero settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Hero Section Management</h1>
          <p className="admin-page-desc">
            Customize the animated typewriter roles, CTA actions, metrics counters, and badges.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Typewriter Roles */}
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Rotating Typewriter Titles</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                These titles rotate automatically with a typewriter animation under your name.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {heroData.rotatingRoles.map((role, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>
                    0{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{role}</span>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => handleRemoveRole(idx)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. Scalable RESTful API Engineer"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRole();
                }
              }}
            />
            <button type="button" className="admin-btn admin-btn-secondary" onClick={handleAddRole}>
              <Plus size={16} />
              <span>Add Role</span>
            </button>
          </div>
        </div>

        {/* CTAs and Badge */}
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Call to Actions & Badges</h2>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Top Badge Text</label>
            <input
              type="text"
              className="admin-input"
              value={heroData.badgeText}
              onChange={(e) => setHeroData({ ...heroData, badgeText: e.target.value })}
            />
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Primary CTA Button Label</label>
              <input
                type="text"
                className="admin-input"
                value={heroData.primaryCtaText}
                onChange={(e) => setHeroData({ ...heroData, primaryCtaText: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Primary CTA Button Link</label>
              <input
                type="text"
                className="admin-input"
                value={heroData.primaryCtaLink}
                onChange={(e) => setHeroData({ ...heroData, primaryCtaLink: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Secondary CTA Button Label</label>
            <input
              type="text"
              className="admin-input"
              value={heroData.secondaryCtaText}
              onChange={(e) => setHeroData({ ...heroData, secondaryCtaText: e.target.value })}
            />
          </div>
        </div>

        {/* Counter Stats Strip */}
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Key Metrics Counter Strip</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                These numerical stats animate dynamically across the top of the hero section.
              </div>
            </div>
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">MCA CPI (e.g. 8.45)</label>
              <input
                type="number"
                step="0.01"
                className="admin-input"
                value={heroData.stats.mcaCpi}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    stats: { ...heroData.stats, mcaCpi: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Enterprise Apps Count (e.g. 3)</label>
              <input
                type="number"
                className="admin-input"
                value={heroData.stats.enterpriseApps}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    stats: { ...heroData.stats, enterpriseApps: parseInt(e.target.value, 10) || 0 },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">QA Reliability % (e.g. 100)</label>
              <input
                type="number"
                className="admin-input"
                value={heroData.stats.qaReliability}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    stats: { ...heroData.stats, qaReliability: parseInt(e.target.value, 10) || 0 },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Tech Stacks Count (e.g. 10)</label>
              <input
                type="number"
                className="admin-input"
                value={heroData.stats.techStacks}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    stats: { ...heroData.stats, techStacks: parseInt(e.target.value, 10) || 0 },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save Hero Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHero;
