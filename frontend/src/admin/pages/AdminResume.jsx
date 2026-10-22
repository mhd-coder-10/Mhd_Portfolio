import React, { useState, useEffect, useRef } from 'react';
import {
  FileDown,
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Save,
  Loader2,
  ShieldCheck,
  Eye,
  Sparkles,
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
    } catch {
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
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('Resume PDF cannot exceed 15MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const res = await adminUploadResume(token, file, resumeData?.url);
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
        showToast('Resume updated and activated successfully!', 'success');
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
            <p>Upload your PDF resume, customize labels, and toggle public downloads</p>
          </div>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSaveSettings}
          disabled={saving || loading || uploading}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="admin-spinner" />
              <span>Saving...</span>
            </>
          ) : uploading ? (
            <>
              <Loader2 size={16} className="admin-spinner" />
              <span>Uploading...</span>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
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
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Current Active Resume
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Active for recruiters and visitors on live portfolio
                    </span>
                  </div>
                </div>

                <div
                  className={`admin-badge ${resumeData.isDownloadActive ? 'admin-badge-success' : 'admin-badge-danger'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem' }}
                >
                  {resumeData.isDownloadActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>{resumeData.isDownloadActive ? 'Download Active' : 'Download Disabled'}</span>
                </div>
              </div>

              {/* Active Document Details (Clean, no raw URLs) */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1.15rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={24} />
                    </div>
                    <div style={{ overflow: 'hidden', minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          fontSize: '0.98rem',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {resumeData.fileName}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                          Size: {resumeData.fileSize}
                        </span>
                        <span>•</span>
                        <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldCheck size={13} />
                          <span>Cloudinary Synced</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: 'auto' }}>
                    <a
                      href={resumeData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Eye size={13} />
                      <span>Preview</span>
                    </a>
                    <a
                      href={resumeData.url}
                      download={resumeData.fileName}
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <FileDown size={13} />
                      <span>Download Test</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Upload New File Dropzone */}
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
                    padding: '2.25rem 1.5rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.015)',
                    cursor: uploading ? 'wait' : 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                      e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.015)';
                    }
                  }}
                >
                  {uploading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', color: 'var(--accent-cyan)' }}>
                      <Loader2 size={26} className="spin-animation" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Uploading...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'rgba(56, 189, 248, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        <UploadCloud size={26} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Click or Tap to Upload New PDF Resume
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Accepts PDF up to 15MB. Automatically replaces previous file in Cloudinary.
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

            {/* Toggle Status */}
            <div className="admin-form-group">
              <label className="admin-label">Public Download Button Status</label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
                  checked={resumeData.isDownloadActive}
                  onChange={(e) => setResumeData({ ...resumeData, isDownloadActive: e.target.checked })}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Enable "Download CV / Resume" Button
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    If unchecked, the download button in Hero and Contact sections will be hidden.
                  </div>
                </div>
              </label>
            </div>

            {/* Display Name */}
            <div className="admin-form-group">
              <label className="admin-label">File Display Name</label>
              <input
                type="text"
                className="admin-input"
                value={resumeData.fileName}
                onChange={(e) => setResumeData({ ...resumeData, fileName: e.target.value })}
                placeholder="Momin-Mahmmadbhai-Resume.pdf"
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                The filename displayed to users when downloading.
              </span>
            </div>

            {/* File Size */}
            <div className="admin-form-group">
              <label className="admin-label">File Size Label</label>
              <input
                type="text"
                className="admin-input"
                value={resumeData.fileSize}
                onChange={(e) => setResumeData({ ...resumeData, fileSize: e.target.value })}
                placeholder="1.4 MB"
              />
            </div>

            {/* Cloudinary Automated Replacement Info Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                padding: '0.95rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '1.5rem',
              }}
            >
              <Sparkles size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.2rem' }}>
                  Automatic Cloudinary Replacement
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Whenever you upload a new PDF resume, previous files are automatically deleted from Cloudinary storage, keeping only your single latest resume file.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResume;
