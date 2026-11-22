'use client';

import React, { useState, useRef } from 'react';
import { uploadFileToStorage } from '../../lib/firebase/admin-service';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helpText?: string;
  recommendedSize?: string;
  aspectRatio?: string;
  required?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  label = 'Image Upload',
  helpText = 'Supports JPG, PNG, WEBP, or SVG up to 10MB.',
  recommendedSize = '800 × 800px recommended',
  aspectRatio,
  required = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return 'Invalid file type. Please upload a JPG, PNG, WEBP, or SVG image.';
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File size exceeds 10MB limit. Please compress or choose a smaller image.';
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(20);

    // Simulated progress tick for smooth UX
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev && prev < 85 ? prev + 15 : prev));
    }, 150);

    try {
      const url = await uploadFileToStorage(file, folder);
      clearInterval(interval);
      setUploadProgress(100);
      onChange(url);
    } catch (err: any) {
      clearInterval(interval);
      console.error('Image upload failed:', err);
      // Fallback: create object URL if Firebase storage fails (local preview)
      try {
        const localPreview = URL.createObjectURL(file);
        onChange(localPreview);
        setError('Uploaded as local preview (Storage upload notice: ' + (err.message || 'offline') + ')');
      } catch (e) {
        setError('Upload failed: ' + (err.message || 'Please check connection or enter URL manually.'));
      }
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(null);
      }, 300);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
    // reset input so selecting the same file again triggers change
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
  };

  return (
    <div className="admin-upload-field">
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label className="admin-label" style={{ margin: 0 }}>
            {label} {required && <span style={{ color: 'var(--crimson)' }}>*</span>}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-gold)',
              fontSize: '11px',
              fontFamily: 'var(--font-title)',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {showUrlInput ? 'Hide URL input' : 'Enter URL manually'}
          </button>
        </div>
      )}

      {/* Manual URL input fallback toggle */}
      {showUrlInput && (
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="https://example.com/image.jpg or /wp-content/uploads/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ fontSize: '12.5px' }}
          />
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Error alert */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(192, 50, 58, 0.08)',
            border: '1px solid rgba(192, 50, 58, 0.25)',
            color: 'var(--crimson)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload / Preview Box */}
      {value ? (
        <div className="admin-upload-preview-box">
          <div
            className="admin-upload-preview-image"
            style={{
              backgroundImage: `url("${value}")`,
              aspectRatio: aspectRatio || '16 / 9',
            }}
          />
          <div className="admin-upload-preview-details">
            <div className="admin-upload-preview-url" title={value}>
              {value.startsWith('http') || value.startsWith('blob:')
                ? value.split('/').pop()?.slice(-30) || 'Uploaded Image'
                : value}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-caritas-secondary"
                style={{ padding: '6px 12px', fontSize: '11.5px', height: '32px' }}
              >
                <span>🔄</span> Replace from Computer
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="btn-caritas-danger"
                style={{ padding: '6px 12px', fontSize: '11.5px', height: '32px' }}
              >
                <span>✕</span> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`admin-dropzone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {uploading ? (
            <div style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid #E8E2D9',
                  borderTopColor: 'var(--primary-gold)',
                  borderRadius: '50%',
                  animation: 'caritasSpin 0.8s linear infinite',
                  margin: '0 auto 12px',
                }}
              />
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>
                Uploading to Firebase Storage...
              </div>
              {uploadProgress !== null && (
                <div style={{ width: '140px', height: '4px', background: '#E8E2D9', borderRadius: '2px', margin: '8px auto 0', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--primary-gold)', transition: 'width 0.2s' }} />
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div className="admin-dropzone-icon">📷</div>
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 600, fontSize: '13.5px', color: 'var(--dark-obsidian)', marginBottom: '4px' }}>
                <span style={{ color: 'var(--primary-gold)', textDecoration: 'underline' }}>Click to browse</span> or drag &amp; drop an image here
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {helpText} • {recommendedSize}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
