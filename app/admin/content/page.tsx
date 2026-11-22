'use client';

import React, { useEffect, useState } from 'react';
import { getWebsiteContent, updateWebsiteContent, uploadFileToStorage } from '../../../lib/firebase/admin-service';
import type { WebsiteContent, WebsiteSlide, PromotionalBanner } from '../../../types/admin';

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Slides State
  const [slides, setSlides] = useState<WebsiteSlide[]>([]);
  // Promo Banners State
  const [promoBanners, setPromoBanners] = useState<PromotionalBanner[]>([]);
  // Contact Info & Social Links
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialPinterest, setSocialPinterest] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const content = await getWebsiteContent();
        if (content) {
          if (content.slides) setSlides(content.slides);
          if (content.promoBanners) setPromoBanners(content.promoBanners);
          if (content.contactEmail) setContactEmail(content.contactEmail);
          if (content.contactPhone) setContactPhone(content.contactPhone);
          if (content.contactAddress) setContactAddress(content.contactAddress);
          if (content.socialInstagram) setSocialInstagram(content.socialInstagram);
          if (content.socialFacebook) setSocialFacebook(content.socialFacebook);
          if (content.socialPinterest) setSocialPinterest(content.socialPinterest);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Slide helpers
  const handleSlideChange = (index: number, field: keyof WebsiteSlide, value: any) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSlideImageUpload = async (index: number, file: File) => {
    try {
      const url = await uploadFileToStorage(file, 'slides');
      handleSlideChange(index, 'image', url);
    } catch (err: any) {
      alert('Slide image upload failed: ' + err.message);
    }
  };

  const handleAddSlide = () => {
    setSlides((prev) => [
      ...prev,
      {
        id: `slide-${Date.now()}`,
        title: 'New Luxury Diamond Collection',
        subtitle: 'Welcome to the diamond hub',
        image: '/wp-content/uploads/home page header picture/Golden-Desert-Oasis-at-Sunset.png',
        buttonText: 'Discover More',
        buttonLink: '/diamonds',
        order: prev.length + 1,
        active: true,
      },
    ]);
  };

  const handleRemoveSlide = (index: number) => {
    if (!confirm('Remove this header slide?')) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  // Promo Banners helpers
  const handlePromoChange = (index: number, field: keyof PromotionalBanner, value: any) => {
    setPromoBanners((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await updateWebsiteContent({
        slides,
        promoBanners,
        contactEmail,
        contactPhone,
        contactAddress,
        socialInstagram,
        socialFacebook,
        socialPinterest,
      });

      setNotice('Website content successfully updated!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error updating content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading website content...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Website Content & Hero Slides Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Control header slider images, promotional cards, and global contact information.
          </p>
        </div>

        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '13px' }}>
          ↗ View Live Homepage
        </a>
      </div>

      {notice && (
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
          }}
        >
          {notice}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Homepage Header Slides */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-text)' }}>
                1. Homepage Header Slider Images & Text
              </h3>
              <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '12px' }}>
                Reorder slides, edit titles, and replace background pictures via Firebase Storage.
              </p>
            </div>
            <button type="button" onClick={handleAddSlide} className="btn-secondary" style={{ fontSize: '12px' }}>
              + Add Slide
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                style={{
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#0c1315',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--admin-gold)', fontSize: '13px' }}>
                    Slide #{idx + 1} {idx === 0 && '(Opening First Slide)'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={slide.active}
                        onChange={(e) => handleSlideChange(idx, 'active', e.target.checked)}
                        style={{ accentColor: 'var(--admin-gold)' }}
                      />
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(idx)}
                      className="btn-danger"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
                  {/* Thumbnail / Upload */}
                  <div>
                    <div
                      style={{
                        width: '120px',
                        height: '75px',
                        borderRadius: '6px',
                        backgroundImage: `url("${slide.image}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid var(--admin-border)',
                        marginBottom: '6px',
                      }}
                    />
                    <label
                      className="btn-secondary"
                      style={{ display: 'block', textAlign: 'center', padding: '5px', fontSize: '10px', cursor: 'pointer' }}
                    >
                      Upload New
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleSlideImageUpload(idx, f);
                        }}
                      />
                    </label>
                  </div>

                  {/* Text inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <label className="admin-label" style={{ fontSize: '11px' }}>Headline Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={slide.title}
                        onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="admin-label" style={{ fontSize: '11px' }}>Subtitle</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={slide.subtitle}
                          onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="admin-label" style={{ fontSize: '11px' }}>Image URL</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={slide.image}
                          onChange={(e) => handleSlideChange(idx, 'image', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Promotional Cards */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            2. Promotional Banners (3-Column Section)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {promoBanners.map((promo, idx) => (
              <div
                key={promo.id || idx}
                style={{
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#0c1315',
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--admin-gold)', fontSize: '13px', marginBottom: '12px' }}>
                  Banner #{idx + 1}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label className="admin-label" style={{ fontSize: '11px' }}>Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promo.title}
                      onChange={(e) => handlePromoChange(idx, 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="admin-label" style={{ fontSize: '11px' }}>Subtitle</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={promo.subtitle || ''}
                      onChange={(e) => handlePromoChange(idx, 'subtitle', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="admin-label" style={{ fontSize: '11px' }}>Button Text & Link</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={promo.buttonText}
                        onChange={(e) => handlePromoChange(idx, 'buttonText', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={promo.buttonLink}
                        onChange={(e) => handlePromoChange(idx, 'buttonLink', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Contact Info & Socials */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            3. Contact Information & Social Media Channels
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="admin-label">Concierge Email</label>
              <input
                type="email"
                className="admin-input"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Customer Support Phone</label>
              <input
                type="text"
                className="admin-input"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Boutique Address / Location</label>
              <input
                type="text"
                className="admin-input"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label className="admin-label">Instagram URL</label>
              <input
                type="url"
                className="admin-input"
                placeholder="https://instagram.com/..."
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Facebook URL</label>
              <input
                type="url"
                className="admin-input"
                placeholder="https://facebook.com/..."
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Pinterest URL</label>
              <input
                type="url"
                className="admin-input"
                placeholder="https://pinterest.com/..."
                value={socialPinterest}
                onChange={(e) => setSocialPinterest(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ padding: '12px 36px', fontSize: '15px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Updating Firebase...' : 'Save Website Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
