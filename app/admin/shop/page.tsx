'use client';

import React, { useEffect, useState } from 'react';
import { getShopSettings, updateShopSettings } from '../../../lib/firebase/admin-service';
import ImageUpload from '../../../components/admin/ImageUpload';
import type { ShopSettings } from '../../../types/admin';

export default function AdminShopSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [heroBadge, setHeroBadge] = useState('— THE FINE JEWELLERY COLLECTION —');
  const [heroTitle, setHeroTitle] = useState('Luxury Diamond Collection');
  const [heroSubtitle, setHeroSubtitle] = useState('Ethically crafted lab-grown diamonds, bespoke engagement rings, and timeless fine jewellery made to endure for generations.');
  const [heroButtonText, setHeroButtonText] = useState('Explore Diamonds');
  const [heroButtonLink, setHeroButtonLink] = useState('/diamonds');
  const [bannerImage, setBannerImage] = useState('/wp-content/uploads/home page header picture/Golden-Desert-Oasis-at-Sunset.png');
  const [announcementText, setAnnouncementText] = useState('Complimentary Insured Worldwide Shipping & 30-Day Hassle-Free Returns on All Orders');
  const [defaultSorting, setDefaultSorting] = useState<ShopSettings['defaultSorting']>('featured');
  const [productsPerPage, setProductsPerPage] = useState<number>(12);
  const [enableFilters, setEnableFilters] = useState(true);
  const [seoTitle, setSeoTitle] = useState('Shop Lab-Grown Diamonds & Fine Jewellery | Caritas Luxury');
  const [seoDescription, setSeoDescription] = useState('Discover our certified lab-grown diamond collection with bespoke designs crafted for eternity.');

  useEffect(() => {
    async function load() {
      try {
        const settings = await getShopSettings();
        if (settings) {
          if (settings.heroBadge) setHeroBadge(settings.heroBadge);
          if (settings.heroTitle) setHeroTitle(settings.heroTitle);
          if (settings.heroSubtitle) setHeroSubtitle(settings.heroSubtitle);
          if (settings.heroButtonText) setHeroButtonText(settings.heroButtonText);
          if (settings.heroButtonLink) setHeroButtonLink(settings.heroButtonLink);
          if (settings.bannerImage) setBannerImage(settings.bannerImage);
          if (settings.announcementText) setAnnouncementText(settings.announcementText);
          if (settings.defaultSorting) setDefaultSorting(settings.defaultSorting);
          if (settings.productsPerPage) setProductsPerPage(settings.productsPerPage);
          if (settings.enableFilters !== undefined) setEnableFilters(settings.enableFilters);
          if (settings.seoTitle) setSeoTitle(settings.seoTitle);
          if (settings.seoDescription) setSeoDescription(settings.seoDescription);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await updateShopSettings({
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroButtonText,
        heroButtonLink,
        bannerImage,
        announcementText,
        defaultSorting,
        productsPerPage: Number(productsPerPage) || 12,
        enableFilters,
        seoTitle,
        seoDescription,
      });
      setNotice('Shop page settings saved to Firestore successfully.');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
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
          <span className="admin-hero-eyebrow">— STOREFRONT CONFIGURATION</span>
          <h1 className="admin-hero-title">Shop Page &amp; Hero Settings</h1>
          <p className="admin-hero-subtitle">
            Customize the live /shop showcase banner, announcements, product sorting rules, and search engine metadata.
          </p>
        </div>

        <div className="admin-hero-actions">
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-caritas-secondary"
          >
            <span>↗</span> Preview Live /shop
          </a>
        </div>
      </div>

      {loading ? (
        <div className="admin-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading shop settings...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: '960px' }}>
          {/* Hero Banner Section */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>1. Hero Showcase Banner</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="admin-label">Eyebrow Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Main Hero Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Hero Subtitle</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="admin-label">Call-to-Action Text</label>
                <input
                  type="text"
                  className="admin-input"
                  value={heroButtonText}
                  onChange={(e) => setHeroButtonText(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Call-to-Action Destination URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={heroButtonLink}
                  onChange={(e) => setHeroButtonLink(e.target.value)}
                />
              </div>
            </div>

            <div>
              <ImageUpload
                label="Shop Header Hero Banner"
                value={bannerImage}
                onChange={setBannerImage}
                folder="banners"
                helpText="Curate the primary showcase background banner displayed at the top of /shop."
                recommendedSize="1920 × 600px"
                aspectRatio="16 / 7"
              />
            </div>
          </div>

          {/* Announcement Bar */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>2. Store Announcement Banner</span>
              </h2>
            </div>
            <div>
              <label className="admin-label">Top Banner Message</label>
              <input
                type="text"
                className="admin-input"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
            </div>
          </div>

          {/* Catalog Display Options */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>3. Catalog Display &amp; Filtering</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="admin-label">Default Product Sorting</label>
                <select
                  className="admin-select"
                  value={defaultSorting}
                  onChange={(e) => setDefaultSorting(e.target.value as any)}
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Products Per Page</label>
                <input
                  type="number"
                  min={4}
                  max={48}
                  className="admin-input"
                  value={productsPerPage}
                  onChange={(e) => setProductsPerPage(Number(e.target.value))}
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enableFilters}
                onChange={(e) => setEnableFilters(e.target.checked)}
              />
              <span>Enable Category &amp; Shape Filter Tabs on /shop</span>
            </label>
          </div>

          {/* Search Engine Optimization */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <span>4. SEO &amp; Search Engine Indexing</span>
              </h2>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Meta Title</label>
              <input
                type="text"
                className="admin-input"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Meta Description</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-caritas-gold"
              style={{ padding: '12px 32px' }}
            >
              {saving ? 'Publishing Settings...' : 'Save & Publish Store Settings'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
