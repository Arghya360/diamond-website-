'use client';

import React, { useEffect, useState } from 'react';
import { getWebsiteContent, updateWebsiteContent } from '../../../lib/firebase/admin-service';
import ImageUpload from '../../../components/admin/ImageUpload';
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

  const handleSlideChange = (index: number, field: keyof WebsiteSlide, value: any) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };


  const handleAddSlide = () => {
    const newSlide: WebsiteSlide = {
      id: `slide-${Date.now()}`,
      title: 'Master Diamond Curation',
      subtitle: 'EXTRAORDINARY COLOUR',
      buttonText: 'Discover Collection',
      buttonLink: '/diamonds',
      image: '/wp-content/uploads/home page header picture/Golden-Desert-Oasis-at-Sunset.png',
      active: true,
      order: slides.length + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
  };

  const handleRemoveSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
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
      setNotice('Website content & hero slides updated in Firestore.');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error saving content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {notice && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--dark-obsidian)',
            color: '#FFFFFF',
            border: '1px solid var(--primary-gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 20px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            fontSize: '13px',
            fontFamily: 'var(--font-title)',
          }}
        >
          {notice}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— HOMEPAGE &amp; EDITORIAL ASSETS</span>
          <h1 className="admin-hero-title">Website Content &amp; Hero Sliders</h1>
          <p className="admin-hero-subtitle">
            Curate the homepage hero presentations, promotional banners, social profiles, and company contact touchpoints.
          </p>
        </div>

        <div className="admin-hero-actions">
          <button type="button" onClick={handleAddSlide} className="btn-caritas-gold">
            <span>+</span>
            <span>Add New Slide</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading website content...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: '980px' }}>
          {/* Hero Slides Section */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>1. Hero Slideshow Sequences</span>
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {slides.length} slide{slides.length === 1 ? '' : 's'} configured
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {slides.map((s, idx) => (
                <div
                  key={s.id || idx}
                  style={{
                    border: '1px solid var(--border-line)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    backgroundColor: 'var(--surface-bg)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge-caritas badge-gold">Slide #{idx + 1}</span>
                      <strong style={{ fontFamily: 'var(--font-title)' }}>{s.title}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={s.active}
                          onChange={(e) => handleSlideChange(idx, 'active', e.target.checked)}
                        />
                        <span>Active</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(idx)}
                        className="btn-caritas-danger"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                    <div>
                      <label className="admin-label">Subtitle / Eyebrow</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={s.subtitle || ''}
                        onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Main Heading</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={s.title || ''}
                        onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                    <div>
                      <label className="admin-label">Button Label</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={s.buttonText || ''}
                        onChange={(e) => handleSlideChange(idx, 'buttonText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Button Destination</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={s.buttonLink || ''}
                        onChange={(e) => handleSlideChange(idx, 'buttonLink', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUpload
                      label={`Slide #${idx + 1} Background Photograph`}
                      value={s.image || ''}
                      onChange={(url) => handleSlideChange(idx, 'image', url)}
                      folder="slides"
                      helpText="Select a high-resolution hero image from your local computer."
                      recommendedSize="1920 × 900px"
                      aspectRatio="16 / 9"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>2. Brand Contact Touchpoints</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="admin-label">Concierge Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="concierge@caritasluxury.com"
                />
              </div>
              <div>
                <label className="admin-label">Private Appointment Phone</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+971 4 123 4567"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Boutique / Atelier Address</label>
              <input
                type="text"
                className="admin-input"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="DIFC Gate Precinct, Dubai, United Arab Emirates"
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>3. Social Channels &amp; Lookbooks</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label className="admin-label">Instagram Profile</label>
                <input
                  type="text"
                  className="admin-input"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  placeholder="https://instagram.com/caritasluxury"
                />
              </div>
              <div>
                <label className="admin-label">Facebook Page</label>
                <input
                  type="text"
                  className="admin-input"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  placeholder="https://facebook.com/caritasluxury"
                />
              </div>
              <div>
                <label className="admin-label">Pinterest Curations</label>
                <input
                  type="text"
                  className="admin-input"
                  value={socialPinterest}
                  onChange={(e) => setSocialPinterest(e.target.value)}
                  placeholder="https://pinterest.com/caritasluxury"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-caritas-gold"
              style={{ padding: '12px 32px' }}
            >
              {saving ? 'Saving Content...' : 'Save Website Content'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
