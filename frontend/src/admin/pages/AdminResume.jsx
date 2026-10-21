import React, { useState, useEffect, useRef } from 'react';
import {
  FileDown,
  UploadCloud,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
  Save,
  Loader2,
  AlertCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetSettings,
  adminUpdateResumeSettings,
  adminUploadResume,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminResume = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    url: '/assets/resume/Momin-Mahmmadbhai-Resume.pdf',
    fileName: 'Momin-Mahmmadbhai-Resume.pdf',
    fileSize: '339 KB',
    isDownloadActive: true,
  });

  const fetchResumeSettings = async () => {
    try {
      const res = await adminGetSettings();
      if (res.success && res.data?.resume) {
        setResumeData({
          url: res.data.resume.url || '/assets/resume/Momin-Mahmmadbhai-Resume.pdf',
          fileName: res.data.resume.fileName || 'Momin-Mahmmadbhai-Resume.pdf',
          fileSize: res.data.resume.fileSize || '339 KB',
          isDownloadActive: res.data.resume.isDownloadActive !== undefined ? res.data.resume.isDownloadActive : true,
        });
      }
    } catch (err) {
      showToast('Failed to load resume settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeSettings();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF documents are allowed for resume upload.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Resume PDF cannot exceed 10MB.', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await adminUploadResume(token, file);
      if (res.success && res.data) {
        const updated = {
          ...resumeData,
          url: res.data.url,
          fileName: res.data.fileName || file.name,
          fileSize: res.data.fileSize || `${Math.round(file.size / 1024)} KB`,
        };
        setResumeData(updated);

        // Auto-save resume settings with new URL
        await adminUpdateResumeSettings(token, updated);
        showToast('New resume PDF uploaded and activated successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload resume file.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await adminUpdateResumeSettings(token, resumeData);
      if (res.success) {
        showToast('Resume settings saved successfully!', 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update resume settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-title">
          <div className="admin-page-icon">
            <FileDown size={24} />
          </div>
          <div>
            <h1>Resume / CV Management</h1>
            <p>Upload a new PDF resume, toggle public downloads, or customize file labels</p>
          </div>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSaveSettings}
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
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={2} height="200px" />
      ) : (
        <div className="admin-responsive-grid-split">
          {/* Active File & Upload Dropzone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Active Resume Card */}
            <div className="admin-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Current Active Resume
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Served to recruiters and clients on public portfolio
                    </span>
                  </div>
                </div>

                <div
                  className={`admin-badge ${resumeData.isDownloadActive ? 'admin-badge-success' : 'admin-badge-danger'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {resumeData.isDownloadActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  <span>{resumeData.isDownloadActive ? 'Download Active' : 'Download Disabled'}</span>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {resumeData.fileName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      File Size: {resumeData.fileSize} • URL: <code style={{ color: 'var(--accent-cyan)' }}>{resumeData.url}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={resumeData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                    >
                      <Eye size={13} />
                      <span>Preview PDF</span>
                    </a>
                    <a
                      href={resumeData.url}
                      download={resumeData.fileName}
                      className="admin-btn admin-btn-primary admin-btn-sm"
                    >
                      <FileDown size={13} />
                      <span>Download Test</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Upload New File Area */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="application/pdf"
                  style={{ display: 'none' }}
                />

                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--border-hover)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-surface)',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'border-color 0.2s, background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
                >
                  {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <Loader2 size={32} className="admin-spinner" style={{ color: 'var(--accent-cyan)' }} />
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        Uploading & processing PDF resume...
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'rgba(56, 189, 248, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Click to upload new PDF resume
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Accepts .pdf format up to 10MB. Replaces active file instantly upon upload.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Settings */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Download Settings & Metadata
            </h3>

            <div className="admin-form-group">
              <label className="admin-label">Public Download Button Status</label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <input
                  type="checkbox"
                  checked={resumeData.isDownloadActive}
                  onChange={(e) => setResumeData({ ...resumeData, isDownloadActive: e.target.checked })}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    Enable "Download CV / Resume" Button
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    If unchecked, the download button in Hero and Contact sections will be hidden.
                  </div>
                </div>
              </label>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Direct File URL</label>
              <input
                type="text"
                className="admin-input"
                value={resumeData.url}
                onChange={(e) => setResumeData({ ...resumeData, url: e.target.value })}
                placeholder="/assets/resume/..."
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Relative path or uploaded URL from server.
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">File Display Name</label>
              <input
                type="text"
                className="admin-input"
                value={resumeData.fileName}
                onChange={(e) => setResumeData({ ...resumeData, fileName: e.target.value })}
                placeholder="Momin-Mahmmadbhai-Resume.pdf"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">File Size Label</label>
              <input
                type="text"
                className="admin-input"
                value={resumeData.fileSize}
                onChange={(e) => setResumeData({ ...resumeData, fileSize: e.target.value })}
                placeholder="339 KB"
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '1.25rem',
              }}
            >
              <AlertCircle size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                When you upload a new PDF via the dropzone, it is securely stored on the server under <code>/uploads/resumes/</code> and your live portfolio updates immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResume;
