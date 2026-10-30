import React, { useState, useEffect } from 'react';
import { Save, Loader2, User, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminGetProfile, adminUpdateProfile } from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import ImageUploader from '../components/ImageUploader';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminProfile = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    title: '',
    headline: '',
    location: '',
    email: '',
    phone: '',
    displayPhone: '',
    status: '',
    bio: '',
    profileImage: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
      const fetchProfile = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
          const res = await adminGetProfile();
          if (mounted && res.success && res.data) {
            setFormData({
              name: res.data.name || '',
              shortName: res.data.shortName || '',
              title: res.data.title || '',
              headline: res.data.headline || '',
              location: res.data.location || '',
              email: res.data.email || '',
              phone: res.data.phone || '',
              displayPhone: res.data.displayPhone || '',
              status: res.data.status || '',
              bio: res.data.bio || '',
              profileImage: res.data.profileImage || '',
            });
          }
        } catch (err) {
          showToast('Failed to load profile data', 'error');
        } finally {
          if (mounted && !silent) setLoading(false);
        }
      };
      fetchProfile();

      const handleRefresh = () => fetchProfile(true);
      window.addEventListener('admin:refresh', handleRefresh);

      return () => {
        mounted = false;
        window.removeEventListener('admin:refresh', handleRefresh);
      };
    }, [showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminUpdateProfile(token, formData);
      if (res.success) {
        showToast('Profile information updated successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Personal Profile & Bio</h1>
          <p className="admin-page-desc">
            Manage your personal identity, contact details, titles, and bio descriptions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Basic Details</h2>
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="admin-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Short Name</label>
              <input
                type="text"
                name="shortName"
                className="admin-input"
                value={formData.shortName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Professional Title</label>
              <input
                type="text"
                name="title"
                required
                className="admin-input"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Availability / Status</label>
              <input
                type="text"
                name="status"
                className="admin-input"
                placeholder="e.g. Open to Opportunities"
                value={formData.status}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Headline / Tagline</label>
            <input
              type="text"
              name="headline"
              className="admin-input"
              value={formData.headline}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Full Bio</label>
            <textarea
              name="bio"
              rows={5}
              className="admin-textarea"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Contact & Location Info</h2>
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Public Email</label>
              <input
                type="email"
                name="email"
                className="admin-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Location</label>
              <input
                type="text"
                name="location"
                className="admin-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Raw Phone Number</label>
              <input
                type="text"
                name="phone"
                className="admin-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Formatted Phone (Display)</label>
              <input
                type="text"
                name="displayPhone"
                className="admin-input"
                value={formData.displayPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <ImageUploader
            value={formData.profileImage}
            onChange={(url) => {
              setFormData((prev) => ({ ...prev, profileImage: url }));
              // Proactively persist profile image update
              adminUpdateProfile(token, { ...formData, profileImage: url })
                .then(() => refreshPortfolio())
                .catch((err) => console.warn('Background auto-save notice:', err.message));
            }}
            onUploadStateChange={setImageUploading}
            label="Avatar / Profile Photo (Featured in Hero & About sections)"
            hint="Upload or change your portrait photo. It will update immediately across both the Hero greeting and the About showcase."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving || imageUploading}
            className="admin-btn admin-btn-primary"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                <span>Saving...</span>
              </>
            ) : imageUploading ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
