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
      setNotice('Footer configuration saved successfully!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error saving footer config: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading footer configuration...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Footer Configuration Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Manage newsletter subscriber invitation texts, copyright notices, and legal navigation links.
          </p>
        </div>
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
        {/* Newsletter Section */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            1. Newsletter Subscription Invitation
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Newsletter Title</label>
            <input
              type="text"
              className="admin-input"
              value={newsletterTitle}
              onChange={(e) => setNewsletterTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Newsletter Subtitle Paragraph</label>
            <textarea
              rows={2}
              className="admin-textarea"
              value={newsletterSubtitle}
              onChange={(e) => setNewsletterSubtitle(e.target.value)}
            />
          </div>
        </div>

        {/* Legal Links */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-text)' }}>
              2. Footer Policy & Legal Links
            </h3>
            <button type="button" onClick={handleAddLink} className="btn-secondary" style={{ fontSize: '12px' }}>
              + Add Link
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {legalLinks.map((link, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Link Label"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={link.label}
                  onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="URL Destination"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={link.href}
                  onChange={(e) => handleLinkChange(idx, 'href', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            3. Copyright Notice
          </h3>

          <div>
            <label className="admin-label">Copyright Text Line</label>
            <input
              type="text"
              className="admin-input"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ padding: '12px 36px', fontSize: '15px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Updating Firebase...' : 'Save Footer Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
