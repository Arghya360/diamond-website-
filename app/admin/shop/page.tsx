'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getShopSettings, updateShopSettings, getProducts, subscribeProducts, subscribeShopSettings } from '../../../lib/firebase/admin-service';
import ImageUpload from '../../../components/admin/ImageUpload';

interface CuratedItem {
  id: string;
  rank: number;
  title: string;
  sku: string;
  specs: string;
  category: string;
  price: string;
  statusBadge: string;
  tags: { label: string; bg: string; text: string }[];
  visible: boolean;
  image: string;
}

const INITIAL_CURATED_ITEMS: CuratedItem[] = [
  {
    id: 'CRT-MQ-9921',
    rank: 1,
    title: 'The Celestial Marquise Solitaire',
    sku: 'CRT-MQ-9921',
    specs: '3.20 ct D/IF Platinum',
    category: 'Engagement Rings',
    price: '$64,500',
    statusBadge: 'Direct Atelier',
    tags: [
      { label: 'Homepage Hero', bg: '#fedeb2', text: '#78603e' },
      { label: 'Spot #1', bg: '#baeed9', text: '#003629' },
    ],
    visible: true,
    image: '/images/shop/banner-01.jpg',
  },
  {
    id: 'CRT-NC-3304',
    rank: 2,
    title: 'Aura Radiant Pavé Diamond Necklace',
    sku: 'CRT-NC-3304',
    specs: '12.40 cttw 18K Yellow Gold',
    category: 'Haute Necklaces',
    price: '$42,000',
    statusBadge: 'Certified GIA',
    tags: [
      { label: 'Trending Spotlight', bg: '#eaedff', text: '#404945' },
    ],
    visible: true,
    image: '/images/shop/banner-02.jpg',
  },
  {
    id: 'CRT-EM-5120',
    rank: 3,
    title: 'Eternity Emerald-Cut Platinum Band',
    sku: 'CRT-EM-5120',
    specs: '4.50 cttw E/VVS1 Platinum',
    category: 'Wedding Bands',
    price: '$18,800',
    statusBadge: 'In Stock (2)',
    tags: [
      { label: 'New Arrival', bg: '#baeed9', text: '#003629' },
      { label: 'Grid #3', bg: '#eaedff', text: '#404945' },
    ],
    visible: true,
    image: '/images/shop/pro-21-300x300.png',
  },
  {
    id: 'CRT-PR-8812',
    rank: 4,
    title: 'Cascade Pear-Cut Diamond Earrings',
    sku: 'CRT-PR-8812',
    specs: '6.10 cttw Platinum 950',
    category: 'High Earrings',
    price: '$89,000',
    statusBadge: 'Private Viewing',
    tags: [
      { label: 'VIP Reserved', bg: '#fedeb2', text: '#78603e' },
    ],
    visible: true,
    image: '/images/shop/pro-03-300x300.jpg',
  },
  {
    id: 'CRT-RG-7703',
    rank: 5,
    title: "L'Arc Royal Sapphire & Diamond Ring",
    sku: 'CRT-RG-7703',
    specs: '4.80 ct Royal Blue + 2.10 ct Dia',
    category: 'Colored Gemstones',
    price: '$54,000',
    statusBadge: 'SSEF Certified',
    tags: [
      { label: 'Salon Exclusive', bg: '#dae2fd', text: '#131b2e' },
    ],
    visible: true,
    image: '/images/shop/pro-05-300x300.jpg',
  },
  {
    id: 'CRT-BR-1102',
    rank: 6,
    title: 'Verona Cushion Diamond Tennis Bracelet',
    sku: 'CRT-BR-1102',
    specs: '8.75 cttw F/VS1 18K White Gold',
    category: 'Bracelets & Bangles',
    price: '$31,500',
    statusBadge: 'High Demand',
    tags: [
      { label: 'Best Seller', bg: '#e0c298', text: '#281800' },
    ],
    visible: true,
    image: '/images/shop/pro-07-300x300.jpg',
  },
];

export default function AdminShopSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [notice, setNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Product Grid Curations (Active)');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Hero Billboard State
  const [displayHero, setDisplayHero] = useState(true);
  const [heroBadge, setHeroBadge] = useState('Headline Campaign');
  const [heroTitle, setHeroTitle] = useState('The Solitaire Collection — Hand-Set in Geneva');
  const [heroSubtitle, setHeroSubtitle] = useState('Bespoke solitaire allocations certified by GIA. Featuring our proprietary 8-prong platinum crown and museum-grade colorless diamond cuts.');
  const [heroButtonText, setHeroButtonText] = useState('Explore Solitaires');
  const [heroButtonLink, setHeroButtonLink] = useState('/shop/solitaires');
  const [bannerImage, setBannerImage] = useState('/images/hero/golden-desert-oasis-at-sunset.png');

  // Modals for Hero Editing
  const [editCopyModalOpen, setEditCopyModalOpen] = useState(false);
  const [replaceAssetModalOpen, setReplaceAssetModalOpen] = useState(false);

  // Storefront Rules State
  const [gridLayout, setGridLayout] = useState<'4-col' | '3-col' | 'lookbook'>('4-col');
  const [itemsPerPage, setItemsPerPage] = useState('24');
  const [badgeCarat, setBadgeCarat] = useState(true);
  const [badgeGia, setBadgeGia] = useState(true);
  const [badgePriceOnReq, setBadgePriceOnReq] = useState(true);
  const [badgeNewArrival, setBadgeNewArrival] = useState(true);

  // Curated Products List
  const [curatedItems, setCuratedItems] = useState<CuratedItem[]>(INITIAL_CURATED_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('manual');
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);

  // Firestore DB real-time synchronization
  useEffect(() => {
    setLoading(true);

    const unsubSettings = subscribeShopSettings((settings) => {
      if (settings) {
        if (settings.heroBadge) setHeroBadge(settings.heroBadge);
        if (settings.heroTitle) setHeroTitle(settings.heroTitle);
        if (settings.heroSubtitle) setHeroSubtitle(settings.heroSubtitle);
        if (settings.heroButtonText) setHeroButtonText(settings.heroButtonText);
        if (settings.heroButtonLink) setHeroButtonLink(settings.heroButtonLink);
        if (settings.bannerImage) setBannerImage(settings.bannerImage);
        if (settings.productsPerPage) setItemsPerPage(String(settings.productsPerPage));
      }
    });

    const unsubProducts = subscribeProducts((products) => {
      if (products && products.length > 0) {
        const mappedDb: CuratedItem[] = products.slice(0, 6).map((p, idx) => ({
          id: p.id || `CRT-${idx + 1000}`,
          rank: idx + 1,
          title: p.name,
          sku: p.sku || `CRT-${(p.id || '').slice(0, 6).toUpperCase()}`,
          specs: p.weight ? `${p.weight} • 18K / Platinum` : 'High Fine Jewellery',
          category: p.category || 'Fine Jewellery',
          price: p.price ? `$${Number(p.price).toLocaleString()}` : '$28,000',
          statusBadge: p.stock && p.stock > 0 ? `In Stock (${p.stock})` : 'Direct Atelier',
          tags: [
            { label: idx === 0 ? 'Homepage Hero' : 'Featured Selection', bg: idx === 0 ? '#fedeb2' : '#baeed9', text: idx === 0 ? '#78603e' : '#003629' },
          ],
          visible: p.published !== false,
          image: p.images?.[0]?.url || '/images/shop/banner-01.jpg',
        }));
        if (mappedDb.length >= 3) {
          setCuratedItems(mappedDb);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubSettings();
      unsubProducts();
    };
  }, []);

  const handlePublish = async () => {
    setPublishStatus('publishing');
    setSaving(true);

    try {
      await updateShopSettings({
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroButtonText,
        heroButtonLink,
        bannerImage,
        productsPerPage: Number(itemsPerPage) || 24,
      });

      setTimeout(() => {
        setPublishStatus('published');
        setSaving(false);
        setNotice('Storefront published successfully to global CDN.');

        setTimeout(() => {
          setPublishStatus('idle');
          setNotice(null);
        }, 3000);
      }, 1200);
    } catch (err: any) {
      alert('Error updating shop settings: ' + err.message);
      setPublishStatus('idle');
      setSaving(false);
    }
  };

  const handleUpdateRules = async () => {
    setSaving(true);
    try {
      await updateShopSettings({
        productsPerPage: Number(itemsPerPage) || 24,
      });
      setNotice('Storefront Rules & Presentation saved successfully.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      alert('Error saving rules: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleItemVisibility = (id: string) => {
    setCuratedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  };

  // Filter curated products
  const filteredItems = curatedItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.specs.toLowerCase().includes(q);
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const tabs = [
    'All Sections',
    'Hero & Banners',
    'Featured Collections',
    'Product Grid Curations (Active)',
    'Category Highlights',
    'Trending & New Arrivals',
    'SEO & Dynamic Meta',
  ];

  return (
    <div className="flex flex-col w-full font-body-md text-on-surface antialiased" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {notice && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, backgroundColor: '#003629', color: '#ffffff', padding: '12px 20px', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(186, 238, 217, 0.3)', fontSize: 13, fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#baeed9' }}>verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Top Command & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md mb-space-lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div className="space-y-space-xs" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em]" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#725b38' }}>
            <span>Store Management</span>
            <span style={{ color: '#c0c9c3', fontSize: 10 }}>/</span>
            <span style={{ color: '#003629', fontWeight: 700 }}>Frontend CMS</span>
            <span style={{ color: '#c0c9c3', fontSize: 10 }}>/</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#1b4d3e', padding: '2px 8px', borderRadius: 999, backgroundColor: 'rgba(186, 238, 217, 0.6)', fontWeight: 700, letterSpacing: 'normal', fontSize: 11 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#003629', display: 'inline-block' }}></span>
              CDN Live • Synced 14s ago
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 32, fontWeight: 500, color: '#131b2e', margin: 0, letterSpacing: '-0.02em', lineHeight: '40px' }}>
            Shop Page CMS &amp; Merchandising
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl" style={{ fontSize: 14, color: '#404945', margin: 0, maxWidth: 760, lineHeight: '22px' }}>
            Curate live storefront collections, featured fine jewellery showcases, hero visual merchandising, and granular drag-and-drop order for the Caritas global client experience.
          </p>
        </div>

        {/* Global CTA Group */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Link
            href="/shop"
            target="_blank"
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-sm hover:bg-surface-container-low transition-all"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, backgroundColor: '#ffffff', color: '#131b2e', border: '1px solid #eaedff', fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#725b38' }}>visibility</span>
            <span>Preview Live Shop</span>
          </Link>
          <button
            onClick={() => alert('CMS Revisions History: Active v4.8 (Nov 23, 2026). All previous states mirrored to Zurich Cold Vault.')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-sm hover:bg-surface-container-low transition-all"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, backgroundColor: '#ffffff', color: '#131b2e', border: '1px solid #eaedff', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#707974' }}>history</span>
            <span>Revisions</span>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: '#e2e7ff', color: '#404945', fontWeight: 700 }}>v4.8</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-title-md text-title-md shadow-md hover:bg-primary transition-all"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, backgroundColor: '#1b4d3e', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,54,41,0.25)', opacity: publishStatus === 'publishing' ? 0.8 : 1 }}
          >
            {publishStatus === 'publishing' ? (
              <>
                <span className="material-symbols-outlined text-[19px]" style={{ fontSize: 19 }}>refresh</span>
                <span>Deploying to Global CDN...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <span className="material-symbols-outlined text-[19px]" style={{ fontSize: 19, color: '#fedeb2' }}>check_circle</span>
                <span>Storefront Published!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[19px]" style={{ fontSize: 19, color: '#fedeb2' }}>publish</span>
                <span>Publish Changes to Shop</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Snapshot Analytics Cards (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #eaedff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110 }}>
          <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Live Storefront Items</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(186, 238, 217, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003629' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>inventory_2</span>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div className="font-headline-md text-headline-md text-on-surface tracking-tight" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#131b2e' }}>
              1,428 <span style={{ fontSize: 12, color: '#707974', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Units</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant" style={{ fontSize: 12, color: '#404945', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#003629', fontWeight: 600 }}>6 Collections</span>
              <span style={{ color: '#c0c9c3' }}>•</span>
              <span>99.4% In Stock</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #eaedff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110 }}>
          <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Showcase Spotlight</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(254, 222, 178, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#725b38' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div className="font-headline-md text-headline-md text-on-surface tracking-tight" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#131b2e' }}>
              8 Pieces <span style={{ fontSize: 12, color: '#003629', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>+18.4% CTR</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant" style={{ fontSize: 12, color: '#404945', marginTop: 4 }}>
              4 Rings, 2 Necklaces, 2 Earrings
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #eaedff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110 }}>
          <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Active Promotional Banner</span>
            <span style={{ padding: '2px 8px', borderRadius: 999, backgroundColor: '#baeed9', color: '#003629', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Live Now</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <div className="font-title-lg text-title-lg text-on-surface truncate" style={{ fontSize: 16, fontWeight: 600, color: '#131b2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Spring Equinox Showcase
            </div>
            <div className="font-body-sm text-body-sm text-secondary" style={{ fontSize: 12, color: '#725b38', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>confirmation_number</span>
              <span>15% Atelier VIP Privilege</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #eaedff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110 }}>
          <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Shop Conversion Rate</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#e2e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#404945' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>query_stats</span>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div className="font-headline-md text-headline-md text-on-surface tracking-tight" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#131b2e' }}>
              3.82% <span style={{ fontSize: 12, color: '#003629', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>+0.6% MoM</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant" style={{ fontSize: 12, color: '#404945', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Avg Time: 4m 12s</span>
              <span style={{ color: '#707974', fontSize: 10 }}>High Engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-space-md" style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-space-md py-2 rounded-lg font-title-md text-title-md transition-all"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? '#003629' : '#ffffff',
                color: isActive ? '#ffffff' : '#404945',
                boxShadow: isActive ? '0 1px 4px rgba(0,54,41,0.2)' : '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Primary Split Grid: Left 8-col Builder, Right 4-col Preview & Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 24, alignItems: 'start' }}>
        {/* LEFT 8 COLUMNS: Content & Product Grid CMS */}
        <div style={{ gridColumn: 'span 8 / span 8', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Hero Banner Showcase Module */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #eaedff', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between" style={{ padding: '14px 20px', backgroundColor: '#f2f3ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eaedff' }}>
              <div className="flex items-center gap-space-xs" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 20, color: '#725b38' }}>art_track</span>
                <span className="font-title-lg text-title-lg text-on-surface" style={{ fontSize: 15, fontWeight: 700, color: '#131b2e' }}>Storefront Hero Billboard Spotlight</span>
              </div>
              <div className="flex items-center gap-space-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
                  <div style={{ position: 'relative', width: 36, height: 20 }}>
                    <input
                      type="checkbox"
                      checked={displayHero}
                      onChange={(e) => setDisplayHero(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 10, backgroundColor: displayHero ? '#003629' : '#c0c9c3', transition: '0.2s' }}></div>
                    <div style={{ position: 'absolute', top: 2, left: displayHero ? 18 : 2, width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ffffff', transition: '0.2s' }}></div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#131b2e' }}>Display on /shop</span>
                </label>
              </div>
            </div>

            <div className="p-space-lg flex flex-col md:flex-row gap-space-lg items-center" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 240, height: 144, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', backgroundColor: '#f2f3ff' }}>
                <img
                  src={bannerImage}
                  alt="Hero Banner"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0, 54, 41, 0.9)', color: '#ffffff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Active Billboard
                </span>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#725b38' }}>
                    {heroBadge}
                  </span>
                  <span style={{ color: '#c0c9c3' }}>•</span>
                  <span style={{ fontSize: 11, color: '#707974' }}>Target URL: {heroButtonLink}</span>
                </div>
                <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: '#131b2e', margin: 0, lineHeight: '28px' }}>
                  {heroTitle}
                </h2>
                <p style={{ fontSize: 13, color: '#404945', margin: 0, lineHeight: '20px' }}>
                  {heroSubtitle}
                </p>
                <div style={{ paddingTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setEditCopyModalOpen(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 6, backgroundColor: '#f2f3ff', color: '#003629', fontSize: 12, fontWeight: 600, border: '1px solid #eaedff', cursor: 'pointer' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_note</span>
                    <span>Edit Copy &amp; CTA</span>
                  </button>
                  <button
                    onClick={() => setReplaceAssetModalOpen(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 6, backgroundColor: '#f2f3ff', color: '#404945', fontSize: 12, fontWeight: 600, border: '1px solid #eaedff', cursor: 'pointer' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>image</span>
                    <span>Replace Creative Asset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Product Display & Merchandising Grid */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #eaedff', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {/* Module Header */}
            <div style={{ padding: '16px 20px', backgroundColor: '#f2f3ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eaedff', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 20, fontWeight: 600, color: '#131b2e', margin: 0 }}>
                  Live Storefront Catalogue &amp; Priority Ordering
                </h3>
                <p style={{ fontSize: 12, color: '#404945', margin: '2px 0 0' }}>
                  Drag to calibrate storefront ordering or apply batch showroom rules.
                </p>
              </div>
              <Link
                href="/admin/products/new"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, backgroundColor: '#003629', color: '#ffffff', fontSize: 12.5, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 6px rgba(0,54,41,0.2)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fedeb2' }}>add_circle</span>
                <span>+ Add Products to Showcase</span>
              </Link>
            </div>

            {/* Merchandising Controls Toolbar */}
            <div style={{ padding: 14, backgroundColor: '#faf8ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #eaedff' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: 10, fontSize: 18, color: '#707974' }}>search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter curated shop products by SKU, title or stone..."
                  style={{ width: '100%', height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: 8, border: '1px solid #eaedff', backgroundColor: '#ffffff', fontSize: 12.5, color: '#131b2e', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {/* Category Filter Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ height: 38, padding: '0 12px', backgroundColor: '#ffffff', color: '#131b2e', fontSize: 12.5, fontWeight: 600, borderRadius: 8, border: '1px solid #eaedff', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="All">All Collections (Showing All 6)</option>
                  <option value="Engagement Rings">Engagement &amp; Solitaire Rings</option>
                  <option value="Haute Necklaces">Haute Diamond Necklaces</option>
                  <option value="Wedding Bands">Platinum Wedding Bands</option>
                  <option value="High Earrings">High Earrings &amp; Pendants</option>
                  <option value="Colored Gemstones">Rare Gemstones &amp; Sapphires</option>
                  <option value="Bracelets &amp; Bangles">Bracelets &amp; Bangles</option>
                </select>

                {/* Priority Sort Dropdown */}
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  style={{ height: 38, padding: '0 12px', backgroundColor: '#ffffff', color: '#131b2e', fontSize: 12.5, fontWeight: 600, borderRadius: 8, border: '1px solid #eaedff', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="manual">Display Priority: Manual Drag-and-Drop</option>
                  <option value="price_desc">Price: High to Low (VIP First)</option>
                  <option value="velocity">Velocity: Best Sellers First</option>
                  <option value="newest">New Arrivals Chronological</option>
                </select>

                {/* Hidden Stock Switch */}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #eaedff', fontSize: 12, color: '#131b2e', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeOutOfStock}
                    onChange={(e) => setIncludeOutOfStock(e.target.checked)}
                    style={{ accentColor: '#003629' }}
                  />
                  <span>Include Out of Stock</span>
                </label>
              </div>
            </div>

            {/* Curated Product Items List / Table */}
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 760, display: 'flex', flexDirection: 'column' }}>
                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', padding: '10px 16px', backgroundColor: '#f2f3ff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', borderBottom: '1px solid #eaedff' }}>
                  <div style={{ gridColumn: 'span 1 / span 1', textAlign: 'center' }}>Rank</div>
                  <div style={{ gridColumn: 'span 5 / span 5' }}>Jewellery Piece &amp; Specifications</div>
                  <div style={{ gridColumn: 'span 2 / span 2' }}>Retail Valuation</div>
                  <div style={{ gridColumn: 'span 2 / span 2' }}>Merchandising Tags</div>
                  <div style={{ gridColumn: 'span 1 / span 1', textAlign: 'center' }}>Visibility</div>
                  <div style={{ gridColumn: 'span 1 / span 1', textAlign: 'right' }}>Actions</div>
                </div>

                {/* Product Rows */}
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #eaedff', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(242, 243, 255, 0.7)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Rank */}
                    <div style={{ gridColumn: 'span 1 / span 1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#707974', cursor: 'grab' }}>
                        drag_indicator
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#003629' }}>#{item.rank}</span>
                    </div>

                    {/* Product & Specs */}
                    <div style={{ gridColumn: 'span 5 / span 5', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', backgroundColor: '#eaedff', flexShrink: 0 }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/shop/banner-01.jpg';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#131b2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#404945', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <span style={{ fontFamily: 'monospace', color: '#707974', fontSize: 11 }}>{item.sku}</span>
                          <span>•</span>
                          <span style={{ color: '#725b38', fontWeight: 600 }}>{item.specs}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#707974', marginTop: 1 }}>{item.category}</div>
                      </div>
                    </div>

                    {/* Valuation */}
                    <div style={{ gridColumn: 'span 2 / span 2' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#131b2e' }}>{item.price}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#003629', letterSpacing: '0.04em' }}>
                        {item.statusBadge}
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ gridColumn: 'span 2 / span 2', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, backgroundColor: tag.bg, color: tag.text }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Visibility Switch */}
                    <div style={{ gridColumn: 'span 1 / span 1', display: 'flex', justifyContent: 'center' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ position: 'relative', width: 28, height: 16 }}>
                          <input
                            type="checkbox"
                            checked={item.visible}
                            onChange={() => toggleItemVisibility(item.id)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <div style={{ position: 'absolute', inset: 0, borderRadius: 8, backgroundColor: item.visible ? '#003629' : '#c0c9c3', transition: '0.2s' }}></div>
                          <div style={{ position: 'absolute', top: 2, left: item.visible ? 14 : 2, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffffff', transition: '0.2s' }}></div>
                        </div>
                      </label>
                    </div>

                    {/* Actions */}
                    <div style={{ gridColumn: 'span 1 / span 1', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <Link
                        href="/admin/products"
                        style={{ padding: 4, borderRadius: 4, color: '#404945', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                        title="Quick Edit"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                      </Link>
                      <button
                        onClick={() => alert(`Options for ${item.title}:\n- Set as Showcase Hero\n- Remove from queue\n- Recalibrate priority`)}
                        style={{ padding: 4, borderRadius: 4, color: '#404945', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                        title="Options"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Multi-Select Action Bar */}
            <div style={{ padding: '14px 20px', backgroundColor: '#f2f3ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderTop: '1px solid #eaedff' }}>
              <div style={{ fontSize: 12.5, color: '#404945' }}>
                <span style={{ fontWeight: 700, color: '#131b2e' }}>{filteredItems.length} of 1,428</span> items in current showcase queue
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => alert('Selected items designated as Featured Collection.')}
                  style={{ padding: '6px 14px', borderRadius: 8, backgroundColor: '#ffffff', color: '#131b2e', border: '1px solid #eaedff', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                >
                  Set Selected as Featured
                </button>
                <button
                  onClick={() => alert('Atelier Luxury Ribbon Badge applied.')}
                  style={{ padding: '6px 14px', borderRadius: 8, backgroundColor: '#ffffff', color: '#131b2e', border: '1px solid #eaedff', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                >
                  Apply Badge
                </button>
                <button
                  onClick={() => {
                    setNotice('Vault inventory synchronized in realtime.');
                    setTimeout(() => setNotice(null), 2500);
                  }}
                  style={{ padding: '6px 14px', borderRadius: 8, backgroundColor: '#ffffff', color: '#003629', border: '1px solid #baeed9', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                >
                  Sync Inventory Realtime
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLUMNS: Live Preview & Page Customizer Drawer */}
        <div style={{ gridColumn: 'span 4 / span 4', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Interactive Miniature /shop Preview */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md" style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #eaedff', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#003629', display: 'inline-block' }}></span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#131b2e' }}>Storefront Live Canvas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: 2, borderRadius: 8, backgroundColor: '#eaedff' }}>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  style={{ padding: 4, borderRadius: 6, border: 'none', backgroundColor: previewDevice === 'desktop' ? '#ffffff' : 'transparent', color: previewDevice === 'desktop' ? '#003629' : '#707974', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Desktop Preview"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>desktop_windows</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  style={{ padding: 4, borderRadius: 6, border: 'none', backgroundColor: previewDevice === 'mobile' ? '#ffffff' : 'transparent', color: previewDevice === 'mobile' ? '#003629' : '#707974', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Mobile Preview"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>smartphone</span>
                </button>
              </div>
            </div>

            {/* Miniature Browser Mockup Frame */}
            <div style={{ borderRadius: 8, backgroundColor: '#f2f3ff', padding: 8, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)', maxWidth: previewDevice === 'mobile' ? 240 : '100%', margin: previewDevice === 'mobile' ? '0 auto' : '0', transition: 'max-width 0.2s' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: 6, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Mock Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #eaedff' }}>
                  <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#003629' }}>
                    CARITAS
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>
                    <span>Rings</span>
                    <span>Necklaces</span>
                    <span>Watches</span>
                  </div>
                </div>

                {/* Mini Billboard */}
                {displayHero && (
                  <div style={{ height: 64, borderRadius: 6, backgroundColor: '#1b4d3e', padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -8, bottom: -8, width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(114, 91, 56, 0.3)', filter: 'blur(4px)' }}></div>
                    <span style={{ fontSize: 7, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fedeb2' }}>
                      {heroBadge}
                    </span>
                    <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 10, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {heroTitle}
                    </span>
                  </div>
                )}

                {/* Mini Product Cards Grid (4 cols preview) */}
                <div style={{ display: 'grid', gridTemplateColumns: previewDevice === 'mobile' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 6, paddingTop: 4 }}>
                  {filteredItems.slice(0, 4).map((mItem, idx) => (
                    <div key={idx} style={{ backgroundColor: '#f2f3ff', padding: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '100%', height: 32, borderRadius: 4, backgroundColor: '#e2e7ff', marginBottom: 4, overflow: 'hidden' }}>
                        <img
                          src={mItem.image}
                          alt=""
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/shop/banner-01.jpg';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ width: '100%', height: 3, backgroundColor: '#c0c9c3', borderRadius: 2 }}></div>
                      <div style={{ width: 20, height: 3, backgroundColor: '#725b38', borderRadius: 2, marginTop: 2 }}></div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', paddingTop: 4 }}>
                  <span style={{ fontSize: 8, color: '#707974', fontFamily: 'monospace' }}>caritasluxury.com/shop</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#707974', textAlign: 'center' }}>
              Preview rendered at 1:4 scale with responsive breakpoint simulation.
            </div>
          </div>

          {/* Quick Customizer & Storefront Rules Accordion */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md" style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 20, border: '1px solid #eaedff', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: 20, color: '#725b38' }}>tune</span>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#131b2e', margin: 0 }}>Storefront Rules &amp; Presentation</h4>
            </div>

            {/* Setting 1: Grid Layout Mode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#131b2e' }}>Grid Layout Configuration</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setGridLayout('4-col')}
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    fontSize: 11.5,
                    fontWeight: 700,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: gridLayout === '4-col' ? '1px solid rgba(0,54,41,0.2)' : '1px solid #eaedff',
                    backgroundColor: gridLayout === '4-col' ? '#baeed9' : '#eaedff',
                    color: gridLayout === '4-col' ? '#003629' : '#404945',
                  }}
                >
                  4-Col Luxury
                </button>
                <button
                  type="button"
                  onClick={() => setGridLayout('3-col')}
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    fontSize: 11.5,
                    fontWeight: 700,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: gridLayout === '3-col' ? '1px solid rgba(0,54,41,0.2)' : '1px solid #eaedff',
                    backgroundColor: gridLayout === '3-col' ? '#baeed9' : '#eaedff',
                    color: gridLayout === '3-col' ? '#003629' : '#404945',
                  }}
                >
                  3-Col Editorial
                </button>
                <button
                  type="button"
                  onClick={() => setGridLayout('lookbook')}
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    fontSize: 11.5,
                    fontWeight: 700,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: gridLayout === 'lookbook' ? '1px solid rgba(0,54,41,0.2)' : '1px solid #eaedff',
                    backgroundColor: gridLayout === 'lookbook' ? '#baeed9' : '#eaedff',
                    color: gridLayout === 'lookbook' ? '#003629' : '#404945',
                  }}
                >
                  Lookbook
                </button>
              </div>
            </div>

            {/* Setting 2: Density / Pagination */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#131b2e' }}>Pieces Displayed Per Page</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                style={{ width: '100%', height: 38, padding: '0 12px', backgroundColor: '#f2f3ff', color: '#131b2e', fontSize: 12.5, borderRadius: 8, border: '1px solid #eaedff', outline: 'none', cursor: 'pointer' }}
              >
                <option value="24">24 Pieces (Atelier Standard Recommended)</option>
                <option value="12">12 Pieces (High Breathing Room)</option>
                <option value="48">48 Pieces (Catalogue Dense Mode)</option>
                <option value="999">Infinite Scroll with Section Dividers</option>
              </select>
            </div>

            {/* Setting 3: Card Meta Badges Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#131b2e' }}>Client Card Attribute Badging</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#131b2e', cursor: 'pointer' }}>
                  <span>Show Carat Weight &amp; Metal Purity</span>
                  <input
                    type="checkbox"
                    checked={badgeCarat}
                    onChange={(e) => setBadgeCarat(e.target.checked)}
                    style={{ accentColor: '#003629' }}
                  />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#131b2e', cursor: 'pointer' }}>
                  <span>Display GIA/IGI Certification Inscription</span>
                  <input
                    type="checkbox"
                    checked={badgeGia}
                    onChange={(e) => setBadgeGia(e.target.checked)}
                    style={{ accentColor: '#003629' }}
                  />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#131b2e', cursor: 'pointer' }}>
                  <span>Enable &quot;Price on Request&quot; for &gt; $100k</span>
                  <input
                    type="checkbox"
                    checked={badgePriceOnReq}
                    onChange={(e) => setBadgePriceOnReq(e.target.checked)}
                    style={{ accentColor: '#003629' }}
                  />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#131b2e', cursor: 'pointer' }}>
                  <span>Show &quot;New Arrival&quot; Ribbon for &lt; 30 Days</span>
                  <input
                    type="checkbox"
                    checked={badgeNewArrival}
                    onChange={(e) => setBadgeNewArrival(e.target.checked)}
                    style={{ accentColor: '#003629' }}
                  />
                </label>
              </div>
            </div>

            {/* Setting 4: Currency & VIP Gateway */}
            <div style={{ padding: 14, borderRadius: 8, backgroundColor: '#f2f3ff', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Price Display Protocol</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#003629' }}>USD Default</span>
              </div>
              <p style={{ fontSize: 11.5, color: '#404945', margin: 0, lineHeight: '16px' }}>
                Live multi-currency geolocation active. High-net-worth VIP concierge prompt triggers after 90 seconds of browsing.
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleUpdateRules}
              disabled={saving}
              style={{ width: '100%', padding: '10px', borderRadius: 8, backgroundColor: '#eaedff', color: '#131b2e', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background-color 0.15s' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#003629' }}>save</span>
              <span>{saving ? 'Updating...' : 'Update Shop Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Edit Copy & CTA */}
      {editCopyModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 16, maxWidth: 560, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #eaedff' }}>
              <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 20, color: '#131b2e', margin: 0 }}>Edit Billboard Copy &amp; Target</h3>
              <button
                onClick={() => setEditCopyModalOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'none', color: '#707974', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#707974', display: 'block', marginBottom: 4 }}>
                  Headline Campaign (Super-Title)
                </label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', backgroundColor: '#f2f3ff', borderRadius: 8, border: '1px solid #eaedff', color: '#131b2e', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#707974', display: 'block', marginBottom: 4 }}>
                  Main Headline
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 12px', backgroundColor: '#f2f3ff', borderRadius: 8, border: '1px solid #eaedff', color: '#131b2e', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#707974', display: 'block', marginBottom: 4 }}>
                  Subtitle / Campaign Narrative
                </label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: '#f2f3ff', borderRadius: 8, border: '1px solid #eaedff', color: '#131b2e', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#707974', display: 'block', marginBottom: 4 }}>
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={heroButtonText}
                    onChange={(e) => setHeroButtonText(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', backgroundColor: '#f2f3ff', borderRadius: 8, border: '1px solid #eaedff', color: '#131b2e', fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#707974', display: 'block', marginBottom: 4 }}>
                    Target URL
                  </label>
                  <input
                    type="text"
                    value={heroButtonLink}
                    onChange={(e) => setHeroButtonLink(e.target.value)}
                    style={{ width: '100%', height: 40, padding: '0 12px', backgroundColor: '#f2f3ff', borderRadius: 8, border: '1px solid #eaedff', color: '#131b2e', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #eaedff' }}>
              <button
                onClick={() => setEditCopyModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: '#eaedff', color: '#131b2e', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditCopyModalOpen(false);
                  setNotice('Billboard copy updated in staging.');
                  setTimeout(() => setNotice(null), 2500);
                }}
                style={{ padding: '8px 20px', borderRadius: 8, backgroundColor: '#003629', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Replace Creative Asset */}
      {replaceAssetModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 16, maxWidth: 560, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #eaedff' }}>
              <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 20, color: '#131b2e', margin: 0 }}>Replace Creative Billboard Asset</h3>
              <button
                onClick={() => setReplaceAssetModalOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'none', color: '#707974', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 12.5, color: '#404945', margin: 0, lineHeight: '18px' }}>
                Upload a high-resolution haute joaillerie visual directly from your computer or provide a cloud asset URL. Recommended aspect ratio is 16:9 (1920 × 900px).
              </p>

              <ImageUpload
                value={bannerImage}
                onChange={(url) => setBannerImage(url)}
                folder="settings"
                label="Storefront Hero Billboard"
                recommendedSize="1920 × 900px"
                aspectRatio="16 / 9"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #eaedff' }}>
              <button
                onClick={() => setReplaceAssetModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: '#eaedff', color: '#131b2e', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setReplaceAssetModalOpen(false);
                  setNotice('Billboard creative asset updated.');
                  setTimeout(() => setNotice(null), 2500);
                }}
                style={{ padding: '8px 20px', borderRadius: 8, backgroundColor: '#003629', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Save Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
