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

  const handleRemove = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    if (images[index].isMain && next.length > 0) {
      next[0].isMain = true;
    }
    onChange(next);
  };

  const handleSetMain = (index: number) => {
    const next = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(next);
  };

  const handleAltChange = (index: number, alt: string) => {
    const next = images.map((img, i) => (i === index ? { ...img, alt } : img));
    onChange(next);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    if (images.length >= maxImages) {
      setError(`Maximum limit is ${maxImages} photographs.`);
      return;
    }

    onChange([
      ...images,
      {
        url: manualUrl.trim(),
        alt: 'Haute Joaillerie Piece',
        isMain: images.length === 0,
      },
    ]);
    setManualUrl('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
      />

      {/* Meta Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#707974' }}>
          {images.length} of {maxImages} gallery photographs added
        </div>
        <button
          type="button"
          onClick={() => setShowManualAdd(!showManualAdd)}
          style={{
            background: 'none',
            border: 'none',
            color: '#725B38',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          {showManualAdd ? '✕ Close manual URL' : '+ Add photo by URL'}
        </button>
      </div>

      {showManualAdd && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Paste image URL (e.g. /images/products/diamond-ring.png)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            style={{
              flex: 1,
              height: 38,
              padding: '0 12px',
              borderRadius: 8,
              border: '1px solid #EAEDFF',
              backgroundColor: '#F2F3FF',
              fontSize: 12.5,
              color: '#131B2E',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            style={{
              padding: '0 16px',
              height: 38,
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#003629',
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add URL
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#FFDAD6',
            border: '1px solid #FFB4AB',
            color: '#BA1A1A',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>warning</span>
          <span>{error}</span>
        </div>
      )}

      {/* Luxury Dropzone */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => uploadingCount === 0 && fileInputRef.current?.click()}
          style={{
            border: isDragging ? '2px dashed #003629' : '2px dashed #DAE2FD',
            backgroundColor: isDragging ? '#F2F3FF' : '#FAFAFF',
            borderRadius: 12,
            padding: '28px 16px',
            textAlign: 'center',
            cursor: uploadingCount > 0 ? 'wait' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {uploadingCount > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  border: '3px solid #EAEDFF',
                  borderTopColor: '#003629',
                  borderRadius: '50%',
                  animation: 'caritasSpin 0.8s linear infinite',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#131B2E' }}>
                Uploading {uploadingCount} photograph{uploadingCount === 1 ? '' : 's'} to secure storage...
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#EAEDFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#003629',
                  marginBottom: 4,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>add_photo_alternate</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#131B2E' }}>
                <span style={{ color: '#003629', textDecoration: 'underline' }}>Browse local computer</span> or drag &amp; drop multiple photographs
              </div>
              <div style={{ fontSize: 11.5, color: '#707974', maxWidth: 440 }}>
                High-resolution PNG, WEBP, or JPG up to 10MB each. 800 × 800px square crops render with optimal brilliance in the atelier showcase.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {images.map((img, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                borderRadius: 10,
                border: img.isMain ? '2px solid #003629' : '1px solid #EAEDFF',
                backgroundColor: '#FFFFFF',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: 110,
                  width: '100%',
                  backgroundColor: '#F2F3FF',
                  backgroundImage: `url("${img.url}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                {img.isMain && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      backgroundColor: '#003629',
                      color: '#FFFFFF',
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 4,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ★ Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(19, 27, 46, 0.65)',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                  title="Remove photograph"
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <input
                  type="text"
                  placeholder="Alt text..."
                  value={img.alt || ''}
                  onChange={(e) => handleAltChange(idx, e.target.value)}
                  style={{
                    width: '100%',
                    height: 24,
                    padding: '0 6px',
                    borderRadius: 4,
                    border: '1px solid #EAEDFF',
                    backgroundColor: '#F8F9FE',
                    fontSize: 10.5,
                    color: '#131B2E',
                    outline: 'none',
                  }}
                />
                {!img.isMain && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(idx)}
                    style={{
                      width: '100%',
                      height: 22,
                      borderRadius: 4,
                      border: '1px solid #EAEDFF',
                      backgroundColor: '#FFFFFF',
                      color: '#725B38',
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Set as Primary
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
