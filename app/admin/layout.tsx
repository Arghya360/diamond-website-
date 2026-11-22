'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../../lib/firebase/auth-context';
import './admin.css';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '💎' },
  { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
  { label: 'Shop Page Settings', href: '/admin/shop', icon: '🛍️' },
  { label: 'Website Content', href: '/admin/content', icon: '🖼️' },
  { label: 'Navigation', href: '/admin/navigation', icon: '🧭' },
  { label: 'Footer', href: '/admin/footer', icon: '📄' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Customers', href: '/admin/customers', icon: '👥' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, adminProfile, isAdmin, loading, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, render clean login layout
  if (pathname === '/admin/login') {
    return <div className="admin-body">{children}</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #243035', borderTopColor: '#bfa37c', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#8c9ba0', fontSize: '14px' }}>Verifying Administrator Authorization...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin: redirect to login
  // NOTE: isAdmin can be true even when user (Firebase Auth) is null —
  // this happens with the direct-credential bypass for Caritas360.
  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/admin/login');
    }
    return (
      <div className="admin-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#8c9ba0' }}>Redirecting to administrator login...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="admin-body">
      <div className="admin-layout">
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 95,
            }}
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
          {/* Logo / Brand */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--admin-gold)', fontWeight: 700, fontSize: '16px', letterSpacing: '1px' }}>
                CARITAS LUXURY
              </div>
              <div style={{ color: 'var(--admin-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Admin Portal
              </div>
            </div>
            {mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation links */}
          <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        color: isActive ? '#0c1315' : 'var(--admin-text)',
                        backgroundColor: isActive ? 'var(--admin-gold)' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick link to live website */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--admin-border)' }}>
            <a
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '9px',
                borderRadius: '6px',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-gold)',
                fontSize: '12px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <span>↗</span> View Live Website
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="admin-main">
          {/* Top Header */}
          <header className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'none',
                }}
                className="mobile-toggle-btn"
              >
                ☰
              </button>
              <style>{`
                @media (max-width: 900px) {
                  .mobile-toggle-btn { display: block !important; }
                }
              `}</style>
              <span style={{ fontSize: '14px', color: 'var(--admin-muted)' }}>
                System: <strong style={{ color: '#10b981' }}>● Online</strong>
              </span>
            </div>

            {/* Admin Profile & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  {adminProfile?.displayName || user?.email?.split('@')[0]}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--admin-gold)' }}>
                  {adminProfile?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-muted)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* Page Body */}
          <main className="admin-content">{children}</main>
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
