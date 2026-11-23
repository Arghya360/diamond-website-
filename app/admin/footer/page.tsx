'use client';

import React, { useEffect, useState } from 'react';
import { getFooterConfig, updateFooterConfig } from '../../../lib/firebase/admin-service';

const C = {
  primary: '#003629', secondary: '#725B38', surfaceLow: '#F2F3FF',
  card: '#FFFFFF', onSurface: '#131B2E', outline: '#707974', variant: '#404945',
  border: '#EAEDFF', primaryFixed: '#BAEED9', onPrimaryFixed: '#002117',
  secondaryFixed: '#FEDEB2', onSecondaryFixed: '#78603E', container: '#EAEDFF',
};

const inputStyle: React.CSSProperties = { width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.onSurface, outline: 'none', boxSizing: 'border-box', background: C.card };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline, marginBottom: 6 };
const sectionStyle: React.CSSProperties = { background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' };
const sectionHeaderStyle: React.CSSProperties = { padding: '14px 20px', background: C.surfaceLow, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const sectionBodyStyle: React.CSSProperties = { padding: '20px' };

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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    load();
  }, []);

  const handleLinkChange = (index: number, field: 'label' | 'href', val: string) => {
    setLegalLinks((prev) => prev.map((l, i) => i === index ? { ...l, [field]: val } : l));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateFooterConfig({ newsletterTitle, newsletterSubtitle, copyrightText, legalLinks });
      setNotice('Footer configurations saved successfully.');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) { alert('Error: ' + err.message); } finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {notice && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: C.primary, color: '#FFF', padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 9999, fontSize: 13, fontWeight: 600 }}>
          {notice}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
            <span style={{ color: C.secondary }}>Storefront Base</span>
            <span style={{ color: C.outline }}>/</span>
            <span style={{ color: C.outline }}>Footer Settings</span>
          </div>
          <h1 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 500, color: C.onSurface, margin: 0 }}>
            Footer &amp; Newsletter Settings
          </h1>
          <p style={{ color: C.variant, fontSize: 13, marginTop: 4 }}>
            Configure the newsletter section, copyright notice, and legal links displayed across all storefront pages.
          </p>
        </div>
        <a href="/#footer" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, background: C.card, color: C.onSurface, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.secondary }}>view_day</span>
          Preview Footer ↗
        </a>
      </div>

      {loading ? (
        <div style={{ background: C.card, borderRadius: 16, padding: '48px', textAlign: 'center', color: C.outline, border: `1px solid ${C.border}` }}>Loading footer settings...</div>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: 960 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Newsletter Section */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 6, background: C.primaryFixed, color: C.onPrimaryFixed, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>1</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>Newsletter Invitation Section</span>
                </div>
              </div>
              <div style={sectionBodyStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Section Heading</label>
                    <input type="text" value={newsletterTitle} onChange={(e) => setNewsletterTitle(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Invitation Description</label>
                    <input type="text" value={newsletterSubtitle} onChange={(e) => setNewsletterSubtitle(e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, background: C.surfaceLow, fontSize: 12, color: C.outline }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4, color: C.secondary }}>info</span>
                  Newsletter form is handled automatically. Email subscribers are stored in the Firestore <code style={{ background: C.border, padding: '1px 4px', borderRadius: 3 }}>caritas_newsletter</code> collection.
                </div>
              </div>
            </div>

            {/* Legal Links Section */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 6, background: C.secondaryFixed, color: C.onSecondaryFixed, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>2</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>Legal &amp; Policy Links</span>
                </div>
                <button type="button" onClick={() => setLegalLinks((prev) => [...prev, { label: 'New Link', href: '/' }])} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.card, color: C.onSurface, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span> Add Policy Link
                </button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {legalLinks.map((link, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surfaceLow, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.outline, flexShrink: 0 }}>link</span>
                    <input type="text" placeholder="Link Label" value={link.label} onChange={(e) => handleLinkChange(idx, 'label', e.target.value)} style={{ flex: 1, height: 36, padding: '0 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, color: C.onSurface, outline: 'none', background: C.card }} />
                    <input type="text" placeholder="URL Path" value={link.href} onChange={(e) => handleLinkChange(idx, 'href', e.target.value)} style={{ flex: 1, height: 36, padding: '0 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, color: C.onSurface, outline: 'none', background: C.card }} />
                    <button type="button" onClick={() => setLegalLinks((prev) => prev.filter((_, i) => i !== idx))} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #FFD6D6', background: '#FFF5F5', color: '#BA1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright Section */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 6, background: C.container, color: C.onSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>3</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>Copyright &amp; Atelier Attribution</span>
                </div>
              </div>
              <div style={sectionBodyStyle}>
                <label style={labelStyle}>Copyright Text</label>
                <input type="text" value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} style={inputStyle} />
                <p style={{ fontSize: 12, color: C.outline, marginTop: 8 }}>This text appears at the very bottom of every storefront page.</p>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} style={{ padding: '12px 32px', borderRadius: 8, background: saving ? C.variant : C.primary, color: '#FFF', fontSize: 14, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0,54,41,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{saving ? 'sync' : 'save'}</span>
                {saving ? 'Saving Footer...' : 'Save & Publish Footer'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
