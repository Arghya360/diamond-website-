'use client';

import React, { useEffect, useState } from 'react';
import { getWebsiteContent, updateWebsiteContent } from '../../../lib/firebase/admin-service';
import ImageUpload from '../../../components/admin/ImageUpload';
import type { WebsiteSlide } from '../../../types/admin';

const C = {
  primary: '#003629', secondary: '#725B38', surfaceLow: '#F2F3FF',
  card: '#FFFFFF', onSurface: '#131B2E', outline: '#707974', variant: '#404945',
  border: '#EAEDFF', primaryFixed: '#BAEED9', onPrimaryFixed: '#002117',
  secondaryFixed: '#FEDEB2', onSecondaryFixed: '#78603E', container: '#EAEDFF',
};

const inputStyle: React.CSSProperties = { width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.onSurface, outline: 'none', boxSizing: 'border-box', background: C.card };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline, marginBottom: 6 };

type TabType = 'slides' | 'contact';

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('slides');

  const [slides, setSlides] = useState<WebsiteSlide[]>([]);
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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSlideChange = (index: number, field: keyof WebsiteSlide, value: any) => {
    setSlides((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleAddSlide = () => {
    const newSlide: WebsiteSlide = {
      id: `slide-${Date.now()}`, title: 'Master Diamond Curation', subtitle: 'EXTRAORDINARY COLOUR',
      buttonText: 'Discover Collection', buttonLink: '/diamonds',
      image: '/wp-content/uploads/home page header picture/Golden-Desert-Oasis-at-Sunset.png',
      active: true, order: slides.length + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateWebsiteContent({ slides, contactEmail, contactPhone, contactAddress, socialInstagram, socialFacebook, socialPinterest });
      setNotice('Website content updated in Firestore.');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) { alert('Error saving: ' + err.message); } finally { setSaving(false); }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'slides', label: `Hero Slides (${slides.length})`, icon: 'slideshow' },
    { id: 'contact', label: 'Concierge & Social', icon: 'contacts' },
  ];

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
            <span style={{ color: C.secondary }}>Store Management</span>
            <span style={{ color: C.outline }}>/</span>
            <span style={{ color: C.outline }}>Website Content</span>
          </div>
          <h1 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 500, color: C.onSurface, margin: 0 }}>
            Website Content
          </h1>
          <p style={{ color: C.variant, fontSize: 13, marginTop: 4 }}>
            Manage homepage hero slides, boutique contact details, and social media links.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, background: C.card, color: C.onSurface, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.secondary }}>web</span>
          View Homepage ↗
        </a>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Hero Slides', value: slides.length, sub: `${slides.filter((s) => s.active).length} active`, icon: 'slideshow', bg: C.primaryFixed, fg: C.onPrimaryFixed },
          { label: 'Active Slides', value: slides.filter((s) => s.active).length, sub: 'Live on homepage', icon: 'visibility', bg: C.primaryFixed, fg: C.onPrimaryFixed },
          { label: 'Social Channels', value: 3, sub: 'Instagram, Facebook, Pinterest', icon: 'share', bg: C.secondaryFixed, fg: C.onSecondaryFixed },
          { label: 'Contact Points', value: 3, sub: 'Email, Phone, Address', icon: 'contacts', bg: C.container, fg: C.onSurface },
        ].map((card) => (
          <div key={card.label} style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.outline }}>{card.label}</span>
              <span style={{ padding: 4, borderRadius: 6, background: card.bg, color: card.fg }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>{card.icon}</span></span>
            </div>
            <span style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 600, color: C.onSurface }}>{card.value}</span>
            <div style={{ marginTop: 4, fontSize: 12, color: C.outline }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'inline-flex', background: C.surfaceLow, borderRadius: 10, padding: 4, gap: 2 }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: activeTab === tab.id ? C.card : 'transparent', color: activeTab === tab.id ? C.primary : C.variant, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ background: C.card, borderRadius: 16, padding: '48px', textAlign: 'center', color: C.outline, border: `1px solid ${C.border}` }}>Loading website content...</div>
      ) : (
        <form onSubmit={handleSave}>
          {activeTab === 'slides' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 20, color: C.onSurface, fontWeight: 500 }}>Homepage Hero Presentations</span>
                <button type="button" onClick={handleAddSlide} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.onSurface, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Slide
                </button>
              </div>

              {slides.length === 0 && (
                <div style={{ background: C.card, borderRadius: 16, padding: 40, textAlign: 'center', border: `1px solid ${C.border}` }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: C.outline, display: 'block', marginBottom: 12 }}>slideshow</span>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.onSurface, marginBottom: 6 }}>No Hero Slides</div>
                  <div style={{ fontSize: 13, color: C.outline, marginBottom: 16 }}>Add your first homepage hero slide to get started.</div>
                  <button type="button" onClick={handleAddSlide} style={{ padding: '10px 20px', borderRadius: 8, background: C.primary, color: '#FFF', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Add First Slide</button>
                </div>
              )}

              {slides.map((s, idx) => (
                <div key={s.id || idx} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  {/* Slide Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 6, background: C.primaryFixed, color: C.onPrimaryFixed, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>S{idx + 1}</span>
                      <strong style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>{s.title || 'Untitled Slide'}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: s.active ? C.primary : C.outline }}>
                        <div style={{ position: 'relative', width: 36, height: 20 }}>
                          <input type="checkbox" checked={s.active} onChange={(e) => handleSlideChange(idx, 'active', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                          <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: s.active ? C.primary : '#ccc', transition: '0.2s' }}></div>
                          <div style={{ position: 'absolute', top: 2, left: s.active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#FFF', transition: '0.2s' }}></div>
                        </div>
                        Active
                      </label>
                      <button type="button" onClick={() => setSlides((prev) => prev.filter((_, i) => i !== idx))} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #FFD6D6', background: '#FFF5F5', color: '#BA1A1A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                    </div>
                  </div>

                  {/* Slide Fields */}
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                      <div>
                        <label style={labelStyle}>Subtitle / Eyebrow Text</label>
                        <input type="text" style={inputStyle} value={s.subtitle || ''} onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Main Heading</label>
                        <input type="text" style={inputStyle} value={s.title || ''} onChange={(e) => handleSlideChange(idx, 'title', e.target.value)} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                      <div>
                        <label style={labelStyle}>Button Label</label>
                        <input type="text" style={inputStyle} value={s.buttonText || ''} onChange={(e) => handleSlideChange(idx, 'buttonText', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Button Destination URL</label>
                        <input type="text" style={inputStyle} value={s.buttonLink || ''} onChange={(e) => handleSlideChange(idx, 'buttonLink', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <ImageUpload
                        label={`Slide #${idx + 1} Background Photograph`}
                        value={s.image || ''}
                        onChange={(url) => handleSlideChange(idx, 'image', url)}
                        folder="slides"
                        helpText="High-resolution hero image (1920 × 900px recommended)"
                        recommendedSize="1920 × 900px"
                        aspectRatio="16 / 9"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={{ padding: '12px 32px', borderRadius: 8, background: saving ? C.variant : C.primary, color: '#FFF', fontSize: 14, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0,54,41,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{saving ? 'sync' : 'save'}</span>
                  {saving ? 'Saving Content...' : 'Save Hero Slides'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960 }}>
              {/* Contact Details */}
              <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: C.surfaceLow, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.secondary }}>contacts</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>Concierge &amp; Boutique Touchpoints</span>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Concierge Email</label>
                      <input type="email" style={inputStyle} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Private Appointment Phone</label>
                      <input type="text" style={inputStyle} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Boutique / Atelier Address</label>
                    <input type="text" style={inputStyle} value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: C.surfaceLow, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.secondary }}>share</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>Social Media Channels</span>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Instagram URL</label>
                      <input type="url" style={inputStyle} value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Facebook URL</label>
                      <input type="url" style={inputStyle} value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Pinterest URL</label>
                      <input type="url" style={inputStyle} value={socialPinterest} onChange={(e) => setSocialPinterest(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={{ padding: '12px 32px', borderRadius: 8, background: saving ? C.variant : C.primary, color: '#FFF', fontSize: 14, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0,54,41,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{saving ? 'sync' : 'save'}</span>
                  {saving ? 'Saving...' : 'Save Contact & Social'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
