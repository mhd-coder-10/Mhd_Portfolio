import React, { useState, useEffect, useRef } from 'react';
import {
  FileDown,
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  Eye,
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
  const [downloadingTest, setDownloadingTest] = useState(false);
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

  const handlePreview = (e) => {
    e.preventDefault();
    if (!resumeData?.url) {
      showToast('No active resume URL found.', 'error');
      return;
    }
    // Directly open PDF in browser
    window.open(resumeData.url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadTest = async (e) => {
    e.preventDefault();
    if (!resumeData?.url) {
      showToast('No active resume file available to download.', 'error');
      return;
    }

    setDownloadingTest(true);
    try {
      const targetName = resumeData.fileName || 'Momin-Mahmmadbhai-Resume.pdf';
      const safeFilename = targetName.toLowerCase().endsWith('.pdf') ? targetName : `${targetName}.pdf`;

      // Fetch as blob for immediate browser download with exact filename
      const response = await fetch(resumeData.url);
      if (!response.ok) throw new Error('Download request failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: direct download using Cloudinary attachment or local file
      const fallbackUrl = resumeData.url.includes('/upload/')
        ? resumeData.url.replace('/upload/', `/upload/fl_attachment:${encodeURIComponent((resumeData.fileName || 'Resume').replace(/\.pdf$/i, ''))}/`)
        : '/assets/resume/Momin-Mahmmadbhai-Resume.pdf';

      const link = document.createElement('a');
      link.href = fallbackUrl;
      link.download = resumeData.fileName || 'Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingTest(false);
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
                  className={`admin-badge ${resumeData.isDownloadActive ? 'admin-badge-success' : 'admin-badge-danger'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem' }}
                >
                  {resumeData.isDownloadActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>{resumeData.isDownloadActive ? 'Download Active' : 'Download Disabled'}</span>
                </div>
              </div>

              {/* Active Document Details */}
              <div className="resume-file-box">
                <div className="resume-file-info-group">
                  <div className="resume-file-icon">
                    <FileText size={24} />
                  </div>
                  <div className="resume-file-meta">
                    <div className="resume-file-name" title={resumeData.fileName}>
                      {resumeData.fileName}
                    </div>
                    <div className="resume-file-subtext">
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                        Size: {resumeData.fileSize}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="resume-file-actions">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    title="Open PDF preview in browser tab"
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTest}
                    disabled={downloadingTest}
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    title="Directly download resume file"
                  >
                    {downloadingTest ? (
                      <Loader2 size={14} className="spin-animation" />
                    ) : (
                      <FileDown size={14} />
                    )}
                    <span>{downloadingTest ? 'Downloading...' : 'Download Test'}</span>
                  </button>
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
                  className="resume-upload-dropzone"
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  style={{ cursor: uploading ? 'wait' : 'pointer' }}
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
                        <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Click or Tap to Upload New PDF Resume
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Accepts .pdf files up to 15MB. Replaces active file instantly upon upload.
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResume;
