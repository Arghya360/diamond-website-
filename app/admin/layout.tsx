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
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: '✦', section: 'Main' },
  { label: 'Products', href: '/admin/products', icon: '💎' },
  { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
  { label: 'Shop Settings', href: '/admin/shop', icon: '🛍️', section: 'Storefront' },
  { label: 'Website Content', href: '/admin/content', icon: '🖼️' },
  { label: 'Navigation Menu', href: '/admin/navigation', icon: '🧭' },
  { label: 'Footer & Links', href: '/admin/footer', icon: '📄' },
  { label: 'Orders', href: '/admin/orders', icon: '📦', section: 'Sales & Clients' },
  { label: 'Customers', href: '/admin/customers', icon: '👥' },
  { label: 'System Settings', href: '/admin/settings', icon: '⚙️', section: 'Configuration' },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminProfile, isAdmin, loading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Clean layout for login screen
  if (pathname === '/admin/login') {
    return <div className="admin-body">{children}</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44,
            height: 44,
            border: '3px solid #E8E2D9',
            borderTopColor: '#BFA37C',
            borderRadius: '50%',
            animation: 'caritasSpin 0.9s linear infinite',
            margin: '0 auto 16px',
          }} />
          <style>{`@keyframes caritasSpin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 13, letterSpacing: '1px', color: '#BFA37C', textTransform: 'uppercase' }}>
            CARITAS LUXURY
          </div>
          <p style={{ color: '#8C9BA0', fontSize: 12, margin: '6px 0 0' }}>Authenticating access...</p>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!isAdmin) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return (
      <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8C9BA0' }}>Redirecting to administrator login...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const displayName = adminProfile?.displayName || 'Caritas360';
  const roleName = adminProfile?.role === 'super_admin' ? 'Super Administrator' : 'Administrator';
  const initial = displayName.charAt(0).toUpperCase() || 'C';

  // Compute Breadcrumb label
  const activeNav = NAV_ITEMS.find((item) =>
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  );
  const pageLabel = activeNav ? activeNav.label : 'Admin Portal';

  return (
    <div className="admin-body">
      <div className="admin-shell">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(12, 19, 21, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 95,
            }}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Brand header */}
          <div className="admin-sidebar-brand">
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <img
                src="/wp-content/uploads/caritas-logo-white.png"
                alt="Caritas Luxury"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="admin-brand-fallback">
                <span className="admin-brand-fallback-title">CARITAS</span>
                <span className="admin-brand-fallback-sub">Luxury Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="admin-sidebar-nav">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

              return (
                <React.Fragment key={item.href}>
                  {item.section && (
                    <div className="admin-nav-section-label">
                      {item.section}
                    </div>
                  )}
                  <Link
                    href={item.href}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.href !== '/admin' && <span className="admin-nav-arrow">›</span>}
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Footer Area with Storefront Link & Admin Profile */}
          <div className="admin-sidebar-footer">
            <a
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-store-link"
              title="Open customer storefront in a new tab"
            >
              <span>↗</span> View Live Storefront
            </a>

            <div className="admin-user-cell">
              <div className="admin-avatar-disc">{initial}</div>
              <div className="admin-user-info">
                <span className="admin-user-name">{displayName}</span>
                <span className="admin-user-role">{roleName}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="admin-signout-link"
            >
              <span>↪</span> Sign Out of Portal
            </button>
          </div>
        </aside>

        {/* ── STAGE / MAIN AREA ── */}
        <div className="admin-stage">
          {/* Topbar */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button
                className="admin-mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                ☰
              </button>

              <div className="admin-breadcrumbs">
                <Link href="/admin">Dashboard</Link>
                {pathname !== '/admin' && (
                  <>
                    <span>/</span>
                    <span className="admin-breadcrumbs-current">{pageLabel}</span>
                  </>
                )}
              </div>
            </div>

            <div className="admin-topbar-right">
              {/* Quick Search */}
              <div className="admin-search-box">
                <span className="admin-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Quick lookup..."
                  className="admin-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                />
                <kbd className="admin-search-kbd">↵</kbd>
              </div>

              {/* Status Pill */}
              <div className="admin-status-pill" title="Cloud Firestore & Firebase Auth Active">
                <span className="admin-status-dot" />
                <span>Firebase Connected</span>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="admin-main-wrap">
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
