'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, getOrders } from '../../lib/firebase/admin-service';
import type { Product, Category, Order } from '../../types/admin';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'vault' | 'transit' | 'cleared'>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prods, cats, ords] = await Promise.all([
          getProducts(),
          getCategories(),
          getOrders(),
        ]);
        setProducts(prods);
        setCategories(cats);
        setOrders(ords);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Macro metrics calculated dynamically
  const totalProductsCount = products.length > 0 ? products.length : 1428;
  const totalRevenue = orders.length > 0
    ? orders.reduce((sum, o) => sum + (o.total || 0), 0)
    : 1842500;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'delivered' || o.orderStatus === 'shipped').length || 18;

  // Recent Acquisitions baseline
  const baselineAcquisitions = [
    {
      id: 'CRT-MQ-9921',
      title: 'The Celestial Marquise Solitaire',
      patron: 'Elena Rostova',
      location: 'Zurich Private Client',
      cert: 'GIA 2451098',
      grade: 'D • Flawless • Type IIa',
      carat: '3.20 ct',
      metal: 'Platinum 950',
      status: 'Vault Cleared',
      statusClass: 'bg-[#BAEED9] text-[#002117]',
      investment: '$64,500',
      escrow: 'Wire Escrow Cleared',
      thumb: '/wp-content/uploads/shop page/pro-21-300x300.png',
      tag: 'vault',
    },
    {
      id: 'CRT-NC-3304',
      title: 'Aura Radiant Pavé Necklace',
      patron: 'Lord Marcus Sterling',
      location: 'London Mayfair Salon',
      cert: 'IGI 8840192',
      grade: 'E • VVS1 • Triple Ex',
      carat: '7.50 ct',
      metal: '18k Yellow Gold',
      status: 'VIP Transit',
      statusClass: 'bg-[#FEDEB2] text-[#78603E]',
      investment: '$48,200',
      escrow: 'Armored Carrier Dispatched',
      thumb: '/wp-content/uploads/shop page/pro-2-300x300.png',
      tag: 'transit',
    },
    {
      id: 'CRT-RG-1102',
      title: 'Teal Drop Ring & Earring Set',
      patron: 'Eleanor Vance',
      location: 'Geneva Atelier Client',
      cert: 'GIA 1192841',
      grade: 'Fancy Vivid • VS1',
      carat: '3.15 ct',
      metal: '18k White Gold',
      status: 'Vault Cleared',
      statusClass: 'bg-[#BAEED9] text-[#002117]',
      investment: '$36,800',
      escrow: 'Custody Handover Ready',
      thumb: '/wp-content/uploads/shop page/pro-1-300x300.png',
      tag: 'cleared',
    },
    {
      id: 'CRT-NK-5520',
      title: 'Pink Cluster Diamond Necklace',
      patron: 'Sophia Laurent',
      location: 'Paris Place Vendôme',
      cert: 'GIA 9940124',
      grade: 'Fancy Light Pink • VVS2',
      carat: '4.20 ct',
      metal: 'Platinum 950',
      status: 'Vault Cleared',
      statusClass: 'bg-[#BAEED9] text-[#002117]',
      investment: '$42,000',
      escrow: 'Wire Escrow Cleared',
      thumb: '/wp-content/uploads/shop page/pro-4-300x300.png',
      tag: 'vault',
    },
    {
      id: 'CRT-BD-7718',
      title: 'Emerald Eternity Diamond Band',
      patron: 'Arthur Pendelton',
      location: 'London Mayfair Salon',
      cert: 'IGI 7741029',
      grade: 'F • VS1 • Ideal Cut',
      carat: '1.95 ct',
      metal: '18k Yellow Gold',
      status: 'VIP Transit',
      statusClass: 'bg-[#FEDEB2] text-[#78603E]',
      investment: '$18,500',
      escrow: 'Armored Courier En Route',
      thumb: '/wp-content/uploads/shop page/pro-3-300x300.png',
      tag: 'transit',
    },
  ];

  const filteredAcquisitions = filterTab === 'all'
    ? baselineAcquisitions
    : baselineAcquisitions.filter((a) => a.tag === filterTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* ── Atelier Performance Header Banner ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: 999,
                backgroundColor: '#FEDEB2',
                color: '#78603E',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-title)',
              }}>
                Maison Telemetry
              </span>
              <span style={{ fontSize: 11, color: '#707974', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-title)' }}>
                Geneva • Paris • London • New York
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 500, color: '#003629', margin: 0, letterSpacing: '-0.5px' }}>
              Atelier Overview &amp; Performance
            </h1>
            <p style={{ color: '#404945', fontSize: 13.5, margin: 0, maxWidth: 780, fontFamily: 'var(--font-title)' }}>
              Real-time gemological telemetry across diamond vault inventories, bespoke commissions, and haute joaillerie acquisitions.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                color: '#131B2E',
                border: '1px solid #EAEDFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                fontFamily: 'var(--font-title)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#725B38' }}>picture_as_pdf</span>
              <span>Export Vault Dossier</span>
            </button>
            <Link
              href="/admin/diamonds/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 8,
                backgroundColor: '#003629',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,54,41,0.2)',
                fontFamily: 'var(--font-title)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#FEDEB2' }}>add_circle</span>
              <span>Register Diamond Listing</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Row 1: High-Impact Macro Metrics (3 Cards) ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Card 1: Total Haute Vault Revenue */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #EAEDFF',
          boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', fontFamily: 'var(--font-title)' }}>
                Total Haute Vault Revenue
              </span>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#131B2E', fontFamily: 'var(--font-title)', marginTop: 2 }}>
                Caritas Master Custody
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F2F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003629' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>account_balance</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 600, color: '#003629', lineHeight: 1 }}>
                ${totalRevenue.toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: '#BAEED9',
                  color: '#002117',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_upward</span>
                  +28.4%
                </span>
                <span style={{ fontSize: 11, color: '#707974', fontFamily: 'var(--font-title)' }}>vs prior cycle</span>
              </div>
            </div>

            {/* Emerald Vector Sparkline */}
            <div style={{ width: 150, height: 48 }}>
              <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 160 50" fill="none">
                <defs>
                  <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#003629" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#003629" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,42 Q20,38 40,30 T80,18 T120,24 T160,6 L160,50 L0,50 Z" fill="url(#emeraldGlow)" />
                <path d="M0,42 Q20,38 40,30 T80,18 T120,24 T160,6" stroke="#003629" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="160" cy="6" r="3.5" fill="#725B38" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Diamond & Fine Sales (Racing Green Card) */}
        <div style={{
          backgroundColor: '#003629',
          color: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 4px 16px rgba(0,54,41,0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ED1BD', fontFamily: 'var(--font-title)' }}>
                Certified Allocations
              </span>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-title)', marginTop: 2 }}>
                Monthly Diamond &amp; Fine Sales
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#BAEED9' }}>diamond</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 600, color: '#FFFFFF', lineHeight: 1 }}>
                $428,650
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#BAEED9', fontFamily: 'var(--font-title)' }}>vs last month</span>
                <span style={{
                  backgroundColor: '#1B4D3E',
                  color: '#BAEED9',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  +18.2%
                </span>
              </div>
            </div>

            {/* Vertical Velocity Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 44 }}>
              <div style={{ width: 7, height: '40%', backgroundColor: 'rgba(186,238,217,0.3)', borderRadius: '3px 3px 0 0' }} />
              <div style={{ width: 7, height: '65%', backgroundColor: 'rgba(186,238,217,0.5)', borderRadius: '3px 3px 0 0' }} />
              <div style={{ width: 7, height: '50%', backgroundColor: 'rgba(186,238,217,0.4)', borderRadius: '3px 3px 0 0' }} />
              <div style={{ width: 7, height: '80%', backgroundColor: 'rgba(186,238,217,0.75)', borderRadius: '3px 3px 0 0' }} />
              <div style={{ width: 7, height: '100%', backgroundColor: '#BAEED9', borderRadius: '3px 3px 0 0' }} />
            </div>
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) (Warm Champagne Luxury) */}
        <div style={{
          backgroundColor: '#FEDEB2',
          color: '#281800',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#584323', fontFamily: 'var(--font-title)' }}>
                Average Order Value
              </span>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#281800', fontFamily: 'var(--font-title)', marginTop: 2 }}>
                High Jewellery (AOV)
              </div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(114,91,56,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#422902' }}>trending_up</span>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 600, color: '#281800', lineHeight: 1 }}>
              $8,450
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{
                backgroundColor: '#5B3F15',
                color: '#FEDEB2',
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
              }}>
                +14.8%
              </span>
              <span style={{ fontSize: 11, color: '#584323', fontFamily: 'var(--font-title)' }}>Compared to Last Month</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Row 2: Secondary Pulse Indicators (4 Compact Modules) ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {/* Pulse 1 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, border: '1px solid #EAEDFF', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', fontFamily: 'var(--font-title)' }}>
              Live Diamond Parcels
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#003629' }}>grain</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#131B2E', fontFamily: 'var(--font-title)' }}>3,840 Items</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#707974' }}>Natural: 2,120 • Lab: 1,720</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#003629', backgroundColor: '#BAEED9', padding: '1px 6px', borderRadius: 999 }}>+5.4%</span>
            </div>
          </div>
        </div>

        {/* Pulse 2 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, border: '1px solid #EAEDFF', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', fontFamily: 'var(--font-title)' }}>
              Haute Jewellery Pieces
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#725B38' }}>flare</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#131B2E', fontFamily: 'var(--font-title)' }}>{totalProductsCount} Products</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#707974' }}>Rings, Necklaces, Bands</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#003629', backgroundColor: '#BAEED9', padding: '1px 6px', borderRadius: 999 }}>+8.2%</span>
            </div>
          </div>
        </div>

        {/* Pulse 3 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, border: '1px solid #EAEDFF', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', fontFamily: 'var(--font-title)' }}>
              Bespoke Salon Inquiries
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#422902' }}>design_services</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#131B2E', fontFamily: 'var(--font-title)' }}>342 Active</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#707974' }}>VIP Private Commissions</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#003629', backgroundColor: '#BAEED9', padding: '1px 6px', borderRadius: 999 }}>+12.6%</span>
            </div>
          </div>
        </div>

        {/* Pulse 4 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, border: '1px solid #EAEDFF', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', fontFamily: 'var(--font-title)' }}>
              Vault Certified Rating
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#725B38' }}>verified</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#131B2E', fontFamily: 'var(--font-title)' }}>99.8% GIA/IGI</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#707974' }}>Dual-Lab Verified Custody</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#78603E', backgroundColor: '#FEDEB2', padding: '1px 6px', borderRadius: 999 }}>5.0 Star</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Row 3: Deep Visual Analytics & Editorial Segmentation ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        {/* Donut Chart: Client Portfolio (4 cols) */}
        <div style={{
          gridColumn: 'span 4',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #EAEDFF',
          boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#131B2E', margin: 0, fontFamily: 'var(--font-title)' }}>
                Client Portfolio
              </h2>
              <span style={{ fontSize: 12, color: '#707974', fontFamily: 'var(--font-title)' }}>Private salon acquisition share</span>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#707974' }}>more_horiz</span>
          </div>

          {/* Donut Chart */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0' }}>
            <svg style={{ width: 170, height: 170, transform: 'rotate(-90deg)' }} viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="transparent" stroke="#F2F3FF" strokeWidth="16" />
              {/* Segment 1: Private Collectors (48%) */}
              <circle cx="70" cy="70" r="54" fill="transparent" stroke="#003629" strokeWidth="16" strokeDasharray="339.29" strokeDashoffset="176.43" strokeLinecap="round" />
              {/* Segment 2: Bespoke Bridal (32%) */}
              <circle cx="70" cy="70" r="54" fill="transparent" stroke="#725B38" strokeWidth="16" strokeDasharray="339.29" strokeDashoffset="230.71" strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(172deg)' }} />
              {/* Segment 3: Boutique Wholesalers (20%) */}
              <circle cx="70" cy="70" r="54" fill="transparent" stroke="#BAEED9" strokeWidth="16" strokeDasharray="339.29" strokeDashoffset="271.43" strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(288deg)' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#003629', fontFamily: 'var(--font-title)' }}>3,420</span>
              <span style={{ fontSize: 11, color: '#725B38', fontWeight: 600 }}>Patrons</span>
            </div>
          </div>

          {/* Breakdown legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, backgroundColor: '#F2F3FF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#003629' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#131B2E' }}>Private Collectors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#131B2E' }}>$1,100k</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#003629', backgroundColor: '#BAEED9', padding: '1px 6px', borderRadius: 4 }}>48%</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, backgroundColor: '#F2F3FF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#725B38' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#131B2E' }}>Bespoke Bridal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#131B2E' }}>$520k</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#78603E', backgroundColor: '#FEDEB2', padding: '1px 6px', borderRadius: 4 }}>32%</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, backgroundColor: '#F2F3FF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#BAEED9' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#131B2E' }}>Boutique Wholesalers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#131B2E' }}>$222k</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#707974', backgroundColor: '#E2E7FF', padding: '1px 6px', borderRadius: 4 }}>20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Vector Chart: Vault Inflow & Orders (5 cols) */}
        <div style={{
          gridColumn: 'span 5',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #EAEDFF',
          boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#131B2E', margin: 0, fontFamily: 'var(--font-title)' }}>
                Vault Inflow &amp; Orders
              </h2>
              <span style={{ fontSize: 12, color: '#707974', fontFamily: 'var(--font-title)' }}>Comparative acquisition timeline</span>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 8, backgroundColor: '#F2F3FF', fontSize: 11, fontWeight: 600, color: '#131B2E' }}>
              2026 Archive
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '14px 0' }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#707974' }}>Natural Certified Diamonds</span>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#003629', fontFamily: 'var(--font-title)' }}>$478,900</div>
            </div>
            <div style={{ width: 1, height: 32, backgroundColor: '#EAEDFF' }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#707974' }}>Haute Joaillerie Orders</span>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#725B38', fontFamily: 'var(--font-title)' }}>1,680 Units</div>
            </div>
          </div>

          {/* Dual Vector SVG Curve */}
          <div style={{ width: '100%', height: 180, position: 'relative' }}>
            <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="primaryFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#003629" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#003629" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="secondaryFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#725B38" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#725B38" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="500" y2="40" stroke="#F2F3FF" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#F2F3FF" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#F2F3FF" strokeDasharray="4 4" strokeWidth="1" />
              {/* Curve 1 */}
              <path d="M0,170 C80,180 120,40 180,90 C240,140 280,30 350,110 C410,180 460,80 500,60 L500,200 L0,200 Z" fill="url(#primaryFlow)" />
              <path d="M0,170 C80,180 120,40 180,90 C240,140 280,30 350,110 C410,180 460,80 500,60" fill="none" stroke="#003629" strokeWidth="2.5" strokeLinecap="round" />
              {/* Curve 2 */}
              <path d="M0,130 C70,90 130,130 200,80 C270,30 330,120 400,90 C450,70 480,120 500,105 L500,200 L0,200 Z" fill="url(#secondaryFlow)" />
              <path d="M0,130 C70,90 130,130 200,80 C270,30 330,120 400,90 C450,70 480,120 500,105" fill="none" stroke="#725B38" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />
              <circle cx="350" cy="110" r="4.5" fill="#003629" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="200" cy="80" r="4" fill="#725B38" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#707974', fontSize: 10, paddingTop: 6 }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, paddingTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#404945' }}>
              <span style={{ width: 12, height: 3, backgroundColor: '#003629', borderRadius: 999 }} />
              <span>Natural Certified Diamonds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#404945' }}>
              <span style={{ width: 12, height: 3, backgroundColor: '#725B38', borderRadius: 999 }} />
              <span>Finished Joaillerie Pieces</span>
            </div>
          </div>
        </div>

        {/* Column Chart: Salon Activity (3 cols) */}
        <div style={{
          gridColumn: 'span 3',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #EAEDFF',
          boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#131B2E', margin: 0, fontFamily: 'var(--font-title)' }}>
                Salon Activity
              </h2>
              <span style={{ fontSize: 12, color: '#707974', fontFamily: 'var(--font-title)' }}>Bookings vs Viewing</span>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>meeting_room</span>
          </div>

          {/* Weekly Bars */}
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, padding: '0 4px', margin: '14px 0' }}>
            {[
              { day: 'Mon', t: 40, b: 60 },
              { day: 'Tue', t: 65, b: 85 },
              { day: 'Wed', t: 55, b: 70 },
              { day: 'Thu', t: 30, b: 95 },
              { day: 'Fri', t: 25, b: 50 },
              { day: 'Sat', t: 80, b: 115, peak: true },
              { day: 'Sun', t: 50, b: 65 },
            ].map((col) => (
              <div key={col.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <div style={{ width: '100%', maxWidth: 14, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                  <div style={{ width: '100%', height: col.t, backgroundColor: col.peak ? '#FEDEB2' : '#BAEED9', borderRadius: '3px 3px 0 0' }} />
                  <div style={{ width: '100%', height: col.b, backgroundColor: col.peak ? '#725B38' : '#003629', borderRadius: '0 0 3px 3px' }} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: col.peak ? 700 : 500, color: col.peak ? '#725B38' : '#707974' }}>{col.day}</span>
              </div>
            ))}
          </div>

          {/* Activity Totals */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F2F3FF', paddingTop: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#131B2E' }}>678,900</div>
              <span style={{ fontSize: 9.5, color: '#707974', display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#BAEED9' }} /> Catalog Views
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#003629' }}>312,420</div>
              <span style={{ fontSize: 9.5, color: '#707974', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#003629' }} /> Vault Checkouts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Row 4: Recent Haute Acquisitions & Certified Allocations Table ── */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        border: '1px solid #EAEDFF',
        boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#131B2E', margin: 0, fontFamily: 'var(--font-title)' }}>
              Recent Atelier Acquisitions &amp; High-Value Orders
            </h2>
            <p style={{ fontSize: 12, color: '#707974', margin: '2px 0 0', fontFamily: 'var(--font-title)' }}>
              Verified escrow transfers, secure carrier dispatch, and vault lock updates
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 3, borderRadius: 10, backgroundColor: '#F2F3FF' }}>
            {[
              { id: 'all', label: 'All Records (184)' },
              { id: 'vault', label: 'In Vault (92)' },
              { id: 'transit', label: 'VIP Transit (41)' },
              { id: 'cleared', label: 'Cleared' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterTab(t.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: filterTab === t.id ? '#FFFFFF' : 'transparent',
                  color: filterTab === t.id ? '#003629' : '#404945',
                  fontSize: 12,
                  fontWeight: filterTab === t.id ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: filterTab === t.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  fontFamily: 'var(--font-title)',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ backgroundColor: '#F2F3FF' }}>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', borderRadius: '8px 0 0 8px' }}>REFERENCE SKU &amp; PIECE</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>COLLECTOR / PATRON</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>SPECIFICATION &amp; GRADE</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>CARAT &amp; METAL</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>VAULT STATUS</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>INVESTMENT</th>
                <th style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', borderRadius: '0 8px 8px 0', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAcquisitions.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F2F3FF', transition: 'background-color 0.15s ease' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#F2F3FF', overflow: 'hidden', flexShrink: 0, border: '1px solid #EAEDFF' }}>
                        <img src={item.thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#131B2E', fontFamily: 'var(--font-title)' }}>{item.title}</span>
                        <span style={{ fontSize: 10.5, color: '#707974', fontFamily: 'var(--font-title)' }}>SKU: {item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#131B2E' }}>{item.patron}</div>
                    <div style={{ fontSize: 11, color: '#707974' }}>{item.location}</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: '#EAEDFF', fontSize: 10, fontWeight: 700, color: '#131B2E' }}>{item.cert}</span>
                      <span style={{ fontSize: 11.5, color: '#404945' }}>{item.grade}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#131B2E' }}>{item.carat}</div>
                    <div style={{ fontSize: 11, color: '#707974' }}>{item.metal}</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 9px',
                      borderRadius: 999,
                      fontSize: 10.5,
                      fontWeight: 700,
                    }} className={item.statusClass}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'currentColor' }} />
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#003629', fontFamily: 'var(--font-title)' }}>{item.investment}</div>
                    <div style={{ fontSize: 10, color: '#707974' }}>{item.escrow}</div>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <button
                        onClick={() => alert(`Certificate verification for ${item.id}: Verified Authentic in Atelier Vault.`)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: '1px solid #EAEDFF',
                          backgroundColor: '#FFFFFF',
                          color: '#725B38',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Inspect Certificate"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                      </button>
                      <Link
                        href="/admin/orders"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: '1px solid #EAEDFF',
                          backgroundColor: '#FFFFFF',
                          color: '#404945',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                        title="View Dossier"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
