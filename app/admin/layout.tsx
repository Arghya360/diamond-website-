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
  section: 'OPERATIONS' | 'RECORDS' | 'CLIENT SERVICES' | 'SYSTEM';
}

const NAV_ITEMS: NavItem[] = [
  // OPERATIONS
  { label: 'Overview', href: '/admin', icon: '📊', section: 'OPERATIONS' },
  { label: 'Orders', href: '/admin/orders', icon: '🧾', section: 'OPERATIONS' },
  { label: 'Inventory & Stock', href: '/admin/inventory', icon: '📦', section: 'OPERATIONS' },

  // RECORDS
  { label: 'Products', href: '/admin/products', icon: '◇', section: 'RECORDS' },
  { label: 'Diamonds', href: '/admin/diamonds', icon: '💎', section: 'RECORDS' },
  { label: 'Categories', href: '/admin/categories', icon: '◆', section: 'RECORDS' },
  { label: 'Live Metal Prices & Ticker', href: '/admin/shop', icon: '📈', section: 'RECORDS' },
  { label: 'Users & Customers', href: '/admin/customers', icon: '👥', section: 'RECORDS' },

  // CLIENT SERVICES
  { label: 'Contact Page & Messages', href: '/admin/content', icon: '✉️', section: 'CLIENT SERVICES' },
  { label: 'Appointments', href: '/admin/appointments', icon: '🏛️', section: 'CLIENT SERVICES' },
  { label: 'Navigation Menu', href: '/admin/navigation', icon: '🧭', section: 'CLIENT SERVICES' },
  { label: 'Footer & Policies', href: '/admin/footer', icon: '📄', section: 'CLIENT SERVICES' },

  // SYSTEM
  { label: 'Staff & Admins', href: '/admin/settings', icon: '🛡️', section: 'SYSTEM' },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminProfile, isAdmin, loading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  // Clean layout for login screen
  if (pathname === '/admin/login') {
    return <div className="admin-body">{children}</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #E5E7EB',
            borderTopColor: '#111827',
            borderRadius: '50%',
            animation: 'caritasSpin 0.9s linear infinite',
            margin: '0 auto 16px',
          }} />
          <style>{`@keyframes caritasSpin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 13, letterSpacing: '1px', color: '#111827', fontWeight: 700, textTransform: 'uppercase' }}>
            CARITAS LUXURY
          </div>
          <p style={{ color: '#6B7280', fontSize: 12, margin: '6px 0 0' }}>Authenticating access...</p>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!isAdmin) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return (
      <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
        <p style={{ color: '#6B7280' }}>Redirecting to administrator login...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const displayName = adminProfile?.displayName || 'Caritas360 Super Admin';
  const initial = 'C';

  // Filter navigation by search input
  const filteredNav = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(navSearch.toLowerCase()) ||
    item.section.toLowerCase().includes(navSearch.toLowerCase())
  );

  const sections: Array<'OPERATIONS' | 'RECORDS' | 'CLIENT SERVICES' | 'SYSTEM'> = [
    'OPERATIONS',
    'RECORDS',
    'CLIENT SERVICES',
    'SYSTEM',
  ];

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
              backgroundColor: 'rgba(17, 24, 39, 0.4)',
              backdropFilter: 'blur(3px)',
              zIndex: 95,
            }}
          />
        )}

        {/* ── LEFT SIDEBAR ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Brand header */}
          <div className="admin-sidebar-brand">
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <span className="admin-brand-star">✦</span>
              <div className="admin-brand-text">
                <div className="admin-brand-name">CARITAS LUXURY</div>
                <div className="admin-brand-sub">FINE JEWELLERY &amp; DIAMONDS • GENEVA</div>
              </div>
            </Link>
          </div>

          {/* Navigation Search */}
          <div className="admin-sidebar-search-box">
            <input
              type="text"
              placeholder="Search navigation..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="admin-sidebar-search-input"
            />
          </div>

          {/* Navigation Links grouped by section */}
          <nav className="admin-sidebar-nav">
            {sections.map((sec) => {
              const secItems = filteredNav.filter((i) => i.section === sec);
              if (secItems.length === 0) return null;

              return (
                <div key={sec} className="admin-nav-group">
                  <div className="admin-nav-section-title">{sec}</div>
                  {secItems.map((item) => {
                    const isActive = item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`admin-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="admin-nav-icon">{item.icon}</span>
                        <span className="admin-nav-label">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Footer Area with Storefront Link & Admin Profile */}
          <div className="admin-sidebar-footer">
            <a
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-back-store-link"
              title="Open storefront"
            >
              ← Back to Storefront
            </a>

            {/* Profile Card */}
            <div className="admin-profile-box">
              <div className="admin-profile-name">{displayName}</div>
              <div className="admin-profile-badge">
                <span>👑</span> SUPER ADMIN
              </div>
              <button
                onClick={handleLogout}
                className="admin-profile-signout"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* ── STAGE / MAIN AREA ── */}
        <div className="admin-stage">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button
                className="admin-mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                ☰
              </button>

              <div className="admin-topbar-brand-indicator">
                <span className="admin-live-dot" />
                <span className="admin-live-brand-name">Caritas Luxury Admin</span>
                <span className="admin-badge-admin-pill">ADMIN</span>
              </div>
            </div>

            <div className="admin-topbar-right">
              {/* Notification Bell Button */}
              <button
                className="admin-bell-button"
                title="System Notifications"
                onClick={() => alert('All systems operational. No unread alerts.')}
              >
                🔔
              </button>

              {/* User Profile Pill */}
              <div className="admin-user-pill">
                <div className="admin-user-avatar">{initial}</div>
                <span className="admin-user-pill-name">{displayName}</span>
              </div>
            </div>
          </header>

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
