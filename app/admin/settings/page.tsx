'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import { getAdminUsers, addAdminUser } from '../../../lib/firebase/admin-service';
import { seedAllWebsiteData } from '../../../lib/firebase/seed-data';
import type { AdminUser } from '../../../types/admin';

export default function AdminSettingsPage() {
  const { user, adminProfile } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'currencies' | 'security' | 'seo' | 'notifications' | 'api'>('general');

  // Brand Settings State
  const [atelierName, setAtelierName] = useState('Caritas Haute Joaillerie Genève');
  const [storefrontUrl, setStorefrontUrl] = useState('caritasluxury.com');
  const [conciergeEmail, setConciergeEmail] = useState('concierge@caritasluxury.com');
  const [luxuryTagline, setLuxuryTagline] = useState('Master Crafted High Jewellery, Rare Gemstones & Bespoke Creations');
  const [storefrontEngineActive, setStorefrontEngineActive] = useState(true);
  const [privateSalonGate, setPrivateSalonGate] = useState<'public' | 'invitation'>('public');

  // Administrator Management State
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('admin');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setSavingAdmin(true);

    try {
      await addAdminUser(newEmail.trim().toLowerCase(), newRole, newDisplayName.trim());
      setNotice(`Administrator privileges granted to ${newEmail}.`);
      setNewEmail('');
      setNewDisplayName('');
      await loadAdmins();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error adding admin: ' + err.message);
    } finally {
      setSavingAdmin(false);
    }
  };

  const handleSyncData = async () => {
    if (!confirm('Re-sync website data into Firebase Firestore? This safely ensures all default products, categories, and settings exist.')) {
      return;
    }
    setSeeding(true);
    try {
      const res = await seedAllWebsiteData(true);
      setNotice(res.message);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error syncing data: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleSaveSettings = () => {
    setNotice('Website brand settings and Swiss security policies updated.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="relative w-full">
      {/* Subtle ambient decorative glow behind canvas */}
      <div className="absolute -top-12 -right-8 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-96 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003629] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#baeed9]/20 font-body-md animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-[#baeed9]">verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Header & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md mb-space-lg">
        <div className="space-y-space-xs max-w-3xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm tracking-[0.12em] uppercase">
            <span>System</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>Platform Configuration</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-secondary font-semibold">Website Settings</span>
          </div>
          {/* Page Title & Subtitle */}
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Website Settings &amp; Storefront Configuration
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Manage global brand identity, domain routing, multi-currency exchange protocols, concierge triggers, high-value escrow thresholds, and Swiss banking-grade security policies.
          </p>
        </div>
        {/* Header Actions */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={() => {
              setAtelierName('Caritas Haute Joaillerie Genève');
              setStorefrontUrl('caritasluxury.com');
              setConciergeEmail('concierge@caritasluxury.com');
              setNotice('Changes reverted to saved state.');
              setTimeout(() => setNotice(null), 3000);
            }}
            className="px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-title-md text-title-md shadow-sm transition-all duration-150 flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">undo</span>
            <span>Discard Changes</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md shadow-md transition-all duration-150 flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">cloud_sync</span>
            <span>Save &amp; Sync to CDN</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Horizontal Ribbon */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-1.5 shadow-sm mb-space-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 rounded-lg font-title-md text-title-md flex items-center gap-2 transition-all ${
              activeTab === 'general'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>General &amp; Brand Identity</span>
          </button>
          <button
            onClick={() => setActiveTab('currencies')}
            className={`px-4 py-2.5 rounded-lg font-title-md text-title-md flex items-center gap-2 transition-all ${
              activeTab === 'currencies'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>Currencies &amp; Localization</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-lg font-title-md text-title-md flex items-center gap-2 transition-all ${
              activeTab === 'security'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <span>Security, KYC &amp; Escrow Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2.5 rounded-lg font-title-md text-title-md flex items-center gap-2 transition-all ${
              activeTab === 'seo'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            <span>SEO &amp; Domain Management</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-lg font-title-md text-title-md flex items-center gap-2 transition-all ${
              activeTab === 'notifications'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">room_service</span>
            <span>Notifications &amp; Concierge Routing</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2.5 rounded-lg font-title-md text-title-md flex items-center gap-2 transition-all ${
              activeTab === 'api'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            <span>API &amp; Atelier Vault Integrations</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout Grid (70% Configuration / 30% Live Status) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl">
        {/* Left Column: Main Configuration Suite */}
        <div className="xl:col-span-8 space-y-space-xl">
          {/* SECTION 1: Brand & Storefront Identity */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between pb-space-md border-b border-surface-container-low">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">Atelier Presence</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Storefront &amp; Brand Identity</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Global public identifiers, salon availability modes, and digital storefront telemetry.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low">
                <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">Live &amp; Synchronized</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-md">
              {/* Official Name */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Atelier Official Name</label>
                <div className="relative">
                  <input
                    value={atelierName}
                    onChange={(e) => setAtelierName(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none transition-all"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-[18px] text-outline">verified_user</span>
                </div>
                <span className="font-body-sm text-body-sm text-outline">Used in official escrow invoices and global certificates</span>
              </div>

              {/* Public Storefront URL */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Public Storefront URL</label>
                <div className="flex">
                  <span className="h-11 px-3 bg-surface-container text-on-surface-variant font-label-md text-label-md rounded-l-lg flex items-center">https://</span>
                  <input
                    value={storefrontUrl}
                    onChange={(e) => setStorefrontUrl(e.target.value)}
                    className="flex-1 h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-r-lg focus:bg-surface-container-lowest focus:outline-none transition-all"
                    type="text"
                  />
                </div>
                <span className="font-body-sm text-body-sm text-outline">Canonical root with HSTS preloaded enforcement</span>
              </div>

              {/* Concierge Email */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Primary Support Concierge Email</label>
                <div className="relative">
                  <input
                    value={conciergeEmail}
                    onChange={(e) => setConciergeEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none transition-all"
                    type="email"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-outline">mail</span>
                </div>
                <span className="font-body-sm text-body-sm text-outline">Dispatches high-net-worth customer inquiries directly to duty liaisons</span>
              </div>

              {/* Luxury Tagline */}
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Luxury Tagline (Global Meta)</label>
                <input
                  value={luxuryTagline}
                  onChange={(e) => setLuxuryTagline(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none transition-all"
                  type="text"
                />
                <span className="font-body-sm text-body-sm text-outline">Appears on social previews, search engine snippets, and catalogue covers</span>
              </div>
            </div>

            {/* Storefront Operational States */}
            <div className="mt-space-lg pt-space-lg bg-surface-container-low/50 rounded-xl p-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Public Storefront Engine</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                      Active
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline">Global CDN propagation actively rendering client catalog</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStorefrontEngineActive(!storefrontEngineActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                    storefrontEngineActive ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      storefrontEngineActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Private Salon Access Gate</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                      Dual-Mode
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline">Allow public access vs. By Private Invitation Only</p>
                </div>
                <div className="flex items-center bg-surface-container-low rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setPrivateSalonGate('public')}
                    className={`px-2.5 py-1 text-label-sm font-label-sm rounded transition-all ${
                      privateSalonGate === 'public'
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrivateSalonGate('invitation')}
                    className={`px-2.5 py-1 text-label-sm font-label-sm rounded transition-all ${
                      privateSalonGate === 'invitation'
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    VIP Gate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Administrators & Vault Personnel */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm space-y-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Administrators &amp; Vault Custodians</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Authorized fiduciary personnel with elevated privileges to manage inventory, escrows, and private dossiers.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                Tier IV Access
              </span>
            </div>

            {/* Add New Administrator Form */}
            <form onSubmit={handleAddAdmin} className="p-space-md bg-surface-container-low rounded-xl space-y-space-md">
              <span className="font-title-md text-title-md text-on-surface font-semibold block">Grant New Administrator Access</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Elena Vance)"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="h-11 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Administrator Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-11 px-3.5 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
                  required
                />
                <div className="flex gap-2">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="h-11 px-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg focus:outline-none flex-1"
                  >
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="editor">Curator / Editor</option>
                  </select>
                  <button
                    type="submit"
                    disabled={savingAdmin}
                    className="h-11 px-4 rounded-lg bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-all shrink-0"
                  >
                    {savingAdmin ? 'Granting...' : 'Grant Access'}
                  </button>
                </div>
              </div>
            </form>

            {/* Active Administrators Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3 px-4">Custodian / Email</th>
                    <th className="py-3 px-4">Authorization Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low font-body-md text-body-md">
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-semibold">
                          EV
                        </div>
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md text-on-surface font-semibold">Elena Vance (Caritas360)</span>
                          <span className="font-body-sm text-body-sm text-outline">curator.geneve@caritasluxury.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                        Super Administrator
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Active &amp; Authenticated
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-outline font-label-sm text-label-sm font-mono">
                      FULL_VAULT_ROOT
                    </td>
                  </tr>

                  {admins.map((adm) => (
                    <tr key={adm.uid} className="hover:bg-surface-container-low/40">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center font-label-sm text-label-sm font-semibold">
                            {(adm.displayName || adm.email)[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-title-md text-title-md text-on-surface font-semibold">{adm.displayName || 'Authorized Admin'}</span>
                            <span className="font-body-sm text-body-sm text-outline">{adm.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase">
                          {adm.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Authorized
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-outline font-label-sm text-label-sm font-mono">
                        CUSTODIAN_VERIFIED
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: Cloud Infrastructure & Database Baseline Sync */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm space-y-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Cloud Database &amp; Data Isolation</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Guaranteed isolated Firebase collections with prefix <code className="bg-surface-container px-1.5 py-0.5 rounded text-primary font-mono text-xs">caritas_*</code> ensuring zero collision with any other projects.</p>
              </div>
              <button
                onClick={handleSyncData}
                disabled={seeding}
                className="px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-title-md text-title-md flex items-center gap-2 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">sync</span>
                <span>{seeding ? 'Syncing Baseline...' : 'Re-Sync Baseline Data'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
              <div className="p-space-md bg-surface-container-low rounded-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1">Database Prefix</span>
                <span className="font-title-md text-title-md font-mono text-primary font-semibold">caritas_* (100% Protected)</span>
              </div>
              <div className="p-space-md bg-surface-container-low rounded-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1">Project Identifier</span>
                <span className="font-title-md text-title-md font-mono text-on-surface">caritas-luxury-diamonds</span>
              </div>
              <div className="p-space-md bg-surface-container-low rounded-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1">Media Storage Bucket</span>
                <span className="font-title-md text-title-md font-mono text-secondary truncate block">caritas-luxury-diamonds.appspot.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Infrastructure Telemetry */}
        <div className="xl:col-span-4 space-y-space-lg">
          {/* Cloud Infrastructure Telemetry Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface font-semibold">Infrastructure Telemetry</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                FINMA Tier IV
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl">
                <span className="font-body-sm text-body-sm text-outline">Database Latency</span>
                <span className="font-title-md text-title-md text-primary font-semibold">18ms • Ultra Low</span>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl">
                <span className="font-body-sm text-body-sm text-outline">Media Storage Quota</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">4.2 GB / 100 GB</span>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl">
                <span className="font-body-sm text-body-sm text-outline">Active Admin Sessions</span>
                <span className="font-title-md text-title-md text-secondary font-semibold">3 Authorized</span>
              </div>

              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-xl">
                <span className="font-body-sm text-body-sm text-outline">Uptime SLA</span>
                <span className="font-title-md text-title-md text-surface-tint font-semibold">99.99% Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Swiss Banking Security Policies Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">policy</span>
              <span className="font-title-md text-title-md text-on-surface font-semibold">Swiss Fiduciary Policies</span>
            </div>

            <div className="space-y-3 text-body-sm text-body-sm text-on-surface-variant">
              <div className="p-space-sm bg-surface-container-low rounded-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-0.5">Escrow Threshold</span>
                <p className="font-semibold text-on-surface">$25,000 USD and above requires multi-signatory escrow release.</p>
              </div>

              <div className="p-space-sm bg-surface-container-low rounded-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-0.5">Swiss KYC / AML</span>
                <p className="font-semibold text-on-surface">Automated verification for private clients transacting above $10,000 USD.</p>
              </div>

              <div className="p-space-sm bg-surface-container-low rounded-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-0.5">Biometric Encryption</span>
                <p className="font-semibold text-on-surface">FIDO2 WebAuthn passkey authentication backed by AES-256 HSM keystore.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
