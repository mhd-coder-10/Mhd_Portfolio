import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Send,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Save,
  Loader2,
  X,
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  TelegramIcon,
} from '../../components/SocialIcons';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetSocialLinks,
  adminCreateSocialLink,
  adminUpdateSocialLink,
  adminDeleteSocialLink,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const platformOptions = [
  { id: 'github', label: 'GitHub', icon: 'Github', defaultIcon: GithubIcon },
  { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', defaultIcon: LinkedinIcon },
  { id: 'instagram', label: 'Instagram', icon: 'Instagram', defaultIcon: InstagramIcon },
  { id: 'telegram', label: 'Telegram', icon: 'Send', defaultIcon: TelegramIcon },
  { id: 'email', label: 'Email', icon: 'Mail', defaultIcon: Mail },
  { id: 'phone', label: 'Phone', icon: 'Phone', defaultIcon: Phone },
  { id: 'website', label: 'Website / Blog', icon: 'Globe', defaultIcon: Globe },
  { id: 'other', label: 'Custom Link', icon: 'Link', defaultIcon: LinkIcon },
];

const renderIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case 'github':
      return <GithubIcon size={18} />;
    case 'linkedin':
      return <LinkedinIcon size={18} />;
    case 'instagram':
      return <InstagramIcon size={18} />;
    case 'send':
    case 'telegram':
      return <TelegramIcon size={18} />;
    case 'mail':
    case 'email':
      return <Mail size={18} />;
    case 'phone':
      return <Phone size={18} />;
    case 'globe':
      return <Globe size={18} />;
    default:
      return <LinkIcon size={18} />;
  }
};

const initialSocialState = {
  platform: 'github',
  label: '',
  url: '',
  username: '',
  icon: 'Github',
  displayOrder: 0,
  isActive: true,
};

export const AdminSocialLinks = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialSocialState);
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLinks = async () => {
    try {
      const res = await adminGetSocialLinks(true);
      if (res.success) {
        setSocialLinks(res.data);
      }
    } catch (err) {
      showToast('Failed to load social links.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialSocialState,
      displayOrder: socialLinks.length,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (link) => {
    setEditingId(link._id);
    setFormData({
      platform: link.platform || 'github',
      label: link.label || '',
      url: link.url || '',
      username: link.username || '',
      icon: link.icon || 'Link',
      displayOrder: link.displayOrder || 0,
      isActive: link.isActive !== undefined ? link.isActive : true,
    });
    setModalOpen(true);
  };

  const handlePlatformChange = (pId) => {
    const matched = platformOptions.find((p) => p.id === pId);
    setFormData((prev) => ({
      ...prev,
      platform: pId,
      label: prev.label ? prev.label : matched?.label || '',
      icon: matched?.icon || 'Link',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.url.trim()) {
      showToast('Please provide a Label and URL.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await adminUpdateSocialLink(token, editingId, formData);
        if (res.success) {
          showToast('Social link updated successfully!', 'success');
          setSocialLinks((prev) =>
            prev.map((item) => (item._id === editingId ? res.data : item))
          );
          setModalOpen(false);
          refreshPortfolio();
        }
      } else {
        const res = await adminCreateSocialLink(token, formData);
        if (res.success) {
          showToast('Social link added successfully!', 'success');
          setSocialLinks((prev) => [...prev, res.data]);
          setModalOpen(false);
          refreshPortfolio();
        }
      }
    } catch (err) {
      showToast(err.message || 'Operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (link) => {
    setLinkToDelete(link);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;
    setDeleting(true);
    try {
      const res = await adminDeleteSocialLink(token, linkToDelete._id);
      if (res.success) {
        showToast('Social link deleted.', 'success');
        setSocialLinks((prev) => prev.filter((l) => l._id !== linkToDelete._id));
        setDeleteModalOpen(false);
        setLinkToDelete(null);
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete social link.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (link) => {
    try {
      const updated = !link.isActive;
      const res = await adminUpdateSocialLink(token, link._id, { isActive: updated });
      if (res.success) {
        setSocialLinks((prev) =>
          prev.map((item) => (item._id === link._id ? { ...item, isActive: updated } : item))
        );
        showToast(`Link marked as ${updated ? 'active' : 'hidden'}.`, 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-title">
          <div className="admin-page-icon">
            <Share2 size={24} />
          </div>
          <div>
            <h1>Social Links & Profiles</h1>
            <p>Manage all outbound developer channels (GitHub, LinkedIn, Instagram, Telegram, Email)</p>
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Social Link</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="80px" />
      ) : socialLinks.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="No Social Links Found"
          description="Add your GitHub, LinkedIn, or other profile handles to display on your portfolio."
          actionLabel="Add Social Link"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="admin-responsive-cards-grid">
          {socialLinks.map((link) => (
            <div
              key={link._id}
              className="admin-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem 1.25rem',
                opacity: link.isActive ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                    flexShrink: 0,
                  }}
                >
                  {renderIcon(link.icon || link.platform)}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {link.label}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      #{link.displayOrder}
                    </span>
                  </div>

                  {link.username && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', margin: '0.1rem 0' }}>
                      {link.username}
                    </div>
                  )}

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <ExternalLink size={11} />
                    <span>{link.url}</span>
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleToggleActive(link)}
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  style={{ padding: '0.3rem 0.45rem' }}
                  title={link.isActive ? 'Active on public site (click to hide)' : 'Hidden (click to show)'}
                >
                  {link.isActive ? <CheckCircle size={14} style={{ color: 'var(--accent-emerald)' }} /> : <XCircle size={14} style={{ color: 'var(--text-muted)' }} />}
                </button>
                <button
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  onClick={() => handleOpenEdit(link)}
                  title="Edit Link"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  className="admin-btn admin-btn-sm admin-btn-danger"
                  onClick={() => handleOpenDelete(link)}
                  title="Delete Link"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT SOCIAL MODAL */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3>{editingId ? 'Edit Social Link' : 'Add Social Link'}</h3>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(90vh - 75px)' }}>
              <div className="admin-form-group">
                <label className="admin-label">Platform Type</label>
                <select
                  className="admin-input"
                  value={formData.platform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                >
                  {platformOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Display Label <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. GitHub, LinkedIn, Instagram"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Destination URL <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://github.com/momin-dev or mailto:user@domain.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Username / Handle</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. @username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Icon Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Github, Linkedin, Mail"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2" style={{ alignItems: 'center', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Display on portfolio</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Order:</label>
                  <input
                    type="number"
                    className="admin-input"
                    style={{ width: '70px', padding: '0.35rem 0.5rem' }}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="admin-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingId ? 'Save Changes' : 'Create Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Social Link"
        message={`Are you sure you want to delete the social link for "${linkToDelete?.label}"?`}
        confirmText={deleting ? 'Deleting...' : 'Delete Link'}
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setLinkToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminSocialLinks;
