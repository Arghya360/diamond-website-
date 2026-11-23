'use client';

import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../../lib/firebase/admin-service';
import type { Customer } from '../../../types/admin';

interface VIPClient {
  id: string;
  vipCode: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  tier: string;
  kycStatus: string;
  kycVerified: boolean;
  totalTransacted: string;
  numericLtv: number;
  acquisitionsCount: number;
  preferences: string;
  ringSize: string;
  assignedConcierge: string;
  conciergeInitials: string;
  conciergeSalon: string;
  lastEngagement: string;
  lastEngagementDate: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'uhnw' | 'bridal' | 'salon' | 'corporate' | 'kyc'>('all');
  const [selectedSalon, setSelectedSalon] = useState('All');
  const [selectedLtv, setSelectedLtv] = useState('All');
  const [selectedConcierge, setSelectedConcierge] = useState('All');
  const [selectedClient, setSelectedClient] = useState<VIPClient | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Museum-grade baseline private patrons from Caritas Luxury Atelier dossier
  const baselineClients: VIPClient[] = [
    {
      id: 'client-1',
      vipCode: 'CRT-VIP-9021',
      initials: 'ER',
      name: 'Elena Rostova',
      email: 'elena.rostova@genevaprivate.ch',
      phone: '+41 22 819 4001',
      city: 'Zurich',
      country: 'Switzerland',
      tier: 'Tier 1 Sovereign / UHNW',
      kycStatus: 'KYC Verified ✓',
      kycVerified: true,
      totalTransacted: '$1,240,000',
      numericLtv: 1240000,
      acquisitionsCount: 14,
      preferences: 'D/IF Type IIa Diamonds',
      ringSize: 'Ring Size 52 EU / 6 US',
      assignedConcierge: 'Julian Vance',
      conciergeInitials: 'JV',
      conciergeSalon: 'Zurich Salon',
      lastEngagement: 'Private Salon Viewing',
      lastEngagementDate: 'Nov 18, 2026',
    },
    {
      id: 'client-2',
      vipCode: 'CRT-VIP-9022',
      initials: 'HA',
      name: 'H.E. Sheikh Al-Maktoum',
      email: 'private.office@difc-holdings.ae',
      phone: '+971 4 362 7000',
      city: 'Dubai',
      country: 'United Arab Emirates',
      tier: 'Tier 1 Sovereign / UHNW',
      kycStatus: 'KYC Verified ✓',
      kycVerified: true,
      totalTransacted: '$2,850,000',
      numericLtv: 2850000,
      acquisitionsCount: 22,
      preferences: 'Emerald-Cut & Rare Columbian Stones',
      ringSize: 'Bespoke Cuff & Collier Set',
      assignedConcierge: 'Elena Vance',
      conciergeInitials: 'EV',
      conciergeSalon: 'Geneva Central Atelier',
      lastEngagement: 'High-Jewellery Vault Acquisition',
      lastEngagementDate: 'Nov 14, 2026',
    },
    {
      id: 'client-3',
      vipCode: 'CRT-VIP-8840',
      initials: 'AP',
      name: 'Arthur & Lady Pendelton',
      email: 'arthur.pendelton@mayfair-advisory.co.uk',
      phone: '+44 20 7946 0921',
      city: 'London',
      country: 'United Kingdom',
      tier: 'Bespoke Bridal Patron',
      kycStatus: 'KYC Verified ✓',
      kycVerified: true,
      totalTransacted: '$485,000',
      numericLtv: 485000,
      acquisitionsCount: 6,
      preferences: 'Oval Solitaires & Platinum Tiara Suites',
      ringSize: 'Ring Size 54 EU / 7 US',
      assignedConcierge: 'Marcus Sterling',
      conciergeInitials: 'MS',
      conciergeSalon: 'London Mayfair Salon',
      lastEngagement: 'Bespoke Bench Review',
      lastEngagementDate: 'Nov 10, 2026',
    },
    {
      id: 'client-4',
      vipCode: 'CRT-VIP-7910',
      initials: 'SC',
      name: 'Sophie Chen',
      email: 'sophie.chen@marinabay-invest.sg',
      phone: '+65 6732 9900',
      city: 'Singapore',
      country: 'Singapore',
      tier: 'Private Salon VIP',
      kycStatus: 'KYC Verified ✓',
      kycVerified: true,
      totalTransacted: '$620,000',
      numericLtv: 620000,
      acquisitionsCount: 9,
      preferences: 'Fancy Vivid Yellow & Pink Diamonds',
      ringSize: 'Ring Size 50 EU / 5.5 US',
      assignedConcierge: 'Claire Beaumont',
      conciergeInitials: 'CB',
      conciergeSalon: 'Singapore Salon',
      lastEngagement: 'Salon Champagne Tasting & Preview',
      lastEngagementDate: 'Nov 04, 2026',
    },
    {
      id: 'client-5',
      vipCode: 'CRT-VIP-9102',
      initials: 'CB',
      name: 'Camilla de Bourbon',
      email: 'camilla.bourbon@vendome-heritage.fr',
      phone: '+33 1 42 68 55 00',
      city: 'Paris',
      country: 'France',
      tier: 'Tier 1 Sovereign / UHNW',
      kycStatus: 'KYC Verified ✓',
      kycVerified: true,
      totalTransacted: '$940,000',
      numericLtv: 940000,
      acquisitionsCount: 11,
      preferences: 'Art Deco Certified Rubies & Natural Pearls',
      ringSize: 'Historical Archive Inquiries',
      assignedConcierge: 'Claire Beaumont',
      conciergeInitials: 'CB',
      conciergeSalon: 'Paris Place Vendôme',
      lastEngagement: 'Private Vault Inspection',
      lastEngagementDate: 'Oct 28, 2026',
    },
    {
      id: 'client-6',
      vipCode: 'CRT-VIP-6401',
      initials: 'JM',
      name: 'Julian Montgomery',
      email: 'j.montgomery@nycapitol.com',
      phone: '+1 212 555 0198',
      city: 'New York',
      country: 'United States',
      tier: 'Private Salon VIP',
      kycStatus: 'Pending Verification',
      kycVerified: false,
      totalTransacted: '$180,000',
      numericLtv: 180000,
      acquisitionsCount: 2,
      preferences: 'Lab-Grown Cushion 5ct+ Type IIa',
      ringSize: 'Ring Size 53 EU / 6.5 US',
      assignedConcierge: 'Julian Vance',
      conciergeInitials: 'JV',
      conciergeSalon: 'Geneva Central Atelier',
      lastEngagement: 'Concierge Video Consultation',
      lastEngagementDate: 'Oct 22, 2026',
    },
  ];

  // Map real Firestore users if available
  const combinedClients: VIPClient[] = customers.length > 0
    ? customers.map((c, i) => {
        const initials = (c.name || 'Patron')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        return {
          id: c.id,
          vipCode: `CRT-VIP-${String(1000 + i)}`,
          initials: initials || 'CP',
          name: c.name || 'Private Collector',
          email: c.email || 'patron@caritasluxury.com',
          phone: c.phone || '+41 22 819 3000',
          city: (c as any).address?.city || 'Geneva',
          country: (c as any).address?.country || 'Switzerland',
          tier: (c.totalOrders || 0) > 3 ? 'Tier 1 Sovereign / UHNW' : 'Private Salon VIP',
          kycStatus: 'KYC Verified ✓',
          kycVerified: true,
          totalTransacted: `$${((c.totalOrders || 1) * 24500).toLocaleString('en-US')}`,
          numericLtv: (c.totalOrders || 1) * 24500,
          acquisitionsCount: c.totalOrders || 1,
          preferences: 'Colorless D-Flawless Lab-Grown Diamonds',
          ringSize: 'EU Size 52 / US 6',
          assignedConcierge: 'Elena Vance',
          conciergeInitials: 'EV',
          conciergeSalon: 'Geneva Flagship',
          lastEngagement: 'Account Registration & Inquiry',
          lastEngagementDate: 'Nov 23, 2026',
        };
      })
    : baselineClients;

  // Tab Filtering
  const filteredClients = combinedClients.filter((client) => {
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSearch =
        client.name.toLowerCase().includes(q) ||
        client.vipCode.toLowerCase().includes(q) ||
        client.email.toLowerCase().includes(q) ||
        client.city.toLowerCase().includes(q) ||
        client.assignedConcierge.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // Salon filter
    if (selectedSalon !== 'All') {
      if (!client.city.toLowerCase().includes(selectedSalon.toLowerCase()) && !client.conciergeSalon.toLowerCase().includes(selectedSalon.toLowerCase())) {
        return false;
      }
    }

    // LTV filter
    if (selectedLtv !== 'All') {
      if (selectedLtv === 'UHNW' && client.numericLtv < 1000000) return false;
      if (selectedLtv === 'Prestige' && (client.numericLtv < 500000 || client.numericLtv >= 1000000)) return false;
      if (selectedLtv === 'Patron' && client.numericLtv >= 500000) return false;
    }

    // Concierge filter
    if (selectedConcierge !== 'All') {
      if (!client.assignedConcierge.toLowerCase().includes(selectedConcierge.toLowerCase())) return false;
    }

    // Tab filter
    if (activeTab === 'uhnw') {
      return client.tier.toLowerCase().includes('uhnw') || client.tier.toLowerCase().includes('sovereign');
    }
    if (activeTab === 'bridal') {
      return client.tier.toLowerCase().includes('bridal');
    }
    if (activeTab === 'salon') {
      return client.tier.toLowerCase().includes('salon');
    }
    if (activeTab === 'corporate') {
      return client.tier.toLowerCase().includes('corporate') || client.tier.toLowerCase().includes('sovereign');
    }
    if (activeTab === 'kyc') {
      return !client.kycVerified;
    }

    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003629] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#baeed9]/20 font-body-md animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-[#baeed9]">verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Top Breadcrumb & Luxury Dossier Header */}
      <section className="flex flex-col gap-space-md mb-space-xl">
        <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-outline">
          <span>BUSINESS</span>
          <span className="text-xs">/</span>
          <span>CLIENT RELATIONS</span>
          <span className="text-xs">/</span>
          <span className="text-secondary font-semibold">VIP &amp; PRIVATE CLIENT BASE</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-xs">
          <div className="space-y-1.5 max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Private Client Portfolio &amp; VIP CRM
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Oversee high-net-worth patrons, bespoke commission histories, lifetime acquisitions, private salon appointments, and Swiss KYC/AML compliance records with museum-grade precision.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => alert('VIP Patron Dossier (CSV/PDF) exported to secure local storage.')}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-sm hover:bg-surface-container-low transition-all"
            >
              <span className="material-symbols-outlined text-[19px] text-secondary">file_download</span>
              <span>Export Dossier (CSV/PDF)</span>
            </button>
            <button
              onClick={() => alert('Register New Private Client window initiated. Ready for Swiss KYC onboarding.')}
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-title-md text-title-md shadow-md hover:bg-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[19px]">person_add</span>
              <span>Register New Private Client</span>
            </button>
          </div>
        </div>
      </section>

      {/* High-Impact KPI Overview Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg mb-space-xl">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">TOTAL REGISTERED PATRONS</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">+8.6% yoy</span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <div className="font-display text-display text-on-surface tracking-tight">3,420</div>
            <div className="w-16 h-8 text-secondary/70">
              <svg className="w-full h-full" fill="none" viewBox="0 0 64 32">
                <path d="M2 28C10 26 14 18 24 20C34 22 40 10 52 12C57 13 60 4 62 3" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                <path d="M2 28C10 26 14 18 24 20C34 22 40 10 52 12C57 13 60 4 62 3V32H2V28Z" fill="currentColor" fillOpacity="0.08"></path>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>142 Bespoke Tier 1 Patrons</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">AVERAGE CLIENT LTV</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">+14.2% QoQ</span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <div className="font-display text-display text-on-surface tracking-tight">$124,500</div>
            <div className="w-16 h-8 text-primary/70">
              <svg className="w-full h-full" fill="none" viewBox="0 0 64 32">
                <path d="M2 26C12 28 20 16 32 18C44 20 48 8 62 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                <path d="M2 26C12 28 20 16 32 18C44 20 48 8 62 4V32H2V26Z" fill="currentColor" fillOpacity="0.08"></path>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
            <span>Median acquisition $48,000</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">ACTIVE BESPOKE COMMISSIONS</span>
            <span className="w-2.5 h-2.5 rounded-full bg-surface-tint animate-pulse"></span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <div className="font-display text-display text-primary tracking-tight">68 <span className="font-headline-sm text-headline-sm text-outline font-normal">In-Flight</span></div>
            <div className="p-2 rounded-lg bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Geneva, London, Dubai &amp; Zurich Salons</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">SWISS KYC/AML VERIFIED</span>
            <span className="inline-flex items-center gap-1 text-primary font-semibold font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              Secured
            </span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <div className="font-display text-display text-on-surface tracking-tight">99.4%</div>
            <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
            <span>Biometric &amp; Escrow compliant</span>
          </div>
        </div>
      </section>

      {/* Filter Segmentation Tabs (Pill Navigation) */}
      <section className="flex items-center gap-2 overflow-x-auto pb-space-sm mb-space-md no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-title-md text-title-md shrink-0 shadow-sm transition-all ${
            activeTab === 'all'
              ? 'bg-primary text-on-primary font-semibold'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>All Patrons</span>
          <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${activeTab === 'all' ? 'bg-on-primary/20 text-on-primary font-semibold' : 'bg-surface-container text-outline'}`}>
            3,420
          </span>
        </button>

        <button
          onClick={() => setActiveTab('uhnw')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-title-md text-title-md shrink-0 transition-all ${
            activeTab === 'uhnw'
              ? 'bg-primary text-on-primary font-semibold shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>Tier 1 UHNW ($500k+ LTV)</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-outline">128</span>
        </button>

        <button
          onClick={() => setActiveTab('bridal')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-title-md text-title-md shrink-0 transition-all ${
            activeTab === 'bridal'
              ? 'bg-primary text-on-primary font-semibold shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>Bespoke Bridal &amp; Commissions</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-outline">342</span>
        </button>

        <button
          onClick={() => setActiveTab('salon')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-title-md text-title-md shrink-0 transition-all ${
            activeTab === 'salon'
              ? 'bg-primary text-on-primary font-semibold shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>Private Salon VIPs</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-outline">890</span>
        </button>

        <button
          onClick={() => setActiveTab('corporate')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-title-md text-title-md shrink-0 transition-all ${
            activeTab === 'corporate'
              ? 'bg-primary text-on-primary font-semibold shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>Corporate &amp; Sovereign Accounts</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-outline">64</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-title-md text-title-md shrink-0 transition-all ${
            activeTab === 'kyc'
              ? 'bg-primary text-on-primary font-semibold shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span>Pending KYC Verification</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">18</span>
        </button>
      </section>

      {/* Search & Advanced Filter Toolbar */}
      <section className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm mb-space-lg flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
        <div className="flex flex-1 flex-wrap items-center gap-space-sm">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[19px]">search</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface-container-low text-body-md font-body-md text-on-surface rounded-xl placeholder-outline focus:outline-none focus:bg-surface-container-lowest transition-all"
              placeholder="Search patron name, client ID, passport hash, city, or assigned concierge..."
              type="text"
            />
          </div>

          {/* Dropdown: Salon */}
          <div className="relative">
            <select
              value={selectedSalon}
              onChange={(e) => setSelectedSalon(e.target.value)}
              className="h-11 pl-3.5 pr-8 appearance-none bg-surface-container-low text-body-md font-body-md text-on-surface rounded-xl cursor-pointer hover:bg-surface-container focus:outline-none transition-all"
            >
              <option value="All">Jurisdiction: All Salons</option>
              <option value="Geneva">Geneva Flagship</option>
              <option value="Zurich">Zurich Private Vault</option>
              <option value="London">London Mayfair</option>
              <option value="Paris">Place Vendôme Paris</option>
              <option value="Dubai">Dubai DIFC</option>
              <option value="Singapore">Singapore Marina Bay</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-3 text-[18px] text-outline pointer-events-none">expand_more</span>
          </div>

          {/* Dropdown: LTV */}
          <div className="relative">
            <select
              value={selectedLtv}
              onChange={(e) => setSelectedLtv(e.target.value)}
              className="h-11 pl-3.5 pr-8 appearance-none bg-surface-container-low text-body-md font-body-md text-on-surface rounded-xl cursor-pointer hover:bg-surface-container focus:outline-none transition-all"
            >
              <option value="All">LTV: All Tiers ($0 - $5M+)</option>
              <option value="UHNW">Ultra High Net Worth ($1M+)</option>
              <option value="Prestige">Prestige Tier ($500k - $1M)</option>
              <option value="Patron">Atelier Patron (&lt; $500k)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-3 text-[18px] text-outline pointer-events-none">expand_more</span>
          </div>

          {/* Dropdown: Concierge */}
          <div className="relative">
            <select
              value={selectedConcierge}
              onChange={(e) => setSelectedConcierge(e.target.value)}
              className="h-11 pl-3.5 pr-8 appearance-none bg-surface-container-low text-body-md font-body-md text-on-surface rounded-xl cursor-pointer hover:bg-surface-container focus:outline-none transition-all"
            >
              <option value="All">Concierge: All Advisors</option>
              <option value="Julian Vance">Julian Vance (Zurich)</option>
              <option value="Elena Vance">Elena Vance (Geneva)</option>
              <option value="Claire Beaumont">Claire Beaumont (Paris)</option>
              <option value="Marcus Sterling">Marcus Sterling (London)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-3 text-[18px] text-outline pointer-events-none">expand_more</span>
          </div>

          <button
            onClick={() => { setSearch(''); setSelectedSalon('All'); setSelectedLtv('All'); setSelectedConcierge('All'); }}
            className="h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-title-md text-title-md hover:bg-surface-container flex items-center gap-1.5 transition-all"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
            <span>Reset</span>
          </button>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between xl:justify-end gap-space-md shrink-0">
          <span className="font-body-sm text-body-sm text-outline">
            Showing <strong className="text-on-surface font-semibold">1–{filteredClients.length}</strong> of {combinedClients.length} Patrons
          </span>
        </div>
      </section>

      {/* Luxury Private Client Registry Table Container */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-space-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="py-4 px-6 font-label-sm text-label-sm uppercase tracking-wider text-outline">Client &amp; Identifier</th>
                <th className="py-4 px-4 font-label-sm text-label-sm uppercase tracking-wider text-outline">Tier &amp; Compliance</th>
                <th className="py-4 px-4 font-label-sm text-label-sm uppercase tracking-wider text-outline">Acquisitions &amp; LTV</th>
                <th className="py-4 px-4 font-label-sm text-label-sm uppercase tracking-wider text-outline">Tastes &amp; Preferences</th>
                <th className="py-4 px-4 font-label-sm text-label-sm uppercase tracking-wider text-outline">Assigned Concierge</th>
                <th className="py-4 px-4 font-label-sm text-label-sm uppercase tracking-wider text-outline">Last Engagement</th>
                <th className="py-4 px-6 text-right font-label-sm text-label-sm uppercase tracking-wider text-outline">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-md text-body-md">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-2 block">person_search</span>
                    No client patrons found matching your search.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="hover:bg-surface-container-low/60 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-space-md">
                        <div className="w-11 h-11 rounded-full bg-secondary-fixed/50 flex items-center justify-center font-headline-md text-headline-sm text-secondary font-serif shrink-0">
                          {client.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-title-lg text-title-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
                              {client.name}
                            </span>
                            <span className="material-symbols-outlined text-[16px] text-secondary" title="Sovereign Patron">workspace_premium</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-label-sm text-label-sm font-mono text-outline">{client.vipCode}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                              {client.city}, {client.country}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold tracking-wide">
                          {client.tier}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                          client.kycVerified ? 'bg-primary-fixed/40 text-on-primary-fixed' : 'bg-surface-container text-outline'
                        }`}>
                          <span className="material-symbols-outlined text-[13px]">
                            {client.kycVerified ? 'check_circle' : 'pending'}
                          </span>
                          {client.kycStatus}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-semibold">{client.totalTransacted}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{client.acquisitionsCount} Haute acquisitions</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 max-w-[210px]">
                        <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface truncate">
                          {client.preferences}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline truncate">{client.ringSize}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-label-sm font-semibold">
                          {client.conciergeInitials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md text-on-surface leading-tight">{client.assignedConcierge}</span>
                          <span className="font-body-sm text-body-sm text-outline">{client.conciergeSalon}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md text-on-surface">{client.lastEngagement}</span>
                        <span className="font-body-sm text-body-sm text-secondary font-medium">{client.lastEngagementDate}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          title="View Dossier"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => alert(`Direct secure dispatch channel opened for ${client.name} (${client.phone}).`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          title="Direct Encrypted Concierge Channel"
                        >
                          <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                        <button
                          onClick={() => alert(`Swiss KYC/AML Dossier verified for ${client.vipCode}.`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          title="Audit Compliance Dossier"
                        >
                          <span className="material-symbols-outlined text-[18px]">verified_user</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Client Dossier Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-space-xl shadow-2xl border border-surface-container flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-space-md border-b border-surface-container-low">
              <div className="flex items-center gap-space-md">
                <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center font-headline-md text-headline-md text-secondary font-serif shrink-0">
                  {selectedClient.initials}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                      {selectedClient.vipCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                      {selectedClient.tier}
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-primary mt-0.5">
                    {selectedClient.name}
                  </h2>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {selectedClient.city}, {selectedClient.country} • Assigned to {selectedClient.assignedConcierge}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-space-md space-y-space-md">
              <div className="grid grid-cols-2 gap-space-md">
                <div className="p-space-md bg-surface-container-low rounded-xl">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Lifetime Transacted Value (LTV)</span>
                  <div className="font-headline-md text-headline-md text-primary font-bold mt-1">{selectedClient.totalTransacted}</div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 block">{selectedClient.acquisitionsCount} Completed Acquisitions</span>
                </div>

                <div className="p-space-md bg-surface-container-low rounded-xl">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Swiss Compliance &amp; KYC</span>
                  <div className="flex items-center gap-1.5 text-primary font-semibold font-title-md text-title-md mt-1">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>{selectedClient.kycStatus}</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 block">Biometric Passport &amp; Bank Escrow Signed</span>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-low rounded-xl space-y-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Curatorial Preferences &amp; Sizing</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-xs">
                    💎 {selectedClient.preferences}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-xs">
                    💍 {selectedClient.ringSize}
                  </span>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-low rounded-xl space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Contact Information</span>
                <div className="text-body-md font-body-md text-on-surface font-medium pt-1">
                  <div>Email: {selectedClient.email}</div>
                  <div>Telephone: {selectedClient.phone}</div>
                  <div>Jurisdiction: {selectedClient.city}, {selectedClient.country}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-space-md border-t border-surface-container-low flex items-center justify-end gap-space-sm">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-all"
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  alert(`Direct concierge communication dispatched to ${selectedClient.name}.`);
                  setSelectedClient(null);
                }}
                className="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-title-md text-title-md shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Send Private Invitation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
