'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getWebsiteContent, updateWebsiteContent } from '../../../lib/firebase/admin-service';
import ImageUpload from '../../../components/admin/ImageUpload';
import type { WebsiteSlide } from '../../../types/admin';

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');
  const [activeTab, setActiveTab] = useState<'messages' | 'slides'>('messages');

  // Slides State
  const [slides, setSlides] = useState<WebsiteSlide[]>([]);
  // Contact Info & Social Links
  const [contactEmail, setContactEmail] = useState('concierge@caritasluxury.com');
  const [contactPhone, setContactPhone] = useState('+971 4 123 4567');
  const [contactAddress, setContactAddress] = useState('DIFC Gate Precinct, Dubai, United Arab Emirates');
  const [socialInstagram, setSocialInstagram] = useState('https://instagram.com/caritasluxury');
  const [socialFacebook, setSocialFacebook] = useState('https://facebook.com/caritasluxury');
  const [socialPinterest, setSocialPinterest] = useState('https://pinterest.com/caritasluxury');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const content = await getWebsiteContent();
        if (content) {
          if (content.slides) setSlides(content.slides);
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
            background: 'var(--dark-black)',
            color: '#FFFFFF',
            borderRadius: '4px',
            padding: '10px 18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontSize: '12.5px',
            fontFamily: 'var(--font-title)',
          }}
        >
          {notice}
        </div>
      )}

      {/* Header matching Screenshot 2 */}
      <div className="admin-page-hero">
        <div>
          <h1 className="admin-page-hero-title">Contact Page &amp; Client Inbound Desk</h1>
          <p className="admin-page-hero-subtitle">
            Live incoming communications submitted through the frontend Contact Page, private consultations, and bespoke commissions.
          </p>
        </div>

        <div className="admin-page-hero-actions">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-action-btn-black"
            style={{ padding: '8px 16px' }}
          >
            Open Frontend Contact Page ↗
          </a>
        </div>
      </div>

      {/* 4 Stat Cards Row matching Screenshot 2 */}
      <div className="admin-stats-row">
        {/* Card 1 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">TOTAL SUBMISSIONS</div>
          <div className="admin-stat-value">0</div>
          <div className="admin-stat-sub">All-time contact messages</div>
        </div>

        {/* Card 2 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">NEW / UNREAD</div>
          <div className="admin-stat-value amber">0</div>
          <div className="admin-stat-sub">Requires client director follow-up</div>
        </div>

        {/* Card 3 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">IN PROGRESS / CONTACTED</div>
          <div className="admin-stat-value blue">0</div>
          <div className="admin-stat-sub">Consultation active</div>
        </div>

        {/* Card 4 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">RESOLVED / CLOSED</div>
          <div className="admin-stat-value green">0</div>
          <div className="admin-stat-sub">Deals finalized or closed</div>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`admin-pill-btn ${activeTab === 'messages' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          Inbound Enquiries
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('slides')}
          className={`admin-pill-btn ${activeTab === 'slides' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          Homepage Hero Sliders &amp; Contact Info ({slides.length})
        </button>
      </div>

      {activeTab === 'messages' ? (
        <>
          {/* Filter Bar matching Screenshot 2 */}
          <div className="admin-filter-bar">
            <div className="admin-filter-search-wrap">
              <input
                type="text"
                placeholder="Search by client name, email, phone, or message keywords..."
                className="admin-filter-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-filter-controls">
              <span className="admin-filter-label">Status:</span>
              <div className="admin-pill-group">
                {(['All', 'New', 'Contacted', 'Closed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`admin-pill-btn ${filterStatus === st ? 'active' : ''}`}
                    onClick={() => setFilterStatus(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table / Empty State matching Screenshot 2 */}
          <div className="admin-card-table">
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>CLIENT / CONTACT</th>
                    <th style={{ width: '18%' }}>ENQUIRY TYPE</th>
                    <th style={{ width: '32%' }}>MESSAGE CONTENT</th>
                    <th style={{ width: '14%' }}>METHOD / DATE</th>
                    <th style={{ width: '14%' }}>STATUS</th>
                    <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-empty-state-card">
                        <div className="admin-empty-icon">✉️</div>
                        <h3 className="admin-empty-title">No Inbound Messages Found</h3>
                        <p className="admin-empty-sub">
                          When visitors submit the form on the frontend Contact Page, their messages will appear here in real time.
                        </p>
                        <a
                          href="/contact"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-action-btn-black"
                          style={{ padding: '8px 18px', fontSize: '12px' }}
                        >
                          Open Frontend Contact Page to Submit a Test Enquiry
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Hero Sliders & Content Settings Form */
        <form onSubmit={handleSave}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Homepage Hero Presentations</h2>
              <button
                type="button"
                onClick={handleAddSlide}
                className="btn-caritas-gold"
              >
                + Add Slide
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {slides.map((s, idx) => (
                <div
                  key={s.id || idx}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '18px',
                    backgroundColor: '#FAFAFA',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge-gold-pill">Slide #{idx + 1}</span>
                      <strong style={{ fontFamily: 'var(--font-title)', fontSize: '13px' }}>{s.title}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label className="admin-checkbox-label">
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
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid-2">
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

                  <div className="admin-form-grid-2">
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

          {/* Contact Details */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Concierge &amp; Boutique Touchpoints</h2>
            </div>
            <div className="admin-form-grid-2">
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
                <label className="admin-label">Private Appointment Phone</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
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
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={saving}
              className="admin-action-btn-black"
              style={{ padding: '10px 24px', fontSize: '12px' }}
            >
              {saving ? 'Saving Content...' : 'Save Website Content'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
