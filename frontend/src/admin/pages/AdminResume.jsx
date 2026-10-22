import React, { useState, useEffect, useRef } from 'react';
import {
  FileDown,
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetSettings,
  adminUpdateResumeSettings,
  adminUploadResume,
  adminDeleteResume,
  adminDeleteUploadedFile,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const AdminResume = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    url: '',
    fileName: '',
    fileSize: '',
    isDownloadActive: false,
  });

  const fetchResumeSettings = async () => {
    try {
      const res = await adminGetSettings();
      if (res.success && res.data?.resume) {
        setResumeData({
          url: res.data.resume.url || '',
          fileName: res.data.resume.fileName || '',
          fileSize: res.data.resume.fileSize || '',
          isDownloadActive: res.data.resume.isDownloadActive !== undefined ? res.data.resume.isDownloadActive : false,
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
    return () => {
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    };
  }, []);

  // When a user selects a file from disk, stage it locally without uploading yet
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF documents are allowed for resume.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('Resume PDF cannot exceed 15MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Revoke previous blob preview if any
    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    const blobUrl = URL.createObjectURL(file);
    setPendingFile(file);
    setPendingPreviewUrl(blobUrl);

    // Auto-fill input fields so the user immediately sees the chosen file details
    setResumeData((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      isDownloadActive: true,
    }));

    showToast('File selected. Click "Save Settings" to upload and apply.', 'info');
  };

  // Upload to Cloudinary and update database ONLY when Save Settings button is clicked
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      let finalUrl = resumeData.url;

      // If a new PDF was selected, upload it to Cloudinary now
      if (pendingFile) {
        const uploadRes = await adminUploadResume(token, pendingFile, resumeData?.url);
        if (uploadRes.success && uploadRes.data?.url) {
          finalUrl = uploadRes.data.url;
        } else {
          throw new Error(uploadRes.message || 'Failed to upload resume to storage.');
        }
      }

      const updated = {
        ...resumeData,
        url: finalUrl,
        fileName: resumeData.fileName || (pendingFile ? pendingFile.name : 'Resume.pdf'),
        fileSize: resumeData.fileSize || (pendingFile ? `${Math.round(pendingFile.size / 1024)} KB` : '300 KB'),
      };

      const res = await adminUpdateResumeSettings(token, updated);
      if (res.success) {
        setResumeData(updated);
        setPendingFile(null);
        if (pendingPreviewUrl) {
          URL.revokeObjectURL(pendingPreviewUrl);
          setPendingPreviewUrl(null);
        }
        showToast('Resume and settings saved successfully!', 'success');
        refreshPortfolio();
      } else {
        throw new Error(res.message || 'Failed to save settings.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save resume settings.', 'error');
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpenFile = () => {
    if (pendingPreviewUrl) {
      window.open(pendingPreviewUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (resumeData?.url) {
      window.open(resumeData.url, '_blank', 'noopener,noreferrer');
      return;
    }
    showToast('No active resume file found.', 'error');
  };

  const handleDeleteResume = async (e) => {
    e.stopPropagation();

    // If discarding an un-saved pending file
    if (pendingFile) {
      setPendingFile(null);
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
        setPendingPreviewUrl(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Selected file discarded.', 'info');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this resume? It will be permanently removed from database and storage.')) {
      return;
    }

    setDeleting(true);
    try {
      if (resumeData.url) {
        try {
          await adminDeleteUploadedFile(token, resumeData.url);
        } catch {
          // ignore
        }
      }
      try {
        await adminDeleteResume(token, resumeData.url);
      } catch {
        // ignore
      }
      const cleared = {
        url: '',
        fileName: '',
        fileSize: '',
        isDownloadActive: false,
      };
      setResumeData(cleared);
      await adminUpdateResumeSettings(token, cleared);
      refreshPortfolio();
      showToast('Resume file deleted successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete resume file.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const hasFile = Boolean(pendingFile || (resumeData?.url && resumeData?.fileName));
  const currentFileName = pendingFile ? pendingFile.name : resumeData.fileName;
  const currentFileSize = pendingFile ? `${Math.round(pendingFile.size / 1024)} KB` : resumeData.fileSize;

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
          disabled={saving || loading || deleting}
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
            <div className="admin-card resume-active-card">
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
                  className={`admin-badge ${hasFile && resumeData.isDownloadActive ? 'admin-badge-success' : 'admin-badge-danger'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem' }}
                >
                  {hasFile && resumeData.isDownloadActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>{hasFile && resumeData.isDownloadActive ? 'Download Active' : 'Download Disabled'}</span>
                </div>
              </div>

              {/* Active Document Details or Empty State */}
              {hasFile ? (
                <div className="resume-file-box">
                  {/* Clickable file row: clicking/touching opens file inline in browser */}
                  <div
                    className="resume-file-info-group"
                    onClick={handleOpenFile}
                    title="Click or tap to preview resume in browser"
                  >
                    <div className="resume-file-icon">
                      <FileText size={22} />
                    </div>
                    <div className="resume-file-meta">
                      <div className="resume-file-name">
                        <span>{currentFileName}</span>
                        <ExternalLink size={13} style={{ opacity: 0.65, flexShrink: 0 }} />
                      </div>
                      <div className="resume-file-subtext">
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                          Size: {currentFileSize || 'PDF'}
                        </span>
                        <span>•</span>
                        {pendingFile ? (
                          <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                            Ready to save (Click Save Settings)
                          </span>
                        ) : (
                          <span style={{ color: 'var(--accent-cyan)' }}>Tap to view file</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clean X button */}
                  <button
                    type="button"
                    onClick={handleDeleteResume}
                    disabled={saving || deleting}
                    className="resume-delete-btn"
                    title={pendingFile ? 'Discard selected file' : 'Delete resume from database and storage'}
                  >
                    {deleting ? (
                      <Loader2 size={16} className="spin-animation" />
                    ) : (
                      <X size={18} />
                    )}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    padding: '1.35rem 1rem',
                    textAlign: 'center',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-subtle)',
                    marginBottom: '1.25rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>
                    No active resume uploaded yet.
                  </p>
                  <span style={{ fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Upload a PDF resume below to activate public downloads.
                  </span>
                </div>
              )}

              {/* Upload New File Dropzone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="application/pdf"
                  style={{ display: 'none' }}
                />

                <div
                  className="resume-upload-dropzone"
                  onClick={() => !saving && fileInputRef.current?.click()}
                  style={{ cursor: saving ? 'wait' : 'pointer' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: pendingFile ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: pendingFile ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                      }}
                    >
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {pendingFile ? 'File Selected (Click Save Settings)' : 'Click or Tap to Select New PDF Resume'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {pendingFile
                          ? `Ready: ${pendingFile.name} — Click Save Settings above to upload`
                          : 'Accepts .pdf files up to 15MB. Click Save Settings to apply.'}
                      </div>
                    </div>
                  </div>
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
                    If unchecked, the download button in Hero and Navigation will show as unavailable.
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResume;
