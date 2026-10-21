import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Languages,
  CheckCircle,
  XCircle,
  Save,
  Loader2,
  X,
  MapPin,
  Calendar,
  Award,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetEducation,
  adminCreateEducation,
  adminUpdateEducation,
  adminDeleteEducation,
  adminUpdateLanguages,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const initialEducationState = {
  degree: '',
  institution: '',
  duration: '',
  score: '',
  location: 'India',
  details: '',
  displayOrder: 0,
  isActive: true,
};

export const AdminEducation = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [educationList, setEducationList] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Education Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialEducationState);
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Languages editing state
  const [savingLanguages, setSavingLanguages] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangProficiency, setNewLangProficiency] = useState('Professional Working');

  const fetchData = async () => {
    try {
      const res = await adminGetEducation(true);
      if (res.success && res.data) {
        setEducationList(res.data.education || []);
        setLanguages(res.data.languages || []);
      }
    } catch (err) {
      showToast('Failed to load education and languages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialEducationState,
      displayOrder: educationList.length,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (edu) => {
    setEditingId(edu._id);
    setFormData({
      degree: edu.degree || '',
      institution: edu.institution || '',
      duration: edu.duration || '',
      score: edu.score || '',
      location: edu.location || 'India',
      details: edu.details || '',
      displayOrder: edu.displayOrder || 0,
      isActive: edu.isActive !== undefined ? edu.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim() || !formData.duration.trim()) {
      showToast('Please provide Degree, Institution, and Duration.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await adminUpdateEducation(token, editingId, formData);
        if (res.success) {
          showToast('Education record updated.', 'success');
          setEducationList((prev) =>
            prev.map((item) => (item._id === editingId ? res.data : item))
          );
          setModalOpen(false);
          refreshPortfolio();
        }
      } else {
        const res = await adminCreateEducation(token, formData);
        if (res.success) {
          showToast('Education record created.', 'success');
          setEducationList((prev) => [...prev, res.data]);
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

  const handleOpenDelete = (edu) => {
    setRecordToDelete(edu);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    setDeleting(true);
    try {
      const res = await adminDeleteEducation(token, recordToDelete._id);
      if (res.success) {
        showToast('Education record deleted.', 'success');
        setEducationList((prev) => prev.filter((e) => e._id !== recordToDelete._id));
        setDeleteModalOpen(false);
        setRecordToDelete(null);
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete record.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Language management
  const handleAddLanguage = () => {
    if (!newLangName.trim()) return;
    const newLang = {
      name: newLangName.trim(),
      proficiency: newLangProficiency.trim(),
      displayOrder: languages.length,
    };
    setLanguages([...languages, newLang]);
    setNewLangName('');
  };

  const handleRemoveLanguage = (idx) => {
    setLanguages(languages.filter((_, index) => index !== idx));
  };

  const handleSaveLanguages = async () => {
    setSavingLanguages(true);
    try {
      const res = await adminUpdateLanguages(token, languages);
      if (res.success) {
        showToast('Languages updated successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update languages.', 'error');
    } finally {
      setSavingLanguages(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-title">
          <div className="admin-page-icon">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1>Education & Languages</h1>
            <p>Manage academic degrees, institutions, GPA/percentage, and spoken languages</p>
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="120px" />
      ) : (
        <div className="admin-responsive-grid-split">
          {/* Education Records Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Academic Background ({educationList.length})
              </h2>
            </div>

            {educationList.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No Education Records"
                description="Add your degree, university, GPA or key coursework."
                actionLabel="Add Education"
                onAction={handleOpenCreate}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {educationList.map((edu) => (
                  <div
                    key={edu._id}
                    className="admin-card"
                    style={{
                      position: 'relative',
                      opacity: edu.isActive ? 1 : 0.6,
                      borderLeft: '4px solid var(--accent-cyan)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                          {edu.degree}
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', fontWeight: 500, margin: '0.2rem 0' }}>
                          {edu.institution}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                          onClick={() => handleOpenEdit(edu)}
                          title="Edit Record"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={() => handleOpenDelete(edu)}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {edu.duration}
                      </span>
                      {edu.score && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-emerald)' }}>
                          <Award size={13} /> {edu.score}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} /> {edu.location}
                      </span>
                    </div>

                    {edu.details && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                        {edu.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Languages Column */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Languages size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Languages
                </h2>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={handleSaveLanguages}
                disabled={savingLanguages}
              >
                {savingLanguages ? <Loader2 size={13} className="admin-spinner" /> : <Save size={13} />}
                <span>Save Languages</span>
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Add and manage languages displayed in your portfolio's profile sidebar.
            </p>

            {/* List of current languages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {lang.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                      {lang.proficiency}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-rose)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                    }}
                    title="Remove language"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
              {languages.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No languages added.
                </p>
              )}
            </div>

            {/* Add Language Form */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <h4 style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Add New Language
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Language name (e.g. English, Gujarati, Hindi)"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                />
                <select
                  className="admin-input"
                  value={newLangProficiency}
                  onChange={(e) => setNewLangProficiency(e.target.value)}
                >
                  <option value="Native / Bilingual">Native / Bilingual</option>
                  <option value="Full Professional Proficiency">Full Professional Proficiency</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Elementary">Elementary</option>
                </select>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={handleAddLanguage}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Plus size={14} />
                  <span>Add to List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EDUCATION MODAL */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3>{editingId ? 'Edit Education Record' : 'Add Education Record'}</h3>
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
                  Degree / Qualification <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Master of Computer Applications (MCA) or BCA"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Institution / University <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Gujarat Technological University (GTU)"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  required
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">
                    Duration / Years <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 2022 – 2024"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Score / CGPA / Grade</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 8.42 CGPA or First Class"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Gujarat, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Key Coursework / Academic Highlights</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Key areas of study: Advanced Web Engineering, Distributed Database Systems, Software Architecture..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.25rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Display on public portfolio</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
                      <span>{editingId ? 'Save Changes' : 'Create Record'}</span>
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
        title="Delete Education Record"
        message={`Are you sure you want to delete "${recordToDelete?.degree}" from ${recordToDelete?.institution}?`}
        confirmText={deleting ? 'Deleting...' : 'Delete Record'}
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminEducation;
