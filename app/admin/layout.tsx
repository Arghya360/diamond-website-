'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../../lib/firebase/auth-context';
import './admin.css';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  section: 'OVERVIEW' | 'CATALOGUE' | 'STORE MANAGEMENT' | 'BUSINESS' | 'SYSTEM';
}

const NAV_ITEMS: NavItem[] = [
  // OVERVIEW
  { label: 'Dashboard', href: '/admin', icon: 'space_dashboard', section: 'OVERVIEW' },

  // CATALOGUE
  { label: 'Diamonds', href: '/admin/diamonds', icon: 'diamond', section: 'CATALOGUE' },
  { label: 'Jewellery Products', href: '/admin/products', icon: 'auto_awesome', section: 'CATALOGUE' },
  { label: 'Categories', href: '/admin/categories', icon: 'category', section: 'CATALOGUE' },
  { label: 'Inventory & Stock', href: '/admin/inventory', icon: 'inventory_2', section: 'CATALOGUE' },

  // STORE MANAGEMENT
  { label: 'Shop Page CMS', href: '/admin/shop', icon: 'storefront', section: 'STORE MANAGEMENT' },
  { label: 'Homepage Content', href: '/admin/content', icon: 'web', section: 'STORE MANAGEMENT' },
  { label: 'Navigation Menu', href: '/admin/navigation', icon: 'menu_open', section: 'STORE MANAGEMENT' },
  { label: 'Footer Settings', href: '/admin/footer', icon: 'view_day', section: 'STORE MANAGEMENT' },

  // BUSINESS
  { label: 'Orders & Commissions', href: '/admin/orders', icon: 'shopping_bag', section: 'BUSINESS' },
  { label: 'VIP Private Clients', href: '/admin/customers', icon: 'contacts', section: 'BUSINESS' },
  { label: 'Salon Appointments', href: '/admin/appointments', icon: 'calendar_month', section: 'BUSINESS' },

  // SYSTEM
  { label: 'Administrators', href: '/admin/settings', icon: 'shield_person', section: 'SYSTEM' },
  { label: 'Website Settings', href: '/admin/settings', icon: 'tune', section: 'SYSTEM' },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminProfile, isAdmin, loading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [omniSearch, setOmniSearch] = useState('');

  // Clean layout for login screen
  if (pathname === '/admin/login') {
    return <div className="admin-body">{children}</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF8FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44,
            height: 44,
            border: '3px solid #E2E7FF',
            borderTopColor: '#003629',
            borderRadius: '50%',
            animation: 'caritasSpin 0.9s linear infinite',
            margin: '0 auto 16px',
          }} />
          <style>{`@keyframes caritasSpin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, letterSpacing: '2px', color: '#003629', fontWeight: 600, textTransform: 'uppercase' }}>
            CARITAS LUXURY
          </div>
          <p style={{ color: '#725B38', fontSize: 12, margin: '6px 0 0', letterSpacing: '0.5px' }}>Atelier Vault Verification...</p>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!isAdmin) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return (
      <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF8FF' }}>
        <p style={{ color: '#707974', fontFamily: 'var(--font-title)' }}>Redirecting to administrator authentication...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const displayName = adminProfile?.displayName || 'Caritas360 Super Admin';

  // Filter navigation by search input
  const filteredNav = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(navSearch.toLowerCase()) ||
    item.section.toLowerCase().includes(navSearch.toLowerCase())
  );

  const sections: Array<'OVERVIEW' | 'CATALOGUE' | 'STORE MANAGEMENT' | 'BUSINESS' | 'SYSTEM'> = [
    'OVERVIEW',
    'CATALOGUE',
    'STORE MANAGEMENT',
    'BUSINESS',
    'SYSTEM',
  ];

  return (
    <div className="admin-body" style={{ background: '#FAF8FF', minHeight: '100vh' }}>
      <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(19, 27, 46, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 95,
            }}
          />
        )}

        {/* ── LEFT SIDEBAR (Stitch Atelier Spec w-72: 288px) ── */}
        <aside
          className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
          style={{
            width: 288,
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #EAEDFF',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Brand header */}
            <div style={{ height: 80, padding: '0 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid #F2F3FF' }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#003629',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FEDEB2',
                fontFamily: 'var(--font-serif)',
                fontSize: 18,
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(0,54,41,0.2)',
                flexShrink: 0,
              }}>
                ✦
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: '#003629', letterSpacing: '1px', lineHeight: 1 }}>
                  CARITAS
                </span>
                <span style={{ fontSize: 9.5, letterSpacing: '0.22em', color: '#725B38', textTransform: 'uppercase', fontWeight: 700, marginTop: 4 }}>
                  Haute Joaillerie
                </span>
              </div>
            </div>

            {/* Quick Navigation Filter Input */}
            <div style={{ padding: '14px 16px 8px' }}>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: 8, fontSize: 16, color: '#707974' }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Filter navigation..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  style={{
                    width: '100%',
                    height: 32,
                    paddingLeft: 32,
                    paddingRight: 10,
                    borderRadius: 8,
                    border: '1px solid #EAEDFF',
                    backgroundColor: '#F2F3FF',
                    fontSize: 12,
                    color: '#131B2E',
                    outline: 'none',
                    fontFamily: 'var(--font-title)',
                  }}
                />
              </div>
            </div>

            {/* Navigation links by sections */}
            <div style={{ flex: 1, padding: '6px 14px 16px', overflowY: 'auto' }}>
              {sections.map((sec) => {
                const secItems = filteredNav.filter((i) => i.section === sec);
                if (secItems.length === 0) return null;

                return (
                  <div key={sec} style={{ marginBottom: 16 }}>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#707974',
                      padding: '4px 10px',
                      fontFamily: 'var(--font-title)',
                    }}>
                      {sec}
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                      {secItems.map((item) => {
                        const isActive = item.href === '/admin'
                          ? pathname === '/admin'
                          : pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 12px',
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? '#FFFFFF' : '#404945',
                              backgroundColor: isActive ? '#003629' : 'transparent',
                              textDecoration: 'none',
                              transition: 'all 0.15s ease',
                              fontFamily: 'var(--font-title)',
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontSize: 18,
                                color: isActive ? '#FEDEB2' : '#707974',
                              }}
                            >
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Card: Atelier Vault Widget & User Profile */}
          <div style={{ padding: 16, borderTop: '1px solid #EAEDFF', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Atelier Vault 99.98% Telemetry Card */}
            <div style={{
              backgroundColor: '#F2F3FF',
              borderRadius: 12,
              padding: '12px 14px',
              border: '1px solid #EAEDFF',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#003629' }}>lock</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#131B2E', fontFamily: 'var(--font-title)' }}>Atelier Vault</span>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 999,
                  backgroundColor: '#BAEED9',
                  color: '#002117',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                }}>
                  99.98%
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#404945', fontFamily: 'var(--font-title)' }}>
                Biometric sync verified &amp; armed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, marginTop: 4, borderTop: '1px solid rgba(218, 226, 253, 0.6)' }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#707974', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Realtime Node</span>
                <button
                  type="button"
                  onClick={() => alert('Atelier Vault Node is 100% active and connected to Firebase Firestore.')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#003629',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontFamily: 'var(--font-title)',
                    padding: 0,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>sync</span>
                  <span>Sync Now</span>
                </button>
              </div>
            </div>

            {/* Profile Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#003629',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'var(--font-title)',
                }}>
                  C
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#131B2E', fontFamily: 'var(--font-title)', lineHeight: 1.2 }}>
                    Caritas360
                  </span>
                  <span style={{ fontSize: 9.5, color: '#725B38', fontWeight: 700, textTransform: 'uppercase' }}>
                    Super Admin
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href="/shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Storefront"
                  style={{ color: '#707974', fontSize: 12, textDecoration: 'none' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
                </a>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  style={{ background: 'none', border: 'none', color: '#BA1A1A', cursor: 'pointer', padding: 0 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ── STAGE / MAIN AREA (pl-72: 288px) ── */}
        <div style={{ flex: 1, marginLeft: 288, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Topbar matching Stitch Specification */}
          <header style={{
            height: 80,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #EAEDFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
          }}>
            {/* Left: Omni-Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, maxWidth: 540 }}>
              <button
                className="admin-mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  display: 'none',
                  background: 'none',
                  border: '1px solid #EAEDFF',
                  borderRadius: 8,
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
              </button>

              <div style={{ position: 'relative', width: '100%' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: 12, fontSize: 18, color: '#707974' }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Omni-Search certified diamonds, fine jewels, vaults..."
                  value={omniSearch}
                  onChange={(e) => setOmniSearch(e.target.value)}
                  style={{
                    width: '100%',
                    height: 42,
                    paddingLeft: 42,
                    paddingRight: 64,
                    borderRadius: 10,
                    border: '1px solid #EAEDFF',
                    backgroundColor: '#F2F3FF',
                    fontSize: 13,
                    color: '#131B2E',
                    outline: 'none',
                    fontFamily: 'var(--font-title)',
                    transition: 'all 0.15s ease',
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: 12,
                  top: 10,
                  padding: '3px 7px',
                  borderRadius: 6,
                  backgroundColor: '#DAE2FD',
                  color: '#404945',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'var(--font-title)',
                }}>
                  ⌘K
                </span>
              </div>
            </div>

            {/* Right: Currency Ticker + Vault Live Indicator + Notification + User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
              {/* Currency Ticker */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: '#F2F3FF',
                fontSize: 11,
                color: '#404945',
                fontFamily: 'var(--font-title)',
                fontWeight: 500,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#725B38' }}>currency_exchange</span>
                <span>USD 1.000 / EUR 0.924 / GBP 0.789</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#376757', marginLeft: 4 }} />
              </div>

              {/* Vault Live Pulse */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: '#F2F3FF',
                fontSize: 11,
                color: '#003629',
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: '#376757',
                  display: 'inline-block',
                  boxShadow: '0 0 0 3px rgba(55,103,87,0.2)',
                }} />
                <span>Vault Live</span>
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => alert('Maison Telemetry: All systems operational. 0 alerts.')}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  border: '1px solid #EAEDFF',
                  backgroundColor: '#FFFFFF',
                  color: '#404945',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 19 }}>notifications</span>
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: '#725B38',
                  border: '1.5px solid #FFFFFF',
                }} />
              </button>

              {/* User Dossier Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: '#003629',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#131B2E', fontFamily: 'var(--font-title)', lineHeight: 1.2 }}>
                    Elena Vance
                  </span>
                  <span style={{ fontSize: 10, color: '#707974', fontFamily: 'var(--font-title)' }}>
                    Creative Director &amp; Admin
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main style={{ padding: '32px 36px 64px', maxWidth: 1600, width: '100%', margin: '0 auto', flex: 1 }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
