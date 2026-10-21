import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Calendar,
  MapPin,
  Loader2,
  X,
  Save,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetExperiences,
  adminCreateExperience,
  adminUpdateExperience,
  adminDeleteExperience,
  adminReorderExperiences,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const initialExperienceState = {
  company: '',
  role: '',
  duration: '',
  type: 'Professional Experience',
  location: 'India',
  description: '',
  responsibilities: [''],
  technologies: [''],
  isCurrent: false,
  isActive: true,
  displayOrder: 0,
};

export const AdminExperience = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialExperienceState);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExperiences = async () => {
    try {
      const res = await adminGetExperiences(true);
      if (res.success) {
        setExperiences(res.data);
      }
    } catch (err) {
      showToast('Failed to load experiences', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialExperienceState,
      displayOrder: experiences.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      company: exp.company || '',
      role: exp.role || '',
      duration: exp.duration || '',
      type: exp.type || 'Professional Experience',
      location: exp.location || '',
      description: exp.description || '',
      responsibilities: exp.responsibilities?.length ? exp.responsibilities : [''],
      technologies: exp.technologies?.length ? exp.technologies : [''],
      isCurrent: !!exp.isCurrent,
      isActive: exp.isActive !== false,
      displayOrder: exp.displayOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Clean up empty lines
    const payload = {
      ...formData,
      responsibilities: formData.responsibilities.filter((r) => r.trim() !== ''),
      technologies: formData.technologies.filter((t) => t.trim() !== ''),
    };

    try {
      if (editingId) {
        await adminUpdateExperience(token, editingId, payload);
        showToast('Experience updated successfully!', 'success');
      } else {
        await adminCreateExperience(token, payload);
        showToast('Experience added successfully!', 'success');
      }
      setModalOpen(false);
      fetchExperiences();
      refreshPortfolio();
    } catch (err) {
      showToast(err.message || 'Failed to save experience.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await adminDeleteExperience(token, itemToDelete._id);
      showToast('Experience deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchExperiences();
      refreshPortfolio();
    } catch (err) {
      showToast(err.message || 'Failed to delete experience.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const newItems = [...experiences];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate displayOrders
    const orders = newItems.map((item, idx) => ({ id: item._id, displayOrder: idx + 1 }));
    setExperiences(newItems);

    try {
      await adminReorderExperiences(token, orders);
      refreshPortfolio();
    } catch (err) {
      showToast('Failed to update order.', 'error');
      fetchExperiences();
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Career Experience</h1>
          <p className="admin-page-desc">
            Manage your employment history, roles, responsibilities, and technologies used.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Position</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience records"
          description="Click the button above to add your first work experience."
          actionText="Add Experience"
          onAction={handleOpenCreate}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {experiences.map((exp, idx) => (
            <div key={exp._id} className="admin-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span className="admin-badge admin-badge-info">{exp.type}</span>
                    {exp.isCurrent && (
                      <span className="admin-badge admin-badge-success">Current Job</span>
                    )}
                    {!exp.isActive && (
                      <span className="admin-badge admin-badge-danger">Hidden</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0' }}>
                    {exp.role} <span style={{ color: 'var(--accent-cyan)' }}>@ {exp.company}</span>
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} color="var(--accent-indigo)" />
                      <span>{exp.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0.75rem 0' }}>
                    {exp.description}
                  </p>

                  {/* Tech badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                    {exp.technologies?.map((tech, tIdx) => (
                      <span key={tIdx} className="tech-badge" style={{ fontSize: '0.74rem' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Reordering */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={idx === experiences.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => handleOpenEdit(exp)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => {
                      setItemToDelete(exp);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {editingId ? 'Edit Work Experience' : 'Add New Work Experience'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="admin-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(90vh - 75px)' }}>
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Company Name</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Job Role / Title</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-grid-3">
                <div className="admin-form-group">
                  <label className="admin-label">Duration (e.g. July 2026 - Present)</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Type (e.g. Current Position)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Role Overview / Summary</label>
                <textarea
                  rows={3}
                  required
                  className="admin-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Responsibilities list */}
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Core Responsibilities (Bullet Points)</label>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setFormData({ ...formData, responsibilities: [...formData.responsibilities, ''] })}
                  >
                    <Plus size={13} />
                    <span>Add Item</span>
                  </button>
                </div>
                {formData.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={resp}
                      onChange={(e) => {
                        const updated = [...formData.responsibilities];
                        updated[rIdx] = e.target.value;
                        setFormData({ ...formData, responsibilities: updated });
                      }}
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => {
                          const updated = formData.responsibilities.filter((_, i) => i !== rIdx);
                          setFormData({ ...formData, responsibilities: updated });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="admin-form-group">
                <label className="admin-label">Technologies (comma-separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="React.js, Node.js, Express.js, MongoDB, REST APIs"
                  value={formData.technologies.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technologies: e.target.value.split(',').map((t) => t.trim()),
                    })
                  }
                />
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '2rem', margin: '1.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  />
                  <span>Mark as Current Job</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active & Visible on Public Portfolio</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
                  <span>{saving ? 'Saving...' : 'Save Position'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Experience"
        message={`Are you sure you want to delete "${itemToDelete?.role} @ ${itemToDelete?.company}"? This will remove it from your public portfolio.`}
        loading={deleting}
      />
    </div>
  );
};

export default AdminExperience;
