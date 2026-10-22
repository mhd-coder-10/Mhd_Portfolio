import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Link, FileText, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminUploadImage, adminDeleteUploadedFile } from '../../services/api';
import { useToast } from './AdminToast';

/**
 * Fast client-side image downscaling/compression helper.
 * Reduces 5-15MB mobile camera images to ~250-400KB in 40ms.
 */
const compressImageIfNeeded = (file) => {
  return new Promise((resolve) => {
    // Only compress raster images; skip PDFs, SVGs, GIFs, and small images
    if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
      return resolve(file);
    }
    if (file.size < 600 * 1024) {
      return resolve(file);
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1600;
          const maxHeight = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                return resolve(file);
              }
              const safeName = file.name.replace(/\.[^.]+$/, '.jpg');
              const compressedFile = new File([blob], safeName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    } catch {
      resolve(file);
    }
  });
};

export const ImageUploader = ({
  value = '',
  onChange,
  onUploadStateChange,
  label = 'Project Image',
  hint = 'Supports PNG, JPG, WEBP, SVG or PDF (max 10MB)',
  accept = 'image/*,application/pdf,.pdf',
}) => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const isPdf = typeof value === 'string' && (value.toLowerCase().endsWith('.pdf') || value.toLowerCase().includes('.pdf'));

  const setUploadState = (isUp, statusText = '') => {
    setUploading(isUp);
    setUploadStatus(statusText);
    if (onUploadStateChange) {
      onUploadStateChange(isUp);
    }
  };

  const handleFileChange = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    if (rawFile.size > 15 * 1024 * 1024) {
      showToast('File size exceeds 15MB limit.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadState(true, rawFile.type.startsWith('image/') ? 'Optimizing photo...' : 'Preparing document...');

    try {
      // 1. Instant client-side compression for images
      const fileToUpload = await compressImageIfNeeded(rawFile);
      setUploadState(true, 'Uploading file to Cloudinary...');

      // 2. Stream to Cloudinary via backend API
      const response = await adminUploadImage(token, fileToUpload, value);
      if (response && response.success && response.data?.url) {
        onChange(response.data.url);
        showToast(
          value
            ? (fileToUpload.type.includes('pdf') ? 'PDF replaced successfully!' : 'Image replaced successfully!')
            : (fileToUpload.type.includes('pdf') ? 'PDF uploaded successfully!' : 'Image uploaded successfully!'),
          'success'
        );
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('[ImageUploader Error]', err);
      showToast(err.message || 'File upload failed. Please try again.', 'error');
    } finally {
      setUploadState(false, '');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setRemoving(true);
    try {
      if (value && value.includes('cloudinary.com')) {
        await adminDeleteUploadedFile(token, value);
        showToast('File removed successfully.', 'info');
      }
      onChange('');
    } catch (err) {
      console.warn('Failed to delete file from Cloudinary:', err);
      onChange('');
    } finally {
      setRemoving(false);
    }
  };

  const handleApplyUrl = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setShowUrlInput(false);
    setUrlInput('');
  };

  return (
    <div className="admin-form-group">
      {/* Hidden file input always mounted so it can be triggered from dropzone or Change button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
        <label className="admin-label" style={{ margin: 0 }}>{label}</label>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowUrlInput(!showUrlInput);
          }}
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
            placeholder="https://res.cloudinary.com/... or /assets/..."
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
                  e.target.src = '/assets/profile-momin.jpg';
                }}
              />
            )}
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {value.split('/').pop()}
              </div>
              <div style={{ fontSize: '0.74rem', color: isPdf ? '#ef4444' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={12} />
                <span>{isPdf ? 'PDF Attached on Cloudinary' : 'Image Stored on Cloudinary'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* View Button */}
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

            {/* Change / Replace File Button */}
            <button
              type="button"
              disabled={uploading}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
              title="Upload a new file to replace this one"
            >
              {uploading ? (
                <Loader2 size={13} className="spin-animation" />
              ) : (
                <RefreshCw size={13} />
              )}
              <span>{uploading ? 'Replacing...' : 'Change'}</span>
            </button>

            {/* Remove File Button */}
            <button
              type="button"
              disabled={uploading || removing}
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={handleRemove}
              title="Remove File"
            >
              {removing ? (
                <Loader2 size={14} className="spin-animation" />
              ) : (
                <X size={14} />
              )}
              <span>{removing ? 'Removing...' : 'Remove'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!uploading) fileInputRef.current?.click();
          }}
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
          {uploading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', color: 'var(--accent-cyan)' }}>
              <Loader2 size={24} className="spin-animation" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Uploading...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={30} color="var(--accent-cyan)" />
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click or Tap to Upload</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{hint}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
