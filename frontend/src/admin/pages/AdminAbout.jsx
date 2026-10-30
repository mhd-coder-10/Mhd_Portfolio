import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Layers, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminGetProfile, adminUpdateAbout } from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminAbout = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [aboutData, setAboutData] = useState({
    heading: 'Full-Stack Engineering with a Quality-First Mindset',
    paragraph1: '',
    paragraph2: '',
    graduationText: 'MCA (GTU) • CPI: 8.45',
    pillars: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
      const fetchAbout = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
          const res = await adminGetProfile();
          if (mounted && res.success && res.data?.about) {
            setAboutData({
              heading: res.data.about.heading || '',
              paragraph1: res.data.about.paragraph1 || '',
              paragraph2: res.data.about.paragraph2 || '',
              graduationText: res.data.about.graduationText || '',
              pillars: res.data.about.pillars || [],
            });
          }
        } catch (err) {
          showToast('Failed to load about section data', 'error');
        } finally {
          if (mounted && !silent) setLoading(false);
        }
      };
      fetchAbout();

      const handleRefresh = () => fetchAbout(true);
      window.addEventListener('admin:refresh', handleRefresh);

      return () => {
        mounted = false;
        window.removeEventListener('admin:refresh', handleRefresh);
      };
    }, [showToast]);

  const handlePillarChange = (index, field, value) => {
    setAboutData((prev) => {
      const updated = [...prev.pillars];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pillars: updated };
    });
  };

  const handleAddPillar = () => {
    setAboutData((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          icon: 'Layers',
          title: 'New Engineering Pillar',
          description: 'Description of engineering competency.',
          color: 'var(--accent-cyan)',
        },
      ],
    }));
  };

  const handleRemovePillar = (index) => {
    setAboutData((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminUpdateAbout(token, aboutData);
      if (res.success) {
        showToast('About section updated successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update about section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">About Section Management</h1>
          <p className="admin-page-desc">
            Manage your background story paragraphs and four engineering foundation pillars.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Story & Educational Tag</h2>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Section Heading</label>
            <input
              type="text"
              className="admin-input"
              value={aboutData.heading}
              onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Story Paragraph 1</label>
            <textarea
              rows={4}
              className="admin-textarea"
              value={aboutData.paragraph1}
              onChange={(e) => setAboutData({ ...aboutData, paragraph1: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Story Paragraph 2</label>
            <textarea
              rows={4}
              className="admin-textarea"
              value={aboutData.paragraph2}
              onChange={(e) => setAboutData({ ...aboutData, paragraph2: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Graduation Badge Text</label>
            <input
              type="text"
              className="admin-input"
              value={aboutData.graduationText}
              onChange={(e) => setAboutData({ ...aboutData, graduationText: e.target.value })}
            />
          </div>
        </div>

        {/* Engineering Pillars */}
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Pillars of Engineering</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Spotlight cards showcasing your architectural pillars.
              </div>
            </div>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAddPillar}>
              <Plus size={14} />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="admin-responsive-cards-grid">
            {aboutData.pillars.map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    Pillar #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleRemovePillar(idx)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label" style={{ fontSize: '0.8rem' }}>Pillar Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pillar.title}
                    onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label" style={{ fontSize: '0.8rem' }}>Icon Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Layers, Server, ShieldCheck, CheckCircle"
                    value={pillar.icon}
                    onChange={(e) => handlePillarChange(idx, 'icon', e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label" style={{ fontSize: '0.8rem' }}>Description</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={pillar.description}
                    onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save About Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;
