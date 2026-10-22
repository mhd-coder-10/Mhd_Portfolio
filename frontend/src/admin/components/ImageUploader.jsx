import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Link, FileText, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminUploadImage, adminDeleteUploadedFile } from '../../services/api';
import { useToast } from './AdminToast';

export const ImageUploader = ({
  value = '',
  onChange,
  label = 'Project Image',
  hint = 'Supports PNG, JPG, WEBP, SVG or PDF (max 10MB)',
  accept = 'image/*,application/pdf,.pdf',
}) => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const isPdf = typeof value === 'string' && (value.toLowerCase().endsWith('.pdf') || value.toLowerCase().includes('.pdf'));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit.', 'error');
      return;
    }

    setUploading(true);
    try {
      // Pass existing value as previousUrl so the backend deletes the old Cloudinary file automatically
      const response = await adminUploadImage(token, file, value);
      if (response.success && response.data?.url) {
        onChange(response.data.url);
        showToast(file.type.includes('pdf') ? 'PDF uploaded successfully!' : 'Image uploaded successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'File upload failed.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (value && value.includes('cloudinary.com')) {
      try {
        await adminDeleteUploadedFile(token, value);
      } catch (err) {
        console.warn('Failed to delete old file from Cloudinary:', err);
      }
    }
    onChange('');
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setShowUrlInput(false);
    setUrlInput('');
  };

  return (
    <div className="admin-form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
        <label className="admin-label" style={{ margin: 0 }}>{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-cyan)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Link size={13} />
          <span>{showUrlInput ? 'Upload File' : 'Paste URL'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="https://example.com/file.png or /uploads/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleApplyUrl}>
            Set
          </button>
        </div>
      ) : value ? (
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hover)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden', minWidth: 0, flex: 1 }}>
            {isPdf ? (
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#ef4444',
                }}
              >
                <FileText size={26} />
              </div>
            ) : (
              <img
                src={value}
                alt="Uploaded preview"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-sm)',
                  objectFit: 'cover',
                  border: '1px solid var(--border-subtle)',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {value.split('/').pop()}
              </div>
              <div style={{ fontSize: '0.74rem', color: isPdf ? '#ef4444' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{isPdf ? 'PDF Document Attached' : 'Image Attached'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
              title="Open file in new tab"
            >
              <ExternalLink size={13} />
              <span>View</span>
            </a>
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={handleRemove}
              title="Remove File"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-hover)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            cursor: uploading ? 'wait' : 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.01)')}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
              <Loader2 size={24} className="spin-animation" />
              <span style={{ fontSize: '0.88rem' }}>Uploading file...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={30} color="var(--accent-cyan)" />
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click or Drag to Upload</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{hint}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
