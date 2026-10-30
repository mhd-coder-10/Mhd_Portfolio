import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetContactSettings,
  adminUpdateContactSettings,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminContactSettings = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp: {
      rawPhone: '9316515672',
      countryCode: '91',
      displayPhone: '+91 93165 15672',
      prefilledMessage: 'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.',
      buttonText: 'Chat on WhatsApp',
      isActive: true,
    },
    telegram: {
      username: 'Mohammad_041',
      displayLabel: '@Mohammad_041',
      profileUrl: 'https://telegram.me/Mohammad_041',
      prefilledMessage: 'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.',
      buttonText: 'Chat on Telegram',
      isActive: true,
    },
    publicEmail: 'mhd.developer10@gmail.com',
    contactEmail: 'mhd.developer10@gmail.com',
    phone: '9316515672',
    formattedPhone: '+91 93165 15672',
    location: 'Sidhpur, Patan, Gujarat, India',
    contactSectionTitle: 'Get In Touch',
    contactSectionDescription: 'Have a role, client project, or technical opportunity? Send a message directly to my inbox or connect instantly via WhatsApp or Telegram.',
  });

  const fetchContactSettings = async () => {
    try {
      const res = await adminGetContactSettings();
      if (res.success && res.data) {
        setFormData({
          whatsapp: { ...formData.whatsapp, ...res.data.whatsapp },
          telegram: { ...formData.telegram, ...res.data.telegram },
          publicEmail: res.data.publicEmail || '',
          contactEmail: res.data.contactEmail || '',
          phone: res.data.phone || '',
          formattedPhone: res.data.formattedPhone || '',
          location: res.data.location || '',
          contactSectionTitle: res.data.contactSectionTitle || 'Get In Touch',
          contactSectionDescription: res.data.contactSectionDescription || '',
        });
      }
    } catch (err) {
      showToast('Failed to load contact settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactSettings();

    // Listen to admin topbar refresh event for seamless in-place data update
    const handleRefresh = () => {
      fetchContactSettings();
    };
    window.addEventListener('admin:refresh', handleRefresh);

    return () => {
      window.removeEventListener('admin:refresh', handleRefresh);
    };
  }, []);

  const handleWhatsappChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, [field]: val },
    }));
  };

  const handleTelegramChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      telegram: { ...prev.telegram, [field]: val },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminUpdateContactSettings(token, formData);
      if (res.success) {
        showToast('Contact channels and instant messaging settings saved!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save contact settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Generate test links
  const whatsappTestUrl = `https://wa.me/${formData.whatsapp.countryCode}${formData.whatsapp.rawPhone}?text=${encodeURIComponent(
    formData.whatsapp.prefilledMessage || ''
  )}`;
  const telegramTestUrl = formData.telegram.profileUrl || `https://t.me/${formData.telegram.username}`;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-title">
          <div className="admin-page-icon">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1>WhatsApp, Telegram & Contact Settings</h1>
            <p>Configure direct messaging buttons, pre-filled greeting text, and contact information</p>
          </div>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
          disabled={saving || loading}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="admin-spinner" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="180px" />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="admin-responsive-grid-equal" style={{ marginBottom: '1.5rem' }}>
            {/* WHATSAPP CARD */}
            <div className="admin-card" style={{ borderTop: '4px solid #25D366' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(37, 211, 102, 0.1)',
                      border: '1px solid rgba(37, 211, 102, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#25D366',
                    }}
                  >
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      WhatsApp Direct Chat
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Click-to-chat integration
                    </span>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.whatsapp.isActive}
                    onChange={(e) => handleWhatsappChange('isActive', e.target.checked)}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Country Code</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="91"
                    value={formData.whatsapp.countryCode}
                    onChange={(e) => handleWhatsappChange('countryCode', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Raw Phone Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="9316515672 (digits only)"
                    value={formData.whatsapp.rawPhone}
                    onChange={(e) => handleWhatsappChange('rawPhone', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Display Phone Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="+91 93165 15672"
                    value={formData.whatsapp.displayPhone}
                    onChange={(e) => handleWhatsappChange('displayPhone', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Button Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Chat on WhatsApp"
                    value={formData.whatsapp.buttonText}
                    onChange={(e) => handleWhatsappChange('buttonText', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Pre-filled Chat Message</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Greeting text sent automatically when a visitor clicks WhatsApp..."
                  value={formData.whatsapp.prefilledMessage}
                  onChange={(e) => handleWhatsappChange('prefilledMessage', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Test your link in a new tab:
                </span>
                <a
                  href={whatsappTestUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  <ExternalLink size={12} />
                  <span>Open WhatsApp Test</span>
                </a>
              </div>
            </div>

            {/* TELEGRAM CARD */}
            <div className="admin-card" style={{ borderTop: '4px solid #229ED9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(34, 158, 217, 0.1)',
                      border: '1px solid rgba(34, 158, 217, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#229ED9',
                    }}
                  >
                    <Send size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Telegram Direct Chat
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Direct message handle
                    </span>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.telegram.isActive}
                    onChange={(e) => handleTelegramChange('isActive', e.target.checked)}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Username</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Mohammad_041 (without @)"
                    value={formData.telegram.username}
                    onChange={(e) => handleTelegramChange('username', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Handle Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="@Mohammad_041"
                    value={formData.telegram.displayLabel}
                    onChange={(e) => handleTelegramChange('displayLabel', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Direct Profile URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://telegram.me/Mohammad_041"
                    value={formData.telegram.profileUrl}
                    onChange={(e) => handleTelegramChange('profileUrl', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Button Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Chat on Telegram"
                    value={formData.telegram.buttonText}
                    onChange={(e) => handleTelegramChange('buttonText', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Pre-filled Chat Message (Optional)</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Greeting message..."
                  value={formData.telegram.prefilledMessage}
                  onChange={(e) => handleTelegramChange('prefilledMessage', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Test your link in a new tab:
                </span>
                <a
                  href={telegramTestUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  <ExternalLink size={12} />
                  <span>Open Telegram Test</span>
                </a>
              </div>
            </div>
          </div>

          {/* GENERAL CONTACT SECTION SETTINGS */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Direct Contact Details & Section Headings
            </h3>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Public Display Email</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="mhd.developer10@gmail.com"
                  value={formData.publicEmail}
                  onChange={(e) => setFormData({ ...formData, publicEmail: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Form Submissions Recipient Email</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="mhd.developer10@gmail.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Formatted Phone Number</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="+91 93165 15672"
                  value={formData.formattedPhone}
                  onChange={(e) => setFormData({ ...formData, formattedPhone: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Location / City</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Sidhpur, Patan, Gujarat, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Contact Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={formData.contactSectionTitle}
                onChange={(e) => setFormData({ ...formData, contactSectionTitle: e.target.value })}
              />
            </div>

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Contact Section Description</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={formData.contactSectionDescription}
                onChange={(e) => setFormData({ ...formData, contactSectionDescription: e.target.value })}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminContactSettings;
