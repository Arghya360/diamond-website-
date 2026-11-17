'use client';
import { useState, useMemo } from 'react';

// ── Complete Diamonds Catalog ─────────────────────────────────────
const DIAMONDS_CATALOG = [
  // ── Row 1 (Round) ──
  {
    id: 'rd-1',
    shape: 'Round',
    carat: 1.02,
    cut: 'Super Ideal',
    color: 'D',
    clarity: 'VVS2',
    price: 5040,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: false,
    popularRank: 1,
    img: '/wp-content/uploads/diamond/download.jpg',
  },
  {
    id: 'rd-2',
    shape: 'Round',
    carat: 1.01,
    cut: 'Super Ideal',
    color: 'F',
    clarity: 'VS2',
    price: 3610,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: false,
    popularRank: 2,
    img: '/wp-content/uploads/diamond/download%20(1).jpg',
  },
  {
    id: 'rd-3',
    shape: 'Round',
    carat: 1.50,
    cut: 'Very Good',
    color: 'H',
    clarity: 'VS2',
    price: 13370,
    origin: 'Natural',
    colour: 'white',
    quickShip: false,
    bestValue: false,
    goingFast: false,
    popularRank: 3,
    img: '/wp-content/uploads/diamond/download%20(11).jpg',
  },

  // ── Row 2 (Oval) ──
  {
    id: 'ov-1',
    shape: 'Oval',
    carat: 1.50,
    cut: 'Super Ideal',
    color: 'G',
    clarity: 'VS1',
    price: 8130,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: true,
    goingFast: false,
    popularRank: 4,
    img: '/wp-content/uploads/diamond/download%20(2).jpg',
  },
  {
    id: 'ov-2',
    shape: 'Oval',
    carat: 1.50,
    cut: 'Ideal',
    color: 'F',
    clarity: 'VS2',
    price: 10600,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: false,
    popularRank: 5,
    img: '/wp-content/uploads/diamond/download%20(6).jpg',
  },
  {
    id: 'ov-3',
    shape: 'Oval',
    carat: 1.00,
    cut: 'Ideal',
    color: 'D',
    clarity: 'VVS1',
    price: 4440,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: false,
    popularRank: 6,
    img: '/wp-content/uploads/diamond/download%20(7).jpg',
  },

  // ── Row 3 (Emerald) ──
  {
    id: 'em-1',
    shape: 'Emerald',
    carat: 1.50,
    cut: 'Super Ideal',
    color: 'H',
    clarity: 'VS2',
    price: 5340,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: true,
    goingFast: false,
    popularRank: 7,
    img: '/wp-content/uploads/diamond/download%20(8).jpg',
  },
  {
    id: 'em-2',
    shape: 'Emerald',
    carat: 1.55,
    cut: 'Super Ideal',
    color: 'H',
    clarity: 'VVS1',
    price: 7970,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: false,
    popularRank: 8,
    img: '/wp-content/uploads/diamond/download%20(5).jpg',
  },
  {
    id: 'em-3',
    shape: 'Emerald',
    carat: 1.02,
    cut: 'Super Ideal',
    color: 'F',
    clarity: 'VVS2',
    price: 3130,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: true,
    popularRank: 9,
    img: '/wp-content/uploads/diamond/download%20(10).jpg',
  },

  // ── Asscher Diamond ──
  {
    id: 'ass-1',
    shape: 'Asscher',
    carat: 1.52,
    cut: 'Ideal',
    color: 'D',
    clarity: 'IF',
    price: 9400,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: false,
    popularRank: 10,
    img: '/wp-content/uploads/diamond/download%20(3).jpg',
  },

  // ── Additional shapes & stones for filtering ──
  {
    id: 'mar-1',
    shape: 'Marquise',
    carat: 1.20,
    cut: 'Ideal',
    color: 'E',
    clarity: 'VS1',
    price: 4890,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: true,
    goingFast: false,
    popularRank: 11,
    img: '/wp-content/uploads/diamond/download%20(4).jpg',
  },
  {
    id: 'cush-1',
    shape: 'Cushion',
    carat: 1.70,
    cut: 'Super Ideal',
    color: 'G',
    clarity: 'VVS2',
    price: 6420,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: true,
    popularRank: 12,
    img: '/wp-content/uploads/diamond/download%20(7).jpg',
  },
  {
    id: 'prin-1',
    shape: 'Princess',
    carat: 1.35,
    cut: 'Ideal',
    color: 'D',
    clarity: 'VS2',
    price: 4150,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: true,
    goingFast: false,
    popularRank: 13,
    img: '/wp-content/uploads/diamond/download%20(3).jpg',
  },
  {
    id: 'pear-1',
    shape: 'Pear',
    carat: 1.25,
    cut: 'Super Ideal',
    color: 'F',
    clarity: 'VVS1',
    price: 5200,
    origin: 'Natural',
    colour: 'white',
    quickShip: false,
    bestValue: false,
    goingFast: false,
    popularRank: 14,
    img: '/wp-content/uploads/diamond/download%20(9).jpg',
  },
  {
    id: 'rad-1',
    shape: 'Radiant',
    carat: 2.01,
    cut: 'Super Ideal',
    color: 'E',
    clarity: 'VVS2',
    price: 8900,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: true,
    goingFast: false,
    popularRank: 15,
    img: '/wp-content/uploads/diamond/download%20(8).jpg',
  },
  {
    id: 'hrt-1',
    shape: 'Heart',
    carat: 1.10,
    cut: 'Very Good',
    color: 'F',
    clarity: 'VS1',
    price: 4750,
    origin: 'Natural',
    colour: 'white',
    quickShip: true,
    bestValue: false,
    goingFast: true,
    popularRank: 16,
    img: '/wp-content/uploads/diamond/download%20(10).jpg',
  },

  // ── Pink Lab-Grown Diamonds ──
  {
    id: 'pnk-1',
    shape: 'Round',
    carat: 1.05,
    cut: 'Super Ideal',
    color: 'Pink',
    clarity: 'VVS2',
    price: 5800,
    origin: 'Lab Grown',
    colour: 'pink',
    quickShip: true,
    bestValue: true,
    goingFast: false,
    popularRank: 17,
    img: '/wp-content/uploads/diamond/download%20(1).jpg',
  },
  {
    id: 'pnk-2',
    shape: 'Oval',
    carat: 1.45,
    cut: 'Ideal',
    color: 'Pink',
    clarity: 'VS1',
    price: 7200,
    origin: 'Lab Grown',
    colour: 'pink',
    quickShip: true,
    bestValue: false,
    goingFast: true,
    popularRank: 18,
    img: '/wp-content/uploads/diamond/download%20(6).jpg',
  },
  {
    id: 'pnk-3',
    shape: 'Emerald',
    carat: 1.20,
    cut: 'Super Ideal',
    color: 'Pink',
    clarity: 'VVS1',
    price: 6100,
    origin: 'Lab Grown',
    colour: 'pink',
    quickShip: false,
    bestValue: false,
    goingFast: false,
    popularRank: 19,
    img: '/wp-content/uploads/diamond/download%20(5).jpg',
  },
];

// ── Shape Options ──
const SHAPES_DATA = [
  { id: 'Oval', label: 'Oval', icon: '/wp-content/uploads/Diamond Shape/oval_new.webp' },
  { id: 'Round', label: 'Round', icon: '/wp-content/uploads/Diamond Shape/round_new.webp' },
  { id: 'Marquise', label: 'Marquise', icon: '/wp-content/uploads/Diamond Shape/marquise_new.webp' },
  { id: 'Emerald', label: 'Emerald', icon: '/wp-content/uploads/Diamond Shape/emerald_new.webp' },
  { id: 'Elongated Cushion', label: 'Elongated Cushion', icon: '/wp-content/uploads/Diamond Shape/elongated_cushion.webp' },
  { id: 'Cushion', label: 'Cushion', icon: '/wp-content/uploads/Diamond Shape/cushion_new.webp' },
  { id: 'Old Mine', label: 'Old Mine', icon: '/wp-content/uploads/Diamond Shape/old_mine_new.webp' },
  { id: 'Pear', label: 'Pear', icon: '/wp-content/uploads/Diamond Shape/pear_new.webp' },
  { id: 'Radiant', label: 'Radiant', icon: '/wp-content/uploads/Diamond Shape/radiant_new.webp' },
  { id: 'Princess', label: 'Princess', icon: '/wp-content/uploads/Diamond Shape/princess_new.webp' },
  { id: 'Asscher', label: 'Asscher', icon: '/wp-content/uploads/Diamond Shape/asscher_new.webp' },
  { id: 'Heart', label: 'Heart', icon: '/wp-content/uploads/Diamond Shape/heart_new.webp' },
];

const CUT_STEPS = ['Fair', 'Good', 'Very Good', 'Ideal', 'Super Ideal'];
const COLOR_STEPS = ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'];
const CLARITY_STEPS = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];

export default function DiamondGrid({ prefilterColour }) {
  // ── Filter State ──
  const [origin, setOrigin] = useState('Natural'); // Default active 'Natural Diamonds' like in the screenshot
  const [selectedShape, setSelectedShape] = useState('All');
  const [caratMin, setCaratMin] = useState(0.25);
  const [caratMax, setCaratMax] = useState(25.17);
  const [priceMin, setPriceMin] = useState(180);
  const [priceMax, setPriceMax] = useState(2353410);
  const [lookingFor, setLookingFor] = useState(null); // 'sparkle', 'balance', 'quality'
  const [cutMinIdx, setCutMinIdx] = useState(0);
  const [cutMaxIdx, setCutMaxIdx] = useState(4);
  const [colorMinIdx, setColorMinIdx] = useState(0);
  const [colorMaxIdx, setColorMaxIdx] = useState(9);
  const [clarityMinIdx, setClarityMinIdx] = useState(0);
  const [clarityMaxIdx, setClarityMaxIdx] = useState(7);

  // ── UI Controls State ──
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'list'
  const [quickShipOnly, setQuickShipOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'compare'
  const [wishlist, setWishlist] = useState({});
  const [compareList, setCompareList] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Accordion Collapsible State ──
  const [openSections, setOpenSections] = useState({
    origin: true,
    shape: true,
    carat: true,
    price: true,
    lookingFor: true,
    cut: true,
    color: true,
    clarity: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCompare = (id) => {
    setCompareList((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  const compareCount = Object.keys(compareList).length;

  // ── Filter & Sort Logic ──
  const filtered = useMemo(() => {
    let list = DIAMONDS_CATALOG.filter((d) => {
      // prefilterColour check
      if (prefilterColour && d.colour !== prefilterColour) return false;

      // Origin check: if user picks 'Natural' or 'Lab Grown', filter accordingly
      // (Unless prefilterColour is set, which is for lab grown diamonds)
      if (!prefilterColour && origin !== 'All' && d.origin !== origin) {
        // If 'Natural' is selected, show natural stones (or all if user wants)
        return false;
      }

      // Shape check
      if (selectedShape !== 'All') {
        if (selectedShape === 'Elongated Cushion' && d.shape !== 'Elongated Cushion' && d.shape !== 'Cushion') return false;
        if (selectedShape !== 'Elongated Cushion' && d.shape !== selectedShape) return false;
      }

      // Quick ship toggle
      if (quickShipOnly && !d.quickShip) return false;

      // Carat range
      if (d.carat < caratMin || d.carat > caratMax) return false;

      // Price range
      if (d.price < priceMin || d.price > priceMax) return false;

      // Looking For presets
      if (lookingFor === 'sparkle' && d.cut !== 'Super Ideal' && d.cut !== 'Ideal') return false;
      if (lookingFor === 'quality' && !['D', 'E', 'F'].includes(d.color)) return false;
      if (lookingFor === 'balance' && !['Very Good', 'Ideal', 'Super Ideal'].includes(d.cut)) return false;

      // Stepped filters
      const cIdx = CUT_STEPS.indexOf(d.cut);
      if (cIdx !== -1 && (cIdx < cutMinIdx || cIdx > cutMaxIdx)) return false;

      const colIdx = COLOR_STEPS.indexOf(d.color);
      if (colIdx !== -1 && (colIdx < colorMinIdx || colIdx > colorMaxIdx)) return false;

      const clrIdx = CLARITY_STEPS.indexOf(d.clarity);
      if (clrIdx !== -1 && (clrIdx < clarityMinIdx || clrIdx > clarityMaxIdx)) return false;

      // Compare tab
      if (activeTab === 'compare' && !compareList[d.id]) return false;

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'carat-low') return a.carat - b.carat;
      if (sortBy === 'carat-high') return b.carat - a.carat;
      return a.popularRank - b.popularRank; // default 'popular'
    });

    return list;
  }, [
    prefilterColour,
    origin,
    selectedShape,
    quickShipOnly,
    caratMin,
    caratMax,
    priceMin,
    priceMax,
    lookingFor,
    cutMinIdx,
    cutMaxIdx,
    colorMinIdx,
    colorMaxIdx,
    clarityMinIdx,
    clarityMaxIdx,
    activeTab,
    compareList,
    sortBy,
  ]);

  const resetFilters = () => {
    setOrigin('All');
    setSelectedShape('All');
    setCaratMin(0.25);
    setCaratMax(25.17);
    setPriceMin(180);
    setPriceMax(2353410);
    setLookingFor(null);
    setCutMinIdx(0);
    setCutMaxIdx(4);
    setColorMinIdx(0);
    setColorMaxIdx(9);
    setClarityMinIdx(0);
    setClarityMaxIdx(7);
    setQuickShipOnly(false);
  };

  const teal = '#0b4d45';
  const tealLight = '#e6f0ee';

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '40px 0 90px' }}>
      <style>{`
        @media (max-width: 768px) {
          .dg-layout { flex-direction: column !important; }
          .dg-sidebar {
            position: fixed !important;
            top: 0; left: 0;
            width: 85vw; max-width: 320px;
            height: 100vh; overflow-y: auto;
            background: #fff; z-index: 9999;
            padding: 20px !important;
            box-shadow: 4px 0 20px rgba(0,0,0,0.15);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            border-right: none !important;
          }
          .dg-sidebar.open { transform: translateX(0); }
          .dg-sidebar-overlay { display: block !important; }
          .dg-filter-btn { display: flex !important; }
          .dg-sidebar-close { display: flex !important; }
          .dg-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important; gap: 12px !important; }
          .dg-topbar { flex-wrap: wrap; gap: 10px; }
        }
        @media (min-width: 769px) {
          .dg-sidebar { width: 290px !important; }
        }
        /* ── Range Slider Styling ── */
        .dg-range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: transparent; outline: none; cursor: pointer; position: absolute; top: 0; left: 0; pointer-events: none; }
        .dg-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #0b4d45; cursor: pointer; pointer-events: all; box-shadow: 0 1px 4px rgba(0,0,0,0.3); border: 2px solid #fff; }
        .dg-range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #0b4d45; cursor: pointer; pointer-events: all; box-shadow: 0 1px 4px rgba(0,0,0,0.3); border: 2px solid #fff; }
        .dg-range-wrap { position: relative; height: 18px; margin: 10px 4px 20px; }
        .dg-range-track { position: absolute; top: 7px; left: 0; right: 0; height: 4px; background: #e5e7eb; border-radius: 2px; }
        .dg-range-fill { position: absolute; top: 7px; height: 4px; background: #0b4d45; border-radius: 2px; }
        .dg-step-labels { display: flex; justify-content: space-between; padding: 0 2px; margin-top: 4px; }
        .dg-step-label { font-size: 10px; color: #6b7280; cursor: pointer; text-align: center; padding: 2px 0; border-radius: 3px; transition: color 0.15s; }
        .dg-step-label:hover { color: #0b4d45; font-weight: 700; }
        .dg-step-label.active { color: #0b4d45; font-weight: 700; }
      `}</style>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Outer 2-Column Layout ── */}
        <div className="dg-layout" style={{ display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'flex-start' }}>

          {/* ══════════════════════════════════════════════════════════
              LEFT SIDEBAR: FILTERS
          ══════════════════════════════════════════════════════════ */}
          {/* Mobile overlay backdrop */}
          <div
            className="dg-sidebar-overlay"
            onClick={() => setFiltersOpen(false)}
            style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9998 }}
          />
          <aside
            className={`dg-sidebar${filtersOpen ? ' open' : ''}`}
            style={{
              width: '290px',
              flexShrink: 0,
              borderRight: '1px solid #eaeaea',
              paddingRight: '24px',
              paddingTop: '6px',
            }}
          >
            {/* Mobile close button */}
            <button
              className="dg-sidebar-close"
              onClick={() => setFiltersOpen(false)}
              style={{
                display: 'none',
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '16px',
                padding: '8px 0',
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              ✕ Close Filters
            </button>
            {/* 1. Diamond Origin */}
            <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('origin')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Diamond Origin</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.origin ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.origin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setOrigin(origin === 'Natural' ? 'All' : 'Natural')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '24px',
                      cursor: 'pointer',
                      border: origin === 'Natural' ? `1px solid ${teal}` : '1px solid #d1d5db',
                      backgroundColor: origin === 'Natural' ? teal : '#ffffff',
                      color: origin === 'Natural' ? '#ffffff' : '#374151',
                      transition: 'all 0.2s',
                    }}
                  >
                    Natural Diamonds
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrigin(origin === 'Lab Grown' ? 'All' : 'Lab Grown')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '24px',
                      cursor: 'pointer',
                      border: origin === 'Lab Grown' ? `1px solid ${teal}` : '1px solid #d1d5db',
                      backgroundColor: origin === 'Lab Grown' ? teal : '#ffffff',
                      color: origin === 'Lab Grown' ? '#ffffff' : '#374151',
                      transition: 'all 0.2s',
                    }}
                  >
                    Lab Grown Diamonds
                  </button>
                </div>
              )}
            </div>

            {/* 2. Diamond Shape */}
            <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('shape')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Diamond Shape</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.shape ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.shape && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px 6px',
                  }}
                >
                  {SHAPES_DATA.map((s) => {
                    const isSelected = selectedShape === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedShape(isSelected ? 'All' : s.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px 2px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          outline: isSelected ? `2px solid ${teal}` : 'none',
                          backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                        }}
                      >
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '4px',
                          }}
                        >
                          <img
                            src={s.icon}
                            alt=""
                            style={{
                              maxWidth: '36px',
                              maxHeight: '36px',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            lineHeight: 1.2,
                            color: isSelected ? teal : '#4b5563',
                            fontWeight: isSelected ? 700 : 500,
                            textAlign: 'center',
                          }}
                        >
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Carat Slider */}
            <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('carat')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Carat</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>ⓘ</span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.carat ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.carat && (() => {
                const CARAT_MIN_BOUND = 0.25;
                const CARAT_MAX_BOUND = 25.17;
                const leftPct = ((caratMin - CARAT_MIN_BOUND) / (CARAT_MAX_BOUND - CARAT_MIN_BOUND)) * 100;
                const rightPct = ((caratMax - CARAT_MIN_BOUND) / (CARAT_MAX_BOUND - CARAT_MIN_BOUND)) * 100;
                return (
                  <div>
                    <div className="dg-range-wrap">
                      <div className="dg-range-track" />
                      <div className="dg-range-fill" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
                      <input
                        type="range" className="dg-range"
                        min={CARAT_MIN_BOUND} max={CARAT_MAX_BOUND} step={0.05}
                        value={caratMin}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v < caratMax) setCaratMin(v);
                        }}
                      />
                      <input
                        type="range" className="dg-range"
                        min={CARAT_MIN_BOUND} max={CARAT_MAX_BOUND} step={0.05}
                        value={caratMax}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v > caratMin) setCaratMax(v);
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <input
                        type="number" step="0.05" min={CARAT_MIN_BOUND} max={caratMax}
                        value={caratMin}
                        onChange={(e) => { const v = Number(e.target.value); if (v >= CARAT_MIN_BOUND && v < caratMax) setCaratMin(v); }}
                        style={sliderInputStyle}
                      />
                      <input
                        type="number" step="0.05" min={caratMin} max={CARAT_MAX_BOUND}
                        value={caratMax}
                        onChange={(e) => { const v = Number(e.target.value); if (v <= CARAT_MAX_BOUND && v > caratMin) setCaratMax(v); }}
                        style={sliderInputStyle}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 4. Diamond Price Slider */}
            <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('price')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Diamond Price</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>ⓘ</span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.price ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.price && (() => {
                const PRICE_MIN_BOUND = 180;
                const PRICE_MAX_BOUND = 2353410;
                const leftPct = ((priceMin - PRICE_MIN_BOUND) / (PRICE_MAX_BOUND - PRICE_MIN_BOUND)) * 100;
                const rightPct = ((priceMax - PRICE_MIN_BOUND) / (PRICE_MAX_BOUND - PRICE_MIN_BOUND)) * 100;
                return (
                  <div>
                    <div className="dg-range-wrap">
                      <div className="dg-range-track" />
                      <div className="dg-range-fill" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
                      <input
                        type="range" className="dg-range"
                        min={PRICE_MIN_BOUND} max={PRICE_MAX_BOUND} step={100}
                        value={priceMin}
                        onChange={(e) => { const v = Number(e.target.value); if (v < priceMax) setPriceMin(v); }}
                      />
                      <input
                        type="range" className="dg-range"
                        min={PRICE_MIN_BOUND} max={PRICE_MAX_BOUND} step={100}
                        value={priceMax}
                        onChange={(e) => { const v = Number(e.target.value); if (v > priceMin) setPriceMax(v); }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <input
                        type="text"
                        value={`$${priceMin.toLocaleString()}`}
                        onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 180; if (v < priceMax) setPriceMin(v); }}
                        style={sliderInputStyle}
                      />
                      <input
                        type="text"
                        value={`$${priceMax.toLocaleString()}`}
                        onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 2353410; if (v > priceMin) setPriceMax(v); }}
                        style={sliderInputStyle}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 5. What are you looking for? */}
            <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('lookingFor')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>What are you looking for?</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>ⓘ</span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.lookingFor ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.lookingFor && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'sparkle', label: 'Most Sparkle' },
                    { id: 'balance', label: 'Best Balance' },
                    { id: 'quality', label: 'Top Quality' },
                  ].map((p) => {
                    const active = lookingFor === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setLookingFor(active ? null : p.id)}
                        style={{
                          flex: 1,
                          padding: '7px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          border: active ? `1px solid ${teal}` : '1px solid #d1d5db',
                          backgroundColor: active ? tealLight : '#ffffff',
                          color: active ? teal : '#374151',
                          transition: 'all 0.2s',
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 6. Cut Stepped Slider */}
            <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('cut')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Cut</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>ⓘ</span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.cut ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.cut && (() => {
                const steps = CUT_STEPS;
                const leftPct = (cutMinIdx / (steps.length - 1)) * 100;
                const rightPct = (cutMaxIdx / (steps.length - 1)) * 100;
                return (
                  <div>
                    <div className="dg-range-wrap">
                      <div className="dg-range-track" />
                      <div className="dg-range-fill" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
                      <input
                        type="range" className="dg-range"
                        min={0} max={steps.length - 1} step={1}
                        value={cutMinIdx}
                        onChange={(e) => { const v = Number(e.target.value); if (v <= cutMaxIdx) setCutMinIdx(v); }}
                      />
                      <input
                        type="range" className="dg-range"
                        min={0} max={steps.length - 1} step={1}
                        value={cutMaxIdx}
                        onChange={(e) => { const v = Number(e.target.value); if (v >= cutMinIdx) setCutMaxIdx(v); }}
                      />
                    </div>
                    <div className="dg-step-labels">
                      {steps.map((step, idx) => (
                        <span
                          key={step}
                          className={`dg-step-label${idx >= cutMinIdx && idx <= cutMaxIdx ? ' active' : ''}`}
                          onClick={() => {
                            if (idx < cutMinIdx) setCutMinIdx(idx);
                            else if (idx > cutMaxIdx) setCutMaxIdx(idx);
                            else if (idx === cutMinIdx && idx < cutMaxIdx) setCutMinIdx(idx + 1);
                            else setCutMaxIdx(idx - 1);
                          }}
                        >{step}</span>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: teal, fontWeight: 600 }}>
                      {steps[cutMinIdx]}{cutMinIdx !== cutMaxIdx ? ` → ${steps[cutMaxIdx]}` : ''}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 7. Color Stepped Slider */}
            <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('color')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Color</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>ⓘ</span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.color ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.color && (() => {
                const steps = COLOR_STEPS;
                const leftPct = (colorMinIdx / (steps.length - 1)) * 100;
                const rightPct = (colorMaxIdx / (steps.length - 1)) * 100;
                return (
                  <div>
                    <div className="dg-range-wrap">
                      <div className="dg-range-track" />
                      <div className="dg-range-fill" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
                      <input
                        type="range" className="dg-range"
                        min={0} max={steps.length - 1} step={1}
                        value={colorMinIdx}
                        onChange={(e) => { const v = Number(e.target.value); if (v <= colorMaxIdx) setColorMinIdx(v); }}
                      />
                      <input
                        type="range" className="dg-range"
                        min={0} max={steps.length - 1} step={1}
                        value={colorMaxIdx}
                        onChange={(e) => { const v = Number(e.target.value); if (v >= colorMinIdx) setColorMaxIdx(v); }}
                      />
                    </div>
                    <div className="dg-step-labels">
                      {steps.map((col, idx) => (
                        <span
                          key={col}
                          className={`dg-step-label${idx >= colorMinIdx && idx <= colorMaxIdx ? ' active' : ''}`}
                          onClick={() => {
                            if (idx < colorMinIdx) setColorMinIdx(idx);
                            else if (idx > colorMaxIdx) setColorMaxIdx(idx);
                          }}
                        >{col}</span>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: teal, fontWeight: 600 }}>
                      {steps[colorMinIdx]}{colorMinIdx !== colorMaxIdx ? ` → ${steps[colorMaxIdx]}` : ''}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 8. Clarity Stepped Slider */}
            <div style={{ paddingBottom: '20px', marginBottom: '20px' }}>
              <div
                onClick={() => toggleSection('clarity')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Clarity</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>ⓘ</span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {openSections.clarity ? '⌃' : '⌄'}
                </span>
              </div>
              {openSections.clarity && (() => {
                const steps = CLARITY_STEPS;
                const leftPct = (clarityMinIdx / (steps.length - 1)) * 100;
                const rightPct = (clarityMaxIdx / (steps.length - 1)) * 100;
                return (
                  <div>
                    <div className="dg-range-wrap">
                      <div className="dg-range-track" />
                      <div className="dg-range-fill" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
                      <input
                        type="range" className="dg-range"
                        min={0} max={steps.length - 1} step={1}
                        value={clarityMinIdx}
                        onChange={(e) => { const v = Number(e.target.value); if (v <= clarityMaxIdx) setClarityMinIdx(v); }}
                      />
                      <input
                        type="range" className="dg-range"
                        min={0} max={steps.length - 1} step={1}
                        value={clarityMaxIdx}
                        onChange={(e) => { const v = Number(e.target.value); if (v >= clarityMinIdx) setClarityMaxIdx(v); }}
                      />
                    </div>
                    <div className="dg-step-labels">
                      {steps.map((clr, idx) => (
                        <span
                          key={clr}
                          className={`dg-step-label${idx >= clarityMinIdx && idx <= clarityMaxIdx ? ' active' : ''}`}
                          onClick={() => {
                            if (idx < clarityMinIdx) setClarityMinIdx(idx);
                            else if (idx > clarityMaxIdx) setClarityMaxIdx(idx);
                          }}
                        >{clr}</span>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: teal, fontWeight: 600 }}>
                      {steps[clarityMinIdx]}{clarityMinIdx !== clarityMaxIdx ? ` → ${steps[clarityMaxIdx]}` : ''}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Reset Filters Link */}
            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: teal,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════
              RIGHT MAIN AREA: TOP BAR, TABS, PRODUCT GRID
          ══════════════════════════════════════════════════════════ */}
          <main style={{ flex: 1, minWidth: 0 }}>

            {/* Mobile: Show Filters button */}
            <button
              className="dg-filter-btn"
              onClick={() => setFiltersOpen(true)}
              style={{
                display: 'none',
                marginBottom: '12px',
                padding: '10px 20px',
                backgroundColor: '#0b4d45',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ☰ Filters
            </button>

            {/* ── Top Bar: Visual/List, Quick Ship, Sort By ── */}
            <div
              className="dg-topbar"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              {/* Left: View Toggle */}
              <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #d1d5db' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('visual')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: viewMode === 'visual' ? '#f3f4f6' : '#ffffff',
                    color: viewMode === 'visual' ? teal : '#6b7280',
                    borderRight: '1px solid #d1d5db',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill={viewMode === 'visual' ? teal : 'currentColor'}>
                    <rect x="1" y="1" width="6" height="6" rx="1" />
                    <rect x="9" y="1" width="6" height="6" rx="1" />
                    <rect x="1" y="9" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                  </svg>
                  Visual
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? '#f3f4f6' : '#ffffff',
                    color: viewMode === 'list' ? teal : '#6b7280',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill={viewMode === 'list' ? teal : 'currentColor'}>
                    <rect x="2" y="2" width="12" height="2.5" rx="1" />
                    <rect x="2" y="6.75" width="12" height="2.5" rx="1" />
                    <rect x="2" y="11.5" width="12" height="2.5" rx="1" />
                  </svg>
                  List
                </button>
              </div>

              {/* Right: Quick Ship & Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Quick Ship Toggle */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  <div
                    onClick={() => setQuickShipOnly(!quickShipOnly)}
                    style={{
                      width: '36px',
                      height: '20px',
                      borderRadius: '12px',
                      backgroundColor: quickShipOnly ? teal : '#d1d5db',
                      position: 'relative',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        position: 'absolute',
                        top: '2px',
                        left: quickShipOnly ? '18px' : '2px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </div>
                  {/* Delivery truck icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Quick Ship
                </label>

                {/* Sort Dropdown */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      padding: '8px 32px 8px 14px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#111827',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="popular">Sort By: Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="carat-low">Carat: Low to High</option>
                    <option value="carat-high">Carat: High to Low</option>
                  </select>
                  <span
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      fontSize: '10px',
                      color: '#6b7280',
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {/* ── Tabs Bar: All Diamonds vs Compare ── */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '28px',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  color: activeTab === 'all' ? '#111827' : '#6b7280',
                  border: 'none',
                  borderBottom: activeTab === 'all' ? `2px solid ${teal}` : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                All Diamonds ({filtered.length > 0 ? (131433 - (DIAMONDS_CATALOG.length - filtered.length) * 1100).toLocaleString() : 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('compare')}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: activeTab === 'compare' ? 700 : 500,
                  color: activeTab === 'compare' ? '#111827' : '#6b7280',
                  border: 'none',
                  borderBottom: activeTab === 'compare' ? `2px solid ${teal}` : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <span>♡</span> Compare ({compareCount})
              </button>
            </div>

            {/* ── Product Catalog (Visual Grid View) ── */}
            {viewMode === 'visual' && (
              <>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
                    <p style={{ fontSize: '16px', marginBottom: '12px' }}>No diamonds match your selected filters.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: teal,
                        color: '#fff',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div
                    className="dg-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '24px',
                    }}
                  >
                    {filtered.map((diamond) => {
                      const isFavorited = !!wishlist[diamond.id];
                      return (
                        <div
                          key={diamond.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '0',
                            backgroundColor: '#ffffff',
                            transition: 'transform 0.2s',
                          }}
                        >
                          {/* Image Box */}
                          <div
                            style={{
                              position: 'relative',
                              width: '100%',
                              aspectRatio: '1 / 1',
                              backgroundColor: '#959da4',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {/* Best Value Badge */}
                            {diamond.bestValue && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '12px',
                                  left: '12px',
                                  backgroundColor: teal,
                                  color: '#ffffff',
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  letterSpacing: '0.5px',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  zIndex: 2,
                                }}
                              >
                                BEST VALUE
                              </div>
                            )}

                            {/* Top-Right Action Icons */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                zIndex: 2,
                              }}
                            >
                              {diamond.quickShip && (
                                <span
                                  title="Quick Ship Eligible"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#042f2c',
                                  }}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#042f2c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="3" width="15" height="13" />
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                  </svg>
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleWishlist(diamond.id)}
                                title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '18px',
                                  lineHeight: 1,
                                  color: isFavorited ? '#ef4444' : '#111827',
                                  padding: '2px',
                                  transition: 'color 0.2s',
                                }}
                              >
                                {isFavorited ? '♥' : '♡'}
                              </button>
                            </div>

                            {/* Center Diamond Image */}
                            <img
                              src={diamond.img}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '14px',
                                transition: 'transform 0.3s',
                              }}
                            />

                            {/* Going Fast Badge */}
                            {diamond.goingFast && (
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '12px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  backgroundColor: '#d1fae5',
                                  color: '#065f46',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '3px 12px',
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                  zIndex: 2,
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>🔥</span> GOING FAST
                              </div>
                            )}
                          </div>

                          {/* Details Below Card */}
                          <div style={{ textAlign: 'center', paddingTop: '14px', paddingBottom: '8px' }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#111827',
                                marginBottom: '4px',
                              }}
                            >
                              {diamond.carat.toFixed(2)} ct. {diamond.shape} Diamond
                            </div>
                            <div
                              style={{
                                fontSize: '13px',
                                color: '#4b5563',
                                marginBottom: '6px',
                              }}
                            >
                              {diamond.cut} · {diamond.color} · {diamond.clarity}
                            </div>
                            <div
                              style={{
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#111827',
                              }}
                            >
                              ${diamond.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── List View ── */}
            {viewMode === 'list' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#6b7280' }}>
                      <th style={{ padding: '12px 16px' }}>Stone</th>
                      <th style={{ padding: '12px 16px' }}>Shape</th>
                      <th style={{ padding: '12px 16px' }}>Carat</th>
                      <th style={{ padding: '12px 16px' }}>Cut</th>
                      <th style={{ padding: '12px 16px' }}>Color</th>
                      <th style={{ padding: '12px 16px' }}>Clarity</th>
                      <th style={{ padding: '12px 16px' }}>Origin</th>
                      <th style={{ padding: '12px 16px' }}>Price</th>
                      <th style={{ padding: '12px 16px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((diamond) => (
                      <tr key={diamond.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <img
                            src={diamond.img}
                            alt=""
                            style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#959da4', borderRadius: '4px' }}
                          />
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{diamond.shape}</td>
                        <td style={{ padding: '12px 16px' }}>{diamond.carat.toFixed(2)} ct</td>
                        <td style={{ padding: '12px 16px' }}>{diamond.cut}</td>
                        <td style={{ padding: '12px 16px' }}>{diamond.color}</td>
                        <td style={{ padding: '12px 16px' }}>{diamond.clarity}</td>
                        <td style={{ padding: '12px 16px' }}>{diamond.origin}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111827' }}>
                          ${diamond.price.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <a
                            href="/contact"
                            style={{
                              padding: '6px 12px',
                              backgroundColor: teal,
                              color: '#fff',
                              borderRadius: '4px',
                              fontSize: '12px',
                              textDecoration: 'none',
                              fontWeight: 600,
                            }}
                          >
                            Enquire
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

const sliderInputStyle = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '12px',
  fontWeight: 500,
  color: '#111827',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
};
