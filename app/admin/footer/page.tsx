'use client';

import React, { useEffect, useState } from 'react';
import { getFooterConfig, updateFooterConfig } from '../../../lib/firebase/admin-service';
import type { FooterConfig } from '../../../types/admin';

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [newsletterTitle, setNewsletterTitle] = useState('Join The Caritas Circle');
  const [newsletterSubtitle, setNewsletterSubtitle] = useState('Receive exclusive invitations to private viewings, bespoke releases, and our diamond intelligence reports.');
  const [copyrightText, setCopyrightText] = useState('© 2026 Caritas Luxury. All Rights Reserved. Master Diamond Curators.');
  const [legalLinks, setLegalLinks] = useState<{ label: string; href: string }[]>([
    { label: 'Delivery Information', href: '/delivery' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const config = await getFooterConfig();
        if (config) {
          if (config.newsletterTitle) setNewsletterTitle(config.newsletterTitle);
          if (config.newsletterSubtitle) setNewsletterSubtitle(config.newsletterSubtitle);
          if (config.copyrightText) setCopyrightText(config.copyrightText);
          if (config.legalLinks) setLegalLinks(config.legalLinks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLinkChange = (index: number, field: 'label' | 'href', val: string) => {
    setLegalLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: val } : l))
    );
  };

  const handleAddLink = () => {
    setLegalLinks((prev) => [...prev, { label: 'New Link', href: '/' }]);
  };

  const handleRemoveLink = (index: number) => {
    setLegalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await updateFooterConfig({
        newsletterTitle,
        newsletterSubtitle,
        copyrightText,
        legalLinks,
      });
      setNotice('Footer & legal configurations saved successfully.');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error saving footer: ' + err.message);
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
          <span className="admin-hero-eyebrow">— STOREFRONT BASE &amp; LEGAL</span>
          <h1 className="admin-hero-title">Footer &amp; Newsletter Settings</h1>
          <p className="admin-hero-subtitle">
            Configure the newsletter invitation banner, copyright notice, and legal links across all storefront pages.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="admin-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading footer settings...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: '960px' }}>
          {/* Newsletter Box */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>1. Newsletter Invitation Section</span>
              </h2>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={newsletterTitle}
                onChange={(e) => setNewsletterTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Invitation Description</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={newsletterSubtitle}
                onChange={(e) => setNewsletterSubtitle(e.target.value)}
              />
            </div>
          </div>

          {/* Legal Links Box */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>2. Legal &amp; Policy Links</span>
              </h2>
              <button
                type="button"
                onClick={handleAddLink}
                className="btn-caritas-secondary"
                style={{ padding: '6px 14px', fontSize: '11.5px' }}
              >
                + Add Policy Link
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {legalLinks.map((link, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'var(--surface-bg)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-line)',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Link Label"
                    className="admin-input"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '13px' }}
                    value={link.label}
                    onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="URL Path"
                    className="admin-input"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '13px' }}
                    value={link.href}
                    onChange={(e) => handleLinkChange(idx, 'href', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="btn-caritas-danger"
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright Box */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>3. Copyright &amp; Atelier Attribution</span>
              </h2>
            </div>
            <div>
              <label className="admin-label">Copyright Text</label>
              <input
                type="text"
                className="admin-input"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-caritas-gold"
              style={{ padding: '12px 32px' }}
            >
              {saving ? 'Saving Footer...' : 'Save & Publish Footer'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
