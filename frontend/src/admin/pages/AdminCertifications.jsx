import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Save,
  Loader2,
  X,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetCertifications,
  adminCreateCertification,
  adminUpdateCertification,
  adminDeleteCertification,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { ImageUploader } from '../components/ImageUploader';

const initialCertState = {
  title: '',
  institution: '',
  description: '',
  skillsCovered: [],
  certificateImage: '',
  certificateUrl: '',
  issueDate: '',
  displayOrder: 0,
  isActive: true,
};

export const AdminCertifications = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialCertState);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCertifications = async () => {
    try {
      const res = await adminGetCertifications(true);
      if (res.success) {
        setCertifications(res.data);
      }
    } catch (err) {
      showToast('Failed to load certifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialCertState,
      displayOrder: certifications.length,
    });
    setSkillInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingId(cert._id);
    setFormData({
      title: cert.title || '',
      institution: cert.institution || '',
      description: cert.description || '',
      skillsCovered: Array.isArray(cert.skillsCovered) ? [...cert.skillsCovered] : [],
      certificateImage: cert.certificateImage || '',
      certificateUrl: cert.certificateUrl || '',
      issueDate: cert.issueDate || '',
      displayOrder: cert.displayOrder || 0,
      isActive: cert.isActive !== undefined ? cert.isActive : true,
    });
    setSkillInput('');
    setModalOpen(true);
  };

  const handleAddSkill = (e) => {
    if (e && e.key && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!formData.skillsCovered.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skillsCovered: [...prev.skillsCovered, trimmed] }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsCovered: prev.skillsCovered.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.institution.trim() || !formData.description.trim()) {
      showToast('Please provide Title, Institution, and Description.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await adminUpdateCertification(token, editingId, formData);
        if (res.success) {
          showToast('Certification updated successfully!', 'success');
          setCertifications((prev) =>
            prev.map((item) => (item._id === editingId ? res.data : item))
          );
          setModalOpen(false);
          refreshPortfolio();
        }
      } else {
        const res = await adminCreateCertification(token, formData);
        if (res.success) {
          showToast('Certification created successfully!', 'success');
          setCertifications((prev) => [...prev, res.data]);
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

  const handleOpenDelete = (cert) => {
    setCertToDelete(cert);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!certToDelete) return;
    setDeleting(true);
    try {
      const res = await adminDeleteCertification(token, certToDelete._id);
      if (res.success) {
        showToast('Certification deleted.', 'success');
        setCertifications((prev) => prev.filter((c) => c._id !== certToDelete._id));
        setDeleteModalOpen(false);
        setCertToDelete(null);
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete certification.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-title">
          <div className="admin-page-icon">
            <Award size={24} />
          </div>
          <div>
            <h1>Certifications & Credentials</h1>
            <p>Manage professional credentials, issuing authorities, and verified skills</p>
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Certification</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="140px" />
      ) : certifications.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certifications Found"
          description="Add verified professional certificates, course completions, or specializations."
          actionLabel="Add Certification"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="admin-responsive-cards-grid">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              className="admin-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                opacity: cert.isActive ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                      flexShrink: 0,
                    }}
                  >
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {cert.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', margin: '0.15rem 0 0 0', fontWeight: 500 }}>
                      {cert.institution}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    onClick={() => handleOpenEdit(cert)}
                    title="Edit Certification"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => handleOpenDelete(cert)}
                    title="Delete Certification"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {cert.issueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <Calendar size={13} />
                  <span>Issued: {cert.issueDate}</span>
                </div>
              )}

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.85rem', flex: 1 }}>
                {cert.description}
              </p>

              {/* Skills Covered */}
              {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {cert.skillsCovered.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Certificate File Attachment (Image or PDF) */}
              {cert.certificateImage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.45rem 0.65rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  {cert.certificateImage.toLowerCase().endsWith('.pdf') ? (
                    <FileText size={16} color="#ef4444" />
                  ) : (
                    <Award size={16} color="var(--accent-cyan)" />
                  )}
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {cert.certificateImage.split('/').pop()}
                  </span>
                  <a
                    href={cert.certificateImage}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <span>View</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Certificate URL link */}
              {cert.certificateUrl && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.78rem',
                      color: 'var(--accent-cyan)',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>View Official Credential</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CERTIFICATION MODAL */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3>{editingId ? 'Edit Certification' : 'Add Certification'}</h3>
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
                <label className="admin-label">
                  Certification Title <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Full-Stack Web Development Specialization"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">
                    Issuing Organization <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Meta, IBM, Coursera, FreeCodeCamp"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Issue Date / Year</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 2024 or Nov 2023"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Description / Curriculum <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="What was mastered and evaluated in this credential..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Skills Covered */}
              <div className="admin-form-group">
                <label className="admin-label">Skills Covered</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Type skill (e.g. MongoDB, Express.js) and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleAddSkill()}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {formData.skillsCovered.map((s, idx) => (
                    <span
                      key={idx}
                      className="admin-badge admin-badge-info"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {s}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveSkill(idx)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Credential Verification URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://coursera.org/verify/..."
                  value={formData.certificateUrl}
                  onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                />
              </div>

              {/* Certificate Image or PDF Document */}
              <ImageUploader
                value={formData.certificateImage}
                onChange={(url) => setFormData({ ...formData, certificateImage: url })}
                onUploadStateChange={setImageUploading}
                label="Certificate File (Image or PDF Document)"
                hint="Upload Certificate image (PNG, JPG, WEBP) or PDF document (max 10MB)"
                accept="image/*,application/pdf,.pdf"
              />

              <div className="admin-grid-2" style={{ alignItems: 'center', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Display on portfolio</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Display Order:</label>
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
                  disabled={saving || imageUploading}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || imageUploading}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="admin-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : imageUploading ? (
                    <>
                      <Loader2 size={16} className="admin-spinner" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingId ? 'Save Changes' : 'Create Certification'}</span>
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
        title="Delete Certification"
        message={`Are you sure you want to delete "${certToDelete?.title}"?`}
        confirmText={deleting ? 'Deleting...' : 'Delete Certification'}
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCertToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminCertifications;
