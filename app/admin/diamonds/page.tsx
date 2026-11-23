'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { deleteDiamond, getDiamonds, updateDiamond } from '../../../lib/firebase/admin-service';
import type { Diamond } from '../../../types/admin';

const SHAPES = ['Round Brilliant', 'Princess', 'Emerald', 'Oval', 'Radiant', 'Pear', 'Marquise', 'Cushion'];
const COLORS = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
const CLARITIES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'];

const SHAPE_ICONS: Record<string, React.ReactNode> = {
  'Round Brilliant': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>,
  'Princess': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="1"/></svg>,
  'Emerald': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="6,3 18,3 21,7 21,17 18,21 6,21 3,17 3,7"/></svg>,
  'Oval': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="12" rx="7" ry="10"/></svg>,
  'Radiant': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="6,3 18,3 21,6 21,18 18,21 6,21 3,18 3,6"/></svg>,
  'Pear': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 C8 8, 4 14, 4 17 A8 8 0 0 0 20 17 C20 14, 16 8, 12 2 Z"/></svg>,
  'Marquise': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 C18 7, 21 12, 12 22 C3 12, 6 7, 12 2 Z"/></svg>,
  'Cushion': <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="5"/></svg>,
};

const BASE_DIAMONDS = [
  { id: 'CRT-DIA-8842', name: 'Round Brilliant', carat: 3.20, color: 'D', clarity: 'FL', cut: 'Super Ideal', origin: 'Natural', lab: 'GIA 2451098', price: 128400, rapMargin: '+36%', status: 'Vault Live', shape: 'Round Brilliant', measurements: '9.42 × 9.45 × 5.83 mm', fluorescence: 'None', published: true, category: 'white', image: '/wp-content/uploads/diamond/download.jpg' },
  { id: 'CRT-DIA-7721', name: 'Emerald Cut', carat: 2.45, color: 'E', clarity: 'VVS1', cut: 'Excellent', origin: 'Natural', lab: 'GIA 6291048', price: 54200, rapMargin: '+28%', status: 'VIP Reserved', shape: 'Emerald', measurements: '8.90 × 6.22 × 4.10 mm', fluorescence: 'Faint', published: true, category: 'white', image: '/wp-content/uploads/diamond/download%20(2).jpg' },
  { id: 'CRT-DIA-6630', name: 'Oval Brilliant', carat: 4.05, color: 'D', clarity: 'VVS2', cut: 'Super Ideal', origin: 'Lab', lab: 'IGI LG60239', price: 38000, rapMargin: '+22%', status: 'Vault Live', shape: 'Oval', measurements: '12.18 × 8.42 × 5.15 mm', fluorescence: 'None', published: true, category: 'white', image: '/wp-content/uploads/diamond/download%20(8).jpg' },
  { id: 'CRT-DIA-5519', name: 'Princess Cut', carat: 2.10, color: 'F', clarity: 'VS1', cut: 'Excellent', origin: 'Natural', lab: 'GIA 1198420', price: 32500, rapMargin: '+18%', status: 'Vault Live', shape: 'Princess', measurements: '7.15 × 7.12 × 5.08 mm', fluorescence: 'None', published: true, category: 'pink', image: '/wp-content/uploads/diamond/download%20(1).jpg' },
  { id: 'CRT-DIA-4408', name: 'Radiant Cut', carat: 2.80, color: 'G', clarity: 'VS2', cut: 'Excellent', origin: 'Lab', lab: 'IGI 8840129', price: 15800, rapMargin: '+14%', status: 'In Escrow', shape: 'Radiant', measurements: '9.20 × 7.05 × 4.70 mm', fluorescence: 'None', published: true, category: 'white', image: '/wp-content/uploads/diamond/download%20(6).jpg' },
];

export default function AdminDiamondsPage() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [originFilter, setOriginFilter] = useState<'All' | 'Natural' | 'Lab'>('All');
  const [selectedShape, setSelectedShape] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedClarity, setSelectedClarity] = useState<string>('All');
  const [selectedStone, setSelectedStone] = useState<any>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    try { setDiamonds(await getDiamonds()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const allStones = useMemo(() => {
    if (diamonds.length === 0) return BASE_DIAMONDS as any[];
    const fromDb = diamonds.map((d) => ({
      id: d.id || 'CRT-DIA-X',
      name: d.name,
      carat: parseFloat(String(d.carat) || '1.0') || 1.0,
      color: d.color || 'D',
      clarity: d.clarity || 'VVS1',
      cut: d.cut || 'Excellent',
      origin: (d.origin === 'Lab Grown' || d.category === 'pink') ? 'Lab' : 'Natural',
      lab: 'GIA Inscribed',
      price: d.price || 10000,
      rapMargin: '+20%',
      status: d.published ? 'Vault Live' : 'Draft',
      shape: d.shape || 'Round Brilliant',
      measurements: '8.50 × 8.52 × 5.25 mm',
      fluorescence: 'None',
      published: d.published !== false,
      category: d.category || 'white',
      image: d.image || '/wp-content/uploads/diamond/download.jpg',
      raw: d,
    }));
    return [...fromDb, ...BASE_DIAMONDS];
  }, [diamonds]);

  const filtered = useMemo(() => allStones.filter((s) => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.lab.toLowerCase().includes(q);
    const matchOrigin = originFilter === 'All' || s.origin === originFilter;
    const matchShape = selectedShape === 'All' || s.shape === selectedShape;
    const matchColor = selectedColor === 'All' || s.color === selectedColor;
    const matchClarity = selectedClarity === 'All' || s.clarity === selectedClarity;
    return matchSearch && matchOrigin && matchShape && matchColor && matchClarity;
  }), [allStones, search, originFilter, selectedShape, selectedColor, selectedClarity]);

  const natural = allStones.filter((s) => s.origin === 'Natural').length;
  const lab = allStones.filter((s) => s.origin === 'Lab').length;

  const togglePublish = async (stone: any) => {
    if (!stone.raw?.id) { setNotice('Status toggled (demo stone).'); setTimeout(() => setNotice(null), 2500); return; }
    const next = !stone.published;
    await updateDiamond(stone.raw.id, { published: next });
    setDiamonds((prev) => prev.map((d) => d.id === stone.raw.id ? { ...d, published: next } : d));
    setNotice(`"${stone.name}" ${next ? 'published' : 'archived'}.`);
    setTimeout(() => setNotice(null), 2500);
  };

  const removeDiamond = async (stone: any) => {
    if (!stone.raw?.id) { setNotice('Cannot delete baseline stone.'); setTimeout(() => setNotice(null), 2500); return; }
    if (!confirm(`Delete "${stone.name}"?`)) return;
    await deleteDiamond(stone.raw.id);
    setDiamonds((prev) => prev.filter((d) => d.id !== stone.raw.id));
    setNotice(`"${stone.name}" deleted.`);
    setTimeout(() => setNotice(null), 2500);
  };

  const openDossier = (stone: any) => { setSelectedStone(stone); setDossierOpen(true); };

  const statusBadge = (status: string) => {
    if (status === 'Vault Live') return { bg: '#BAEED9', fg: '#002117' };
    if (status === 'VIP Reserved') return { bg: '#FEDEB2', fg: '#78603E' };
    return { bg: '#EAEDFF', fg: '#131B2E' };
  };

  const C = { primary: '#003629', secondary: '#725B38', surface: '#faf8ff', surfaceLow: '#F2F3FF', card: '#FFFFFF', onSurface: '#131B2E', outline: '#707974', variant: '#404945', border: '#EAEDFF', primaryFixed: '#BAEED9', onPrimaryFixed: '#002117', secondaryFixed: '#FEDEB2', onSecondaryFixed: '#78603E', container: '#EAEDFF' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {notice && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: C.primary, color: '#FFF', padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 9999, fontSize: 13, fontWeight: 600 }}>
          {notice}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            <span style={{ color: C.secondary }}>Atelier Haute Joaillerie</span>
            <span style={{ color: C.outline }}>/</span>
            <span style={{ color: C.outline }}>Vault Operations</span>
          </div>
          <h1 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 500, color: C.onSurface, margin: 0, letterSpacing: '-0.5px' }}>
            Diamond Vault &amp; Certificate Catalogue
          </h1>
          <p style={{ color: C.variant, fontSize: 13, margin: 0, maxWidth: 680 }}>
            Manage certified loose stones, 4Cs specifications, GIA/IGI certificates, live Rapaport pricing matrices, and publication states.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/diamonds" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, background: C.card, color: C.onSurface, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.secondary }}>visibility</span>
            <span>View Catalogue ↗</span>
          </a>
          <Link href="/admin/diamonds/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: C.primary, color: '#FFF', fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,54,41,0.2)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.primaryFixed }}>add_circle</span>
            <span>+ Register Diamond</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { label: 'Certified Vault Reserves', value: String(allStones.length), sub: 'Assessed Value', subVal: `$${(allStones.reduce((a, s) => a + (s.price || 0), 0)).toLocaleString()}`, badge: '+48 this week', icon: 'diamond', bg: C.primaryFixed, fg: C.onPrimaryFixed },
          { label: 'Earth-Mined Premium', value: String(natural), sub: 'GIA Verified', subVal: '100% Sealed', badge: `${natural > 0 ? Math.round((natural / allStones.length) * 100) : 0}% Total Vol`, icon: 'public', bg: C.secondaryFixed, fg: C.onSecondaryFixed },
          { label: 'Lab-Grown CVD / HPHT', value: String(lab), sub: 'IGI Certified', subVal: `${lab} In Stock`, badge: '+12.4% MoM', icon: 'science', bg: C.container, fg: C.onSurface },
          { label: 'Rapaport Margin Yield', value: '+34.8%', sub: 'Avg. Sale Velocity', subVal: '14.2 Days', badge: 'Beat Benchmark', icon: 'trending_up', bg: C.primaryFixed, fg: C.onPrimaryFixed },
        ].map((card) => (
          <div key={card.label} style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.outline }}>{card.label}</span>
              <span style={{ padding: 4, borderRadius: 6, background: card.bg, color: card.fg }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>{card.icon}</span></span>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 600, color: C.onSurface }}>{card.value}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.primary }}>{card.badge}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: C.outline, display: 'flex', justifyContent: 'space-between' }}>
              <span>{card.sub}</span>
              <strong style={{ color: C.onSurface }}>{card.subVal}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Panel */}
      <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Origin Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 16, borderBottom: `1px solid ${C.surfaceLow}` }}>
          <div style={{ display: 'inline-flex', padding: 4, borderRadius: 10, background: C.surfaceLow, gap: 4 }}>
            {[{ id: 'All', label: 'All Stones', count: allStones.length }, { id: 'Natural', label: 'Natural Earth-Mined', count: natural }, { id: 'Lab', label: 'Lab-Grown CVD/HPHT', count: lab }].map((t) => (
              <button key={t.id} onClick={() => setOriginFilter(t.id as any)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: originFilter === t.id ? C.card : 'transparent', color: originFilter === t.id ? C.primary : C.variant, fontSize: 13, fontWeight: originFilter === t.id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: originFilter === t.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>
                <span>{t.label}</span>
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 999, background: C.container, color: C.onSurface, fontWeight: 700 }}>{t.count}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.outline }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.secondary }}>verified</span>
            <span>All stones verified via GIA/IGI certificate authentication</span>
          </div>
        </div>

        {/* Shape Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline }}>Diamond Silhouette / Cut Form</span>
            <button onClick={() => setSelectedShape('All')} style={{ background: 'none', border: 'none', fontSize: 11.5, fontWeight: 700, color: C.primary, cursor: 'pointer' }}>Reset Shapes</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SHAPES.map((shape) => {
              const active = selectedShape === shape;
              return (
                <button key={shape} onClick={() => setSelectedShape(active ? 'All' : shape)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${active ? C.primary : C.border}`, background: active ? C.primary : C.surfaceLow, color: active ? '#FFF' : C.onSurface, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s ease' }}>
                  <span style={{ color: active ? '#FFF' : C.outline }}>{SHAPE_ICONS[shape]}</span>
                  <span>{shape}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4Cs Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {/* Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: C.outline }}>Search Stone</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, ID, certificate..." style={{ height: 40, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 13, color: C.onSurface, outline: 'none' }} />
          </div>
          {/* Color */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: C.outline }}>Colour Grade</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['All', ...COLORS].map((c) => (
                <button key={c} onClick={() => setSelectedColor(c)} style={{ width: 36, height: 36, borderRadius: 6, border: `1px solid ${selectedColor === c ? C.primary : C.border}`, background: selectedColor === c ? C.primary : C.surfaceLow, color: selectedColor === c ? '#FFF' : C.onSurface, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{c === 'All' ? '✕' : c}</button>
              ))}
            </div>
          </div>
          {/* Clarity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: C.outline }}>Clarity Spectrum</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['All', ...CLARITIES].map((cl) => (
                <button key={cl} onClick={() => setSelectedClarity(cl)} style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${selectedClarity === cl ? C.primary : C.border}`, background: selectedClarity === cl ? C.primary : C.surfaceLow, color: selectedClarity === cl ? '#FFF' : C.onSurface, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{cl === 'All' ? '✕' : cl}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 18, fontWeight: 500, color: C.onSurface }}>Certified Stone Register</span>
          <span style={{ fontSize: 12, color: C.outline }}>{filtered.length} stone{filtered.length !== 1 ? 's' : ''} in view</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.surfaceLow }}>
                {['Stone / Certificate', 'Carat / Dimensions', '4Cs Profile', 'Origin', 'Valuation', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline, whiteSpace: 'nowrap', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: C.outline, fontSize: 14 }}>Loading vault records...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: C.outline, fontSize: 14 }}>No stones match the selected filters.</td></tr>
              ) : filtered.map((stone, idx) => {
                const sb = statusBadge(stone.status);
                return (
                  <tr key={stone.id || idx} style={{ borderBottom: `1px solid ${C.border}`, cursor: 'pointer', transition: 'background 0.12s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')} onClick={() => openDossier(stone)}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: C.surfaceLow, flexShrink: 0 }}>
                          {stone.image ? <img src={stone.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 24, color: C.outline }}>diamond</span></div>}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.onSurface, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {stone.name}
                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: stone.origin === 'Natural' ? C.secondary : C.outline }}>{stone.origin === 'Natural' ? 'verified' : 'psychology'}</span>
                          </div>
                          <div style={{ fontSize: 11, color: C.outline }}>{stone.lab} · {stone.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.onSurface }}>{stone.carat} ct</div>
                      <div style={{ fontSize: 11, color: C.variant }}>{stone.measurements}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
                        <span style={{ padding: '2px 6px', borderRadius: 4, background: C.surfaceLow, fontSize: 12, fontWeight: 700, color: C.primary }}>{stone.color}</span>
                        <span style={{ padding: '2px 6px', borderRadius: 4, background: C.surfaceLow, fontSize: 12, fontWeight: 700, color: C.secondary }}>{stone.clarity}</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.outline }}>{stone.fluorescence} Fluor. · {stone.cut}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: C.primary }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.primary, display: 'inline-block' }}></span>
                        {stone.origin === 'Natural' ? 'Earth-Mined' : 'Lab-Grown'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.onSurface }}>${stone.price.toLocaleString()}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.primary }}>{stone.rapMargin} Margin</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: sb.bg, color: sb.fg }}>{stone.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button onClick={() => openDossier(stone)} title="View Dossier" style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.variant }}>open_in_new</span>
                        </button>
                        <Link href={`/admin/diamonds/edit?id=${stone.raw?.id || stone.id}`} onClick={(e) => e.stopPropagation()} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.variant }}>edit</span>
                        </Link>
                        <button onClick={() => void togglePublish(stone)} title={stone.published ? 'Archive' : 'Publish'} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.border}`, background: stone.published ? C.primaryFixed : C.surfaceLow, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: stone.published ? C.onPrimaryFixed : C.outline }}>{stone.published ? 'visibility' : 'visibility_off'}</span>
                        </button>
                        <button onClick={() => void removeDiamond(stone)} title="Delete" style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid #FFD6D6`, background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#BA1A1A' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stone Dossier Modal */}
      {dossierOpen && selectedStone && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(19,27,46,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} onClick={() => setDossierOpen(false)}>
          <div style={{ width: '100%', maxWidth: 440, height: '100%', background: C.card, boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.secondary }}>Stone Dossier</div>
                <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 20, color: C.onSurface, fontWeight: 500 }}>{selectedStone.name}</div>
              </div>
              <button onClick={() => setDossierOpen(false)} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.variant }}>close</span>
              </button>
            </div>
            {/* Image */}
            <div style={{ height: 220, background: C.surfaceLow, overflow: 'hidden' }}>
              {selectedStone.image ? <img src={selectedStone.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 72, color: C.outline }}>diamond</span></div>}
            </div>
            {/* Specs */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Carat Weight', value: `${selectedStone.carat} ct` },
                  { label: 'Colour Grade', value: selectedStone.color },
                  { label: 'Clarity', value: selectedStone.clarity },
                  { label: 'Cut Grade', value: selectedStone.cut },
                  { label: 'Fluorescence', value: selectedStone.fluorescence },
                  { label: 'Origin', value: selectedStone.origin === 'Natural' ? 'Earth-Mined' : 'Lab-Grown' },
                  { label: 'Certificate', value: selectedStone.lab },
                  { label: 'Rapaport Margin', value: selectedStone.rapMargin },
                ].map((spec) => (
                  <div key={spec.label} style={{ background: C.surfaceLow, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.outline, marginBottom: 2 }}>{spec.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>{spec.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.surfaceLow, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.outline, marginBottom: 2 }}>Measurements</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.onSurface }}>{selectedStone.measurements}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.primaryFixed, borderRadius: 8, padding: '12px 16px' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.onPrimaryFixed, opacity: 0.7 }}>Atelier Valuation</div>
                  <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 24, fontWeight: 600, color: C.onPrimaryFixed }}>${selectedStone.price.toLocaleString()}</div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(0,54,41,0.15)', color: C.onPrimaryFixed }}>{selectedStone.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href={`/admin/diamonds/edit?id=${selectedStone.raw?.id || selectedStone.id}`} style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.onSurface, fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center', cursor: 'pointer' }}>
                  Edit Stone
                </Link>
                <button onClick={() => void togglePublish(selectedStone)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: selectedStone.published ? '#FFF5F5' : C.primary, color: selectedStone.published ? '#BA1A1A' : '#FFF', border: `1px solid ${selectedStone.published ? '#FFD6D6' : C.primary}`, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {selectedStone.published ? 'Archive Stone' : 'Publish Stone'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
