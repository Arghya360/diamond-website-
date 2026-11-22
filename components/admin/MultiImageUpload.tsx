'use client';

import React, { useState, useRef } from 'react';
import { uploadFileToStorage } from '../../lib/firebase/admin-service';
import type { ProductImage } from '../../types/admin';

interface MultiImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  folder?: string;
  maxImages?: number;
}

export default function MultiImageUpload({
  images,
  onChange,
  folder = 'products',
  maxImages = 8,
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return `"${file.name}": Unsupported format. Please upload JPG, PNG, WEBP, or SVG.`;
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `"${file.name}": Exceeds 10MB limit.`;
    }
    return null;
  };

  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (images.length + files.length > maxImages) {
      setError(`Maximum limit is ${maxImages} photographs. You selected ${files.length} more.`);
      return;
    }

    setError(null);
    setUploadingCount(files.length);

    const uploadedImages: ProductImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationErr = validateFile(file);
      if (validationErr) {
        setError(validationErr);
        continue;
      }

      try {
        const url = await uploadFileToStorage(file, folder);
        uploadedImages.push({
          url,
          alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          isMain: images.length === 0 && uploadedImages.length === 0,
        });
      } catch (err: any) {
        console.error('Failed to upload file:', file.name, err);
        // Fallback local blob URL
        try {
          const blobUrl = URL.createObjectURL(file);
          uploadedImages.push({
            url: blobUrl,
            alt: file.name,
            isMain: images.length === 0 && uploadedImages.length === 0,
          });
        } catch (e) {
          setError(`Upload failed for "${file.name}".`);
        }
      }
    }

    setUploadingCount(0);
    if (uploadedImages.length > 0) {
      onChange([...images, ...uploadedImages]);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleSetMain = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If we removed the main image, make the first one main
    if (updated.length > 0 && !updated.some((img) => img.isMain)) {
      updated[0].isMain = true;
    }
    onChange(updated);
  };

  const handleAltChange = (index: number, newAlt: string) => {
    const updated = images.map((img, i) => (i === index ? { ...img, alt: newAlt } : img));
    onChange(updated);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    const newImg: ProductImage = {
      url: manualUrl.trim(),
      alt: 'Product photograph',
      isMain: images.length === 0,
    };
    onChange([...images, newImg]);
    setManualUrl('');
  };

  return (
    <div className="admin-multi-upload-wrap">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
      />

      {/* Header / Meta bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {images.length} of {maxImages} gallery photographs added
        </div>
        <button
          type="button"
          onClick={() => setShowManualAdd(!showManualAdd)}
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
          {showManualAdd ? 'Hide manual URL' : '+ Add image by URL'}
        </button>
      </div>

      {showManualAdd && (
        <form onSubmit={handleAddManualUrl} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Paste image URL (e.g. /wp-content/uploads/shop page/pro-21-300x300.png)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            style={{ flex: 1, fontSize: '12px', height: '36px' }}
          />
          <button type="submit" className="btn-caritas-secondary" style={{ padding: '0 14px', height: '36px', fontSize: '12px' }}>
            Add
          </button>
        </form>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'rgba(192, 50, 58, 0.08)',
            border: '1px solid rgba(192, 50, 58, 0.25)',
            color: 'var(--crimson)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            marginBottom: '12px',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          className={`admin-dropzone ${isDragging ? 'dragging' : ''} ${uploadingCount > 0 ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => uploadingCount === 0 && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          style={{ marginBottom: '16px' }}
        >
          {uploadingCount > 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '3px solid #E8E2D9',
                  borderTopColor: 'var(--primary-gold)',
                  borderRadius: '50%',
                  animation: 'caritasSpin 0.8s linear infinite',
                  margin: '0 auto 10px',
                }}
              />
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 600, fontSize: '13px' }}>
                Uploading {uploadingCount} image{uploadingCount === 1 ? '' : 's'} to Firebase...
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div className="admin-dropzone-icon">📷</div>
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 600, fontSize: '13.5px', color: 'var(--dark-obsidian)', marginBottom: '4px' }}>
                <span style={{ color: 'var(--primary-gold)', textDecoration: 'underline' }}>Browse local computer</span> or drag &amp; drop multiple diamond photographs
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                JPG, PNG, WEBP up to 10MB each. High-resolution square crops (800 × 800px) look best on the storefront.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div className="admin-gallery-grid">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`admin-gallery-card ${img.isMain ? 'is-main' : ''}`}
            >
              <div
                className="admin-gallery-thumb"
                style={{ backgroundImage: `url("${img.url}")` }}
              >
                {img.isMain && (
                  <span className="admin-gallery-main-badge">
                    ★ Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="admin-gallery-delete-btn"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Alt text / caption..."
                  value={img.alt || ''}
                  onChange={(e) => handleAltChange(idx, e.target.value)}
                  className="admin-input"
                  style={{ fontSize: '11px', height: '28px', padding: '4px 8px' }}
                />

                {!img.isMain && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(idx)}
                    className="btn-caritas-secondary"
                    style={{ fontSize: '10.5px', padding: '3px 8px', height: '26px', justifyContent: 'center' }}
                  >
                    Set as Main
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
