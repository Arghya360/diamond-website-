'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../../lib/firebase/auth-context';
import './admin.css';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', ico: '▣' },
  { label: 'Products', href: '/admin/products', ico: '♢', arrow: true },
  { label: 'Categories', href: '/admin/categories', ico: '▱' },
  { label: 'Shop Page Settings', href: '/admin/shop', ico: '▣' },
  { label: 'Website Content', href: '/admin/content', ico: '▧', arrow: true },
  { label: 'Navigation', href: '/admin/navigation', ico: '⛶' },
  { label: 'Footer', href: '/admin/footer', ico: '▤' },
  { label: 'Orders', href: '/admin/orders', ico: '♧' },
  { label: 'Customers', href: '/admin/customers', ico: '♙' },
  { label: 'Settings', href: '/admin/settings', ico: '⚙', arrow: true },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminProfile, isAdmin, loading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const notify = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  // Login page: render clean
  if (pathname === '/admin/login') {
    return <div>{children}</div>;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f5f1' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #eee6dc', borderTopColor: '#bd914d', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#777b82', fontSize: 14 }}>Verifying administrator…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f5f1' }}>
        <p style={{ color: '#777b82' }}>Redirecting…</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const displayName = adminProfile?.displayName || 'Caritas360';
  const initial = displayName[0]?.toUpperCase() || 'C';

  return (
    <div className="admin-layout">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Brand */}
        <div className="admin-brand">
          <svg viewBox="0 0 64 48" aria-hidden="true">
            <path d="M12 5h40l9 13-29 25L3 18 12 5Z" />
            <path d="m3 18 58 0M12 5l9 13 11 25 11-25 9-13M21 18l11-13 11 13" />
          </svg>
          <b>CARITAS</b>
          <small>L U X U R Y</small>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-ico">{item.ico}</span>
                {item.label}
                {item.arrow && <span className="nav-arrow">›</span>}
              </Link>
            );
          })}
        </nav>

        {/* Promo box */}
        <div className="admin-promo">
          <div className="big-gem">◇</div>
          <strong>Caritas Luxury</strong>
          <span>Admin Portal</span>
          <p>Manage your luxury brand with ease and elegance.</p>
          <a className="admin-promo-btn" href="/shop" target="_blank" rel="noopener noreferrer">
            View Live Website →
          </a>
        </div>

        {/* Account */}
        <div className="admin-account">
          <div className="admin-account-row">
            <div className="admin-avatar">{initial}</div>
            <div className="admin-account-name">
              <strong>{displayName}</strong>
              <small>Super Admin</small>
            </div>
            <span style={{ color: '#bbb', fontSize: 11 }}>⌄</span>
          </div>
          <button className="admin-signout-btn" onClick={handleLogout}>
            ↪ &nbsp; Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

          <label className="admin-search">
            <span style={{ color: '#888', fontSize: 16 }}>⌕</span>
            <input
              placeholder="Search anything..."
              type="search"
              onKeyDown={(e) => {
                if (e.key === 'Enter') notify('Search: use Ctrl+K shortcut');
              }}
            />
            <kbd>⌘ K</kbd>
          </label>

          <div className="topbar-grow" />

          <div className="admin-online">System Online</div>

          <button className="admin-bell-btn" onClick={() => notify('No new notifications.')}>
            ♧
            <span className="badge">3</span>
          </button>

          <button className="admin-user-btn" onClick={() => notify(`Signed in as ${displayName} · Super Admin`)}>
            <div className="admin-avatar dark">{initial}</div>
            <span>
              <strong>{displayName}</strong>
              <small>Super Admin</small>
            </span>
            <span style={{ color: '#888', fontSize: 11 }}>⌄</span>
          </button>
        </header>

        {/* Page content */}
        <div className="admin-content">
          {children}
        </div>
      </main>

      {/* Toast */}
      <div className={`admin-toast${toastVisible ? ' show' : ''}`}>{toast}</div>
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
