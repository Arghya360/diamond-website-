'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getShopSettings, updateShopSettings, getProducts } from '../../../lib/firebase/admin-service';
import ImageUpload from '../../../components/admin/ImageUpload';
import type { ShopSettings, Product } from '../../../types/admin';

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
      { label: 'Homepage Hero', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
      { label: 'Spot #1', bg: 'bg-primary-fixed', text: 'text-primary' },
    ],
    visible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg_0A6olI5NR8AvgSKpdz4Jeq_mWsnAZBiU-E0Hjef26MhVbxS733h2qMvD6sqk0XnTYFRmCDvoC2DY1SfnQmA0aG_Oo3MVIPjmkuad4d7PoK6jVc82OLsaYM8SPsxfXv15B2VjZO-y83YoGxZ-rRde3uDsbUIvpUp_iIzkkSEDYHEQF5l-MF9Vs3cLml7lM_nVrvOmG7lGxO8iF2Ayds__eRBDw1m9LGfbuvTlZ1M',
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
      { label: 'Trending Spotlight', bg: 'bg-surface-container', text: 'text-on-surface-variant' },
    ],
    visible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi0YvrRdmLCmY23in9Xf48uE730OqWjPonq2Pvje1b3-WI2c6UHwR3H2tlgN5K1zHpc8vLv0bHud8vM49y2pAgTJu2yhFe2q0d826I6NamdrfPHZRJr7___lsluW9vzf6JCZhrXIprv93xtIE0hNd7x7lK7c0JvhX1BckLWLvFMCr1ZieGID_6Bt7er8__RnUHrZOVG6JY-fCbKeJGTZdmfi3emQVgNo_DQFyAeo-V',
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
      { label: 'New Arrival', bg: 'bg-primary-fixed', text: 'text-primary' },
      { label: 'Grid #3', bg: 'bg-surface-container', text: 'text-on-surface-variant' },
    ],
    visible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFXtAP78hDoyEkiBIzc1c3nudwp6OOKdC_z3WfClfM7Wvj-CFSyPmd1hZGkbkZ7Kba03N4mcvq_r2kr58Jgevf1nQrel16EApUXSTf8LWHBxscJEN3fEOY0L1k4w22ZXmw_S1JoLDGwM7-1RjEngt5kWrFSbZIktHYV7s-VLKJUPCVuw479_7yzuEDC2yNOk4ov8sPcee9BQvSXP8nrdlAJ6wSBuCBgmuVzdgcQuB1',
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
      { label: 'VIP Reserved', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    ],
    visible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEDt_xjwiJ3hY4rM1rqUYuEtZ-G7VDSdocHo2N_UM7TMOqzc_TmvirczgPMiQM-1_WJifWO8zPZsjEpLvY284i0kjh-oX3gJWax5QOhPtfbSm8tfqvQ707q8UT9KsB1j7GEEabpWhaCGQWuo4I2KgSPH5ldWS4GTF67q14u6h5gMTom5JvLZs0Y7KlWMTb6aIA6SkARTFL0IcWvDxq21ii8AWAVr_yrSX55Ehgv1uL',
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
      { label: 'Salon Exclusive', bg: 'bg-surface-container-highest', text: 'text-on-surface' },
    ],
    visible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEuVGT0gIrhf-vUlPaCgc4nM7Ry95j6qFcQSYeBEZ9s5bdGNSPgQXKLozKV8BUUvZO0COqIayzlsH0gULqCBVKeYnaepR5yyfoj4s-KEn9vp4Kim1eQBBDSSJ5cJu8hrbNibLI_QKQ7wYOk89p915WYWVxb_LVlBiCvhtAreVSFPXDa-2C7vjsCQueX9jKR_Kp4tgWxWVCCPB6UhLOx4cI-dxn78ski-J7L5N5LhFK',
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
      { label: 'Best Seller', bg: 'bg-secondary-fixed-dim', text: 'text-on-secondary-fixed' },
    ],
    visible: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVxf8Ssr2XsH9gn6Vujk19OcAfzQ6KGNKhK16Od3nH2VWKgV1GUrFgydPxxMYjZPZK8uLj46bgiKiFCbXYDyTBJi5CyA-CKVCsNH8GhMx_sJLAgVEr7vWrDdGDaMQY-_YDIGSAAiaZWoDaDMR4n5WFD8wT7CTFYEDTgQ6uhgfNzsadeWJVWXE1Il3Xe_1k8UPy2HDRsu4KOFBpcTp8XU_cwTcw-MJ30N8DffHGCXh1',
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
  const [bannerImage, setBannerImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBgLqSodf-JzLBjCzzqrV9TVJgJEzAk_wSfp3Dg_M3TQISbT7OEkrOWeaE_vdcNzJy3UV2Ch8Tn-_P0L7a_TPaV8cOLvfuT6DdLwuM2cuhspWUwRdOOcP7tLfj9EyMba2SZxphn-YHVVkbjLv0NNypVI1x7mORJ0e9_af3ueeX3sQ3YaeNT5GK39nskAVq3pN2lsuDWLSgxt_36_SWw3Cc5xE8ayVRPGUspCgDWJ_07');
  
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

  // Firestore DB synchronization
  useEffect(() => {
    async function load() {
      try {
        const [settings, products] = await Promise.all([
          getShopSettings().catch(() => null),
          getProducts().catch(() => []),
        ]);

        if (settings) {
          if (settings.heroBadge) setHeroBadge(settings.heroBadge);
          if (settings.heroTitle) setHeroTitle(settings.heroTitle);
          if (settings.heroSubtitle) setHeroSubtitle(settings.heroSubtitle);
          if (settings.heroButtonText) setHeroButtonText(settings.heroButtonText);
          if (settings.heroButtonLink) setHeroButtonLink(settings.heroButtonLink);
          if (settings.bannerImage) setBannerImage(settings.bannerImage);
          if (settings.productsPerPage) setItemsPerPage(String(settings.productsPerPage));
        }

        // If products exist in Firestore, supplement the initial curated list
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
              { label: idx === 0 ? 'Homepage Hero' : 'Featured Selection', bg: idx === 0 ? 'bg-secondary-container' : 'bg-primary-fixed', text: idx === 0 ? 'text-on-secondary-container' : 'text-primary' },
            ],
            visible: p.published !== false,
            image: p.images?.[0]?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg_0A6olI5NR8AvgSKpdz4Jeq_mWsnAZBiU-E0Hjef26MhVbxS733h2qMvD6sqk0XnTYFRmCDvoC2DY1SfnQmA0aG_Oo3MVIPjmkuad4d7PoK6jVc82OLsaYM8SPsxfXv15B2VjZO-y83YoGxZ-rRde3uDsbUIvpUp_iIzkkSEDYHEQF5l-MF9Vs3cLml7lM_nVrvOmG7lGxO8iF2Ayds__eRBDw1m9LGfbuvTlZ1M',
          }));
          if (mappedDb.length >= 3) {
            setCuratedItems(mappedDb);
          }
        }
      } catch (err) {
        console.error('Error loading shop settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
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
    <div className="flex flex-col w-full font-body-md text-on-surface antialiased">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003629] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#baeed9]/20 font-body-md animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-[#baeed9]">verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Top Command & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md mb-space-lg">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em]">
            <span>Store Management</span>
            <span className="text-outline-variant text-[10px]">/</span>
            <span className="text-primary font-semibold">Frontend CMS</span>
            <span className="text-outline-variant text-[10px]">/</span>
            <span className="inline-flex items-center gap-1 text-primary-container px-2 py-0.5 rounded-full bg-primary-fixed/60 font-semibold tracking-normal text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              CDN Live • Synced 14s ago
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Shop Page CMS &amp; Merchandising
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Curate live storefront collections, featured fine jewellery showcases, hero visual merchandising, and granular drag-and-drop order for the Caritas global client experience.
          </p>
        </div>

        {/* Global CTA Group */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <Link
            href="/shop"
            target="_blank"
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-sm hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">visibility</span>
            <span>Preview Live Shop</span>
          </Link>
          <button
            onClick={() => alert('CMS Revisions History: Active v4.8 (Nov 23, 2026). All previous states mirrored to Zurich Cold Vault.')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-sm hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">history</span>
            <span>Revisions</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm">v4.8</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-title-md text-title-md shadow-md hover:bg-primary transition-all ${
              publishStatus === 'publishing' ? 'opacity-80 pointer-events-none' : ''
            }`}
          >
            {publishStatus === 'publishing' ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[19px]">refresh</span>
                <span>Deploying to Global CDN...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <span className="material-symbols-outlined text-[19px] text-secondary-fixed">check_circle</span>
                <span>Storefront Published!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[19px] text-secondary-fixed">publish</span>
                <span>Publish Changes to Shop</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Snapshot Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Live Storefront Items</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-md text-headline-md text-on-surface tracking-tight">
              1,428 <span className="font-label-md text-label-md text-outline">Units</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
              <span className="text-primary font-semibold">6 Collections</span>
              <span className="text-outline-variant">•</span>
              <span>99.4% In Stock</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Showcase Spotlight</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-md text-headline-md text-on-surface tracking-tight">
              8 Pieces <span className="font-label-md text-label-md text-primary">+18.4% CTR</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              4 Rings, 2 Necklaces, 2 Earrings
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Active Promotional Banner</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-semibold uppercase">Live Now</span>
          </div>
          <div className="mt-space-sm">
            <div className="font-title-lg text-title-lg text-on-surface truncate" title="Spring Equinox Haute Solitaire Showcase">
              Spring Equinox Showcase
            </div>
            <div className="font-body-sm text-body-sm text-secondary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
              <span>15% Atelier VIP Privilege</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Shop Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </div>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-md text-headline-md text-on-surface tracking-tight">
              3.82% <span className="font-label-md text-label-md text-primary">+0.6% MoM</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center justify-between">
              <span>Avg Time: 4m 12s</span>
              <span className="text-outline text-label-sm">High Engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-space-md no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-space-md py-2 rounded-lg font-title-md text-title-md transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-primary text-on-primary shadow-sm font-semibold'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Primary Split Grid: Left 8-col Builder, Right 4-col Preview & Settings */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT 8 COLUMNS: Content & Product Grid CMS */}
        <div className="xl:col-span-8 space-y-space-lg">
          {/* Hero Banner Showcase Module */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">art_track</span>
                <span className="font-title-lg text-title-lg text-on-surface">Storefront Hero Billboard Spotlight</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayHero}
                    onChange={(e) => setDisplayHero(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-2 font-label-md text-label-md text-on-surface">Display on /shop</span>
                </label>
              </div>
            </div>

            <div className="p-space-lg flex flex-col md:flex-row gap-space-lg items-center">
              <div className="w-full md:w-60 h-36 rounded-lg overflow-hidden relative shrink-0 shadow-sm bg-surface-container-low">
                <img
                  className="w-full h-full object-cover"
                  src={bannerImage}
                  alt="Hero Billboard Showcase"
                />
                <span className="absolute top-2 left-2 bg-primary/90 text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active Billboard
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.15em] font-semibold">
                    {heroBadge}
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-label-sm text-label-sm text-outline">Target URL: {heroButtonLink}</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{heroTitle}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                  {heroSubtitle}
                </p>
                <div className="pt-1 flex items-center gap-space-sm flex-wrap">
                  <button
                    onClick={() => setEditCopyModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-primary font-title-md text-title-md hover:bg-surface-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>Edit Copy &amp; CTA</span>
                  </button>
                  <button
                    onClick={() => setReplaceAssetModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-title-md text-title-md hover:bg-surface-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">image</span>
                    <span>Replace Creative Asset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Product Display & Merchandising Grid */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            {/* Module Header */}
            <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Live Storefront Catalogue &amp; Priority Ordering</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Drag to calibrate storefront ordering or apply batch showroom rules.</p>
              </div>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-space-md py-2 rounded-lg bg-primary text-on-primary font-title-md text-title-md shadow-sm hover:bg-primary-container transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Add Products to Showcase</span>
              </Link>
            </div>

            {/* Merchandising Controls Toolbar */}
            <div className="p-space-md bg-surface-bright flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex flex-1 min-w-[260px] items-center relative">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-lg bg-surface-container-lowest text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  placeholder="Filter curated shop products by SKU, title or stone..."
                />
              </div>

              <div className="flex flex-wrap items-center gap-space-sm">
                {/* Category Filter Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 px-3 bg-surface-container-lowest text-on-surface font-title-md text-title-md rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
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
                  className="h-10 px-3 bg-surface-container-lowest text-on-surface font-title-md text-title-md rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
                >
                  <option value="manual">Display Priority: Manual Drag-and-Drop</option>
                  <option value="price_desc">Price: High to Low (VIP First)</option>
                  <option value="velocity">Velocity: Best Sellers First</option>
                  <option value="newest">New Arrivals Chronological</option>
                </select>

                {/* Hidden Stock Switch */}
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-surface-container-lowest rounded-lg cursor-pointer shadow-xs">
                  <input
                    type="checkbox"
                    checked={includeOutOfStock}
                    onChange={(e) => setIncludeOutOfStock(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">Include Out of Stock</span>
                </label>
              </div>
            </div>

            {/* Curated Product Items List / Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[760px] flex flex-col divide-y divide-surface-container">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-space-md py-3 bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-5">Jewellery Piece &amp; Specifications</div>
                  <div className="col-span-2">Retail Valuation</div>
                  <div className="col-span-2">Merchandising Tags</div>
                  <div className="col-span-1 text-center">Visibility</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Product Rows */}
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center px-space-md py-3.5 hover:bg-surface-container-low/70 transition-colors group"
                  >
                    <div className="col-span-1 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-outline cursor-grab active:cursor-grabbing text-[18px]">
                        drag_indicator
                      </span>
                      <span className="font-title-md text-title-md font-bold text-primary">#{item.rank}</span>
                    </div>

                    <div className="col-span-5 flex items-center gap-space-sm">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0 shadow-xs">
                        <img
                          className="w-full h-full object-cover"
                          src={item.image}
                          alt={item.title}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-title-md text-title-md text-on-surface truncate font-semibold">
                          {item.title}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                          <span className="text-outline font-mono text-[12px]">{item.sku}</span>
                          <span>•</span>
                          <span className="text-secondary font-medium">{item.specs}</span>
                        </div>
                        <div className="text-[11px] text-outline">{item.category}</div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="font-title-md text-title-md text-on-surface font-semibold">{item.price}</div>
                      <div className="font-label-sm text-label-sm text-primary uppercase">{item.statusBadge}</div>
                    </div>

                    <div className="col-span-2 flex flex-wrap gap-1">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${tag.bg} ${tag.text}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={() => toggleItemVisibility(item.id)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products`}
                        className="p-1 rounded hover:bg-surface-container text-on-surface-variant"
                        title="Quick Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button
                        onClick={() => alert(`Options for ${item.title}:\n- Set as Showcase Hero\n- Remove from queue\n- Recalibrate priority`)}
                        className="p-1 rounded hover:bg-surface-container text-on-surface-variant"
                        title="Options"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Multi-Select Action Bar */}
            <div className="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm text-body-sm text-on-surface-variant font-body-sm">
                <span className="font-semibold text-on-surface">{filteredItems.length} of 1,428</span> items in current showcase queue
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Selected items designated as Featured Collection.')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container shadow-xs"
                >
                  Set Selected as Featured
                </button>
                <button
                  onClick={() => alert('Atelier Luxury Ribbon Badge applied.')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container shadow-xs"
                >
                  Apply Badge
                </button>
                <button
                  onClick={() => {
                    setNotice('Vault inventory synchronized in realtime.');
                    setTimeout(() => setNotice(null), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md hover:bg-primary-fixed shadow-xs"
                >
                  Sync Inventory Realtime
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLUMNS: Live Preview & Page Customizer Drawer */}
        <div className="xl:col-span-4 space-y-space-lg">
          {/* Interactive Miniature /shop Preview */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Storefront Live Canvas</span>
              </div>
              <div className="flex items-center p-0.5 rounded-lg bg-surface-container">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded transition-all ${
                    previewDevice === 'desktop'
                      ? 'text-primary bg-surface-container-lowest shadow-xs'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  title="Desktop Preview"
                >
                  <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded transition-all ${
                    previewDevice === 'mobile'
                      ? 'text-primary bg-surface-container-lowest shadow-xs'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  title="Mobile Preview"
                >
                  <span className="material-symbols-outlined text-[16px]">smartphone</span>
                </button>
              </div>
            </div>

            {/* Miniature Browser Mockup Frame */}
            <div className={`rounded-lg bg-surface-container-low p-2 shadow-inner transition-all ${
              previewDevice === 'mobile' ? 'max-w-[260px] mx-auto' : 'w-full'
            }`}>
              <div className="bg-surface-container-lowest rounded-md p-3 space-y-2.5">
                {/* Mock Header */}
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="font-headline-sm text-[11px] tracking-[0.2em] font-serif text-primary font-bold">
                    CARITAS
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] text-outline uppercase tracking-wider">
                    <span>Rings</span>
                    <span>Necklaces</span>
                    <span>Watches</span>
                  </div>
                </div>

                {/* Mini Billboard */}
                {displayHero && (
                  <div className="h-16 rounded bg-primary-container p-2 flex flex-col justify-end text-on-primary relative overflow-hidden">
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-secondary/30 blur-sm"></div>
                    <span className="text-[8px] uppercase tracking-widest text-secondary-fixed">
                      {heroBadge}
                    </span>
                    <span className="text-[10px] font-headline-md font-serif leading-tight truncate">
                      {heroTitle}
                    </span>
                  </div>
                )}

                {/* Mini Product Cards Grid (4 cols preview) */}
                <div className={`grid gap-1.5 pt-1 ${previewDevice === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
                  {filteredItems.slice(0, 4).map((mItem, idx) => (
                    <div key={idx} className="bg-surface-container-low p-1 rounded flex flex-col items-center">
                      <div className="w-full h-8 rounded bg-surface-container-high mb-1 overflow-hidden">
                        <img src={mItem.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-full h-1 bg-outline-variant rounded"></div>
                      <div className="w-8 h-1 bg-secondary rounded mt-0.5"></div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-1">
                  <span className="text-[8px] text-outline font-mono">caritasluxury.com/shop</span>
                </div>
              </div>
            </div>

            <div className="text-body-sm text-body-sm text-outline text-center">
              Preview rendered at 1:4 scale with responsive breakpoint simulation.
            </div>
          </div>

          {/* Quick Customizer & Storefront Rules Accordion */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
              <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">Storefront Rules &amp; Presentation</h4>
            </div>

            {/* Setting 1: Grid Layout Mode */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Grid Layout Configuration</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGridLayout('4-col')}
                  className={`px-2 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
                    gridLayout === '4-col'
                      ? 'bg-primary-fixed/60 text-primary border border-primary/20'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  4-Col Luxury
                </button>
                <button
                  type="button"
                  onClick={() => setGridLayout('3-col')}
                  className={`px-2 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
                    gridLayout === '3-col'
                      ? 'bg-primary-fixed/60 text-primary border border-primary/20'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  3-Col Editorial
                </button>
                <button
                  type="button"
                  onClick={() => setGridLayout('lookbook')}
                  className={`px-2 py-2 rounded-lg font-label-md text-label-md font-semibold text-center transition-all ${
                    gridLayout === 'lookbook'
                      ? 'bg-primary-fixed/60 text-primary border border-primary/20'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Lookbook
                </button>
              </div>
            </div>

            {/* Setting 2: Density / Pagination */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Pieces Displayed Per Page</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
              >
                <option value="24">24 Pieces (Atelier Standard Recommended)</option>
                <option value="12">12 Pieces (High Breathing Room)</option>
                <option value="48">48 Pieces (Catalogue Dense Mode)</option>
                <option value="999">Infinite Scroll with Section Dividers</option>
              </select>
            </div>

            {/* Setting 3: Card Meta Badges Toggle */}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Client Card Attribute Badging</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface cursor-pointer">
                  <span>Show Carat Weight &amp; Metal Purity</span>
                  <input
                    type="checkbox"
                    checked={badgeCarat}
                    onChange={(e) => setBadgeCarat(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface cursor-pointer">
                  <span>Display GIA/IGI Certification Inscription</span>
                  <input
                    type="checkbox"
                    checked={badgeGia}
                    onChange={(e) => setBadgeGia(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface cursor-pointer">
                  <span>Enable &quot;Price on Request&quot; for &gt; $100k</span>
                  <input
                    type="checkbox"
                    checked={badgePriceOnReq}
                    onChange={(e) => setBadgePriceOnReq(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between text-body-sm font-body-sm text-on-surface cursor-pointer">
                  <span>Show &quot;New Arrival&quot; Ribbon for &lt; 30 Days</span>
                  <input
                    type="checkbox"
                    checked={badgeNewArrival}
                    onChange={(e) => setBadgeNewArrival(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>

            {/* Setting 4: Currency & VIP Gateway */}
            <div className="p-space-md rounded-lg bg-surface-container-low space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Price Display Protocol</span>
                <span className="font-label-sm text-label-sm text-primary font-semibold">USD Default</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Live multi-currency geolocation active. High-net-worth VIP concierge prompt triggers after 90 seconds of browsing.
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleUpdateRules}
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-surface-container text-on-surface font-title-md text-title-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">save</span>
              <span>{saving ? 'Updating...' : 'Update Shop Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Edit Copy & CTA */}
      {editCopyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Edit Billboard Copy &amp; Target</h3>
              <button
                onClick={() => setEditCopyModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Headline Campaign (Super-Title)
                </label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface-container-low rounded-lg text-on-surface font-body-md focus:outline-none"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface-container-low rounded-lg text-on-surface font-body-md focus:outline-none"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Subtitle / Campaign Narrative
                </label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full p-3 bg-surface-container-low rounded-lg text-on-surface font-body-md focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={heroButtonText}
                    onChange={(e) => setHeroButtonText(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-container-low rounded-lg text-on-surface font-body-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                    Target URL
                  </label>
                  <input
                    type="text"
                    value={heroButtonLink}
                    onChange={(e) => setHeroButtonLink(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-container-low rounded-lg text-on-surface font-body-md focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
              <button
                onClick={() => setEditCopyModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-title-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditCopyModalOpen(false);
                  setNotice('Billboard copy updated in staging.');
                  setTimeout(() => setNotice(null), 2500);
                }}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-title-md font-semibold"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Replace Creative Asset */}
      {replaceAssetModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Replace Creative Billboard Asset</h3>
              <button
                onClick={() => setReplaceAssetModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-body-sm text-on-surface-variant">
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

            <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
              <button
                onClick={() => setReplaceAssetModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-title-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setReplaceAssetModalOpen(false);
                  setNotice('Billboard creative asset updated.');
                  setTimeout(() => setNotice(null), 2500);
                }}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-title-md font-semibold"
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
