'use client';

import React, { useEffect, useState } from 'react';
import { getShopSettings, updateShopSettings, uploadFileToStorage } from '../../../lib/firebase/admin-service';
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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFileToStorage(file, 'banners');
      setBannerImage(url);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
  };

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
        productsPerPage,
        enableFilters,
        seoTitle,
        seoDescription,
      });

      setNotice('Shop page settings successfully saved and applied to live /shop page!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading shop settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Shop Page Configuration
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Control hero text, banners, sorting defaults, and announcements for the live /shop page.
          </p>
        </div>

        <a
          href="/shop"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: '13px' }}
        >
          ↗ View Live Shop
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
        {/* Hero Section */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            1. Shop Hero Section Banner & Content
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Hero Badge / Subtitle Tag</label>
            <input
              type="text"
              className="admin-input"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Main Hero Title *</label>
            <input
              type="text"
              required
              className="admin-input"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Hero Subtitle Paragraph</label>
            <textarea
              rows={3}
              className="admin-textarea"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="admin-label">Hero CTA Button Text</label>
              <input
                type="text"
                className="admin-input"
                value={heroButtonText}
                onChange={(e) => setHeroButtonText(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Hero CTA Button Link</label>
              <input
                type="text"
                className="admin-input"
                value={heroButtonLink}
                onChange={(e) => setHeroButtonLink(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Shop Banner / Background Image</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <input
                type="text"
                className="admin-input"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
              />
              <label className="btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Upload Image
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerUpload} />
              </label>
            </div>
            {bannerImage && (
              <div
                style={{
                  height: '100px',
                  borderRadius: '6px',
                  backgroundImage: `url("${bannerImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid var(--admin-border)',
                }}
              />
            )}
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            2. Announcement Bar / Shipping Notice
          </h3>

          <div>
            <label className="admin-label">Top Promotional / Announcement Text</label>
            <input
              type="text"
              className="admin-input"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
            />
          </div>
        </div>

        {/* Display & Filters Settings */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            3. Catalog Display & Sorting Preferences
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="admin-label">Default Product Sorting</label>
              <select
                className="admin-select"
                value={defaultSorting}
                onChange={(e) => setDefaultSorting(e.target.value as any)}
              >
                <option value="featured">Featured / Curated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">New Arrivals First</option>
              </select>
            </div>

            <div>
              <label className="admin-label">Products Per Page / Grid Count</label>
              <input
                type="number"
                min="3"
                max="48"
                className="admin-input"
                value={productsPerPage}
                onChange={(e) => setProductsPerPage(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={enableFilters}
                onChange={(e) => setEnableFilters(e.target.checked)}
                style={{ accentColor: 'var(--admin-gold)', width: '18px', height: '18px' }}
              />
              <span>Enable Category & Filter Tabs on Shop Page</span>
            </label>
          </div>
        </div>

        {/* SEO Meta */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            4. Search Engine Optimization (SEO)
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Meta Title Tag</label>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ padding: '12px 36px', fontSize: '15px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Shop Page Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
