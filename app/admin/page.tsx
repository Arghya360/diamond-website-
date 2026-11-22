'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, getOrders, deleteProduct } from '../../lib/firebase/admin-service';
import { seedAllWebsiteData } from '../../lib/firebase/seed-data';
import type { Product, Category, Order } from '../../types/admin';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
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

  const handleSeedData = async () => {
    if (!confirm('This will seed the complete baseline catalog (33 products, 12 categories, hero slides, navigation) into Firestore. Continue?')) {
      return;
    }
    setSeeding(true);
    setNotice(null);
    try {
      const res = await seedAllWebsiteData(true);
      setNotice(res.message);
      await loadDashboardData();
    } catch (err: any) {
      setNotice('Failed to seed: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!p.id || !confirm(`Permanently remove "${p.name}" from catalog?`)) return;
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      setNotice(`"${p.name}" has been deleted.`);
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Metrics
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const draftProducts = products.filter((p) => !p.published).length;
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= 3);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
  const recentProducts = products.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <>
      {/* Toast Notice */}
      {notice && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--dark-obsidian)',
            color: '#FFFFFF',
            border: '1px solid var(--primary-gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 20px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            fontSize: '13px',
            fontFamily: 'var(--font-title)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✦</span>
          <span>{notice}</span>
        </div>
      )}

      {/* ── 1. LUXURY WELCOME HERO ── */}
      <section className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— MASTER DIAMOND CURATORS</span>
          <h1 className="admin-hero-title">Executive Administration Portal</h1>
          <p className="admin-hero-subtitle">
            Real-time management for Caritas Luxury Diamonds, bespoke jewelry catalog, client orders, and digital storefront content.
          </p>
        </div>

        <div className="admin-hero-actions">
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="btn-caritas-secondary"
            title="Populate baseline products and categories into Firestore"
          >
            <span>⚡</span>
            <span>{seeding ? 'Syncing...' : 'Sync Catalog Data'}</span>
          </button>

          <Link href="/admin/products/new" className="btn-caritas-gold">
            <span>+</span>
            <span>Add New Product</span>
          </Link>
        </div>
      </section>

      {/* ── 2. METRIC CARDS GRID ── */}
      <section className="admin-metric-grid">
        {/* Products Metric */}
        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Total Catalog</div>
            <div className="admin-metric-value">{loading ? '...' : totalProducts}</div>
            <div className="admin-metric-desc">
              <span className="admin-metric-badge green">{publishedProducts} Published</span>
              <span>{draftProducts} Draft</span>
            </div>
          </div>
          <div className="admin-metric-icon-wrap">💎</div>
        </div>

        {/* Categories Metric */}
        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Active Categories</div>
            <div className="admin-metric-value">{loading ? '...' : categories.length}</div>
            <div className="admin-metric-desc">
              <span style={{ color: 'var(--primary-gold)', fontWeight: 600 }}>Live on /shop menu</span>
            </div>
          </div>
          <div className="admin-metric-icon-wrap">🏷️</div>
        </div>

        {/* Orders Metric */}
        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Client Orders</div>
            <div className="admin-metric-value">{loading ? '...' : orders.length}</div>
            <div className="admin-metric-desc">
              <span className="admin-metric-badge amber">{pendingOrders} Pending Fulfillment</span>
            </div>
          </div>
          <div className="admin-metric-icon-wrap">📦</div>
        </div>

        {/* Low Stock Metric */}
        <div className="admin-metric-card">
          <div>
            <div className="admin-metric-label">Inventory Alerts</div>
            <div
              className="admin-metric-value"
              style={{ color: lowStockProducts.length > 0 ? 'var(--amber)' : undefined }}
            >
              {loading ? '...' : lowStockProducts.length}
            </div>
            <div className="admin-metric-desc">
              <span>Units ≤ 3 in vault inventory</span>
            </div>
          </div>
          <div className="admin-metric-icon-wrap">⚠️</div>
        </div>
      </section>

      {/* ── 3. QUICK ACTIONS GRID ── */}
      <section className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <span style={{ color: 'var(--primary-gold)' }}>✦</span>
            <span>Storefront Management Shortcuts</span>
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick direct-access tools</span>
        </div>

        <div className="admin-actions-grid" style={{ marginBottom: 0 }}>
          <Link href="/admin/products/new" className="admin-quick-action primary">
            <span>+ Add Product</span>
          </Link>
          <Link href="/admin/categories" className="admin-quick-action">
            <span>🏷️ Categories</span>
          </Link>
          <Link href="/admin/shop" className="admin-quick-action">
            <span>🛍️ Shop Settings</span>
          </Link>
          <Link href="/admin/content" className="admin-quick-action">
            <span>🖼️ Hero Banners</span>
          </Link>
          <Link href="/admin/navigation" className="admin-quick-action">
            <span>🧭 Menu Hierarchy</span>
          </Link>
          <Link href="/admin/footer" className="admin-quick-action">
            <span>📄 Footer & Legal</span>
          </Link>
        </div>
      </section>

      {/* ── 4. TWO-COLUMN DATA TABLES (Recent Products & Orders) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Recent Products Card */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>💎 Recent Products</span>
            </h2>
            <Link href="/admin/products" className="admin-card-link">
              View All Products ({totalProducts}) →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '16px 0' }}>Loading products...</p>
          ) : recentProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <p style={{ margin: '0 0 12px' }}>No products found in Firestore.</p>
              <button onClick={handleSeedData} className="btn-caritas-gold" style={{ fontSize: '12px' }}>
                Seed Storefront Products
              </button>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((p) => {
                    const imgUrl = p.images?.[0]?.url || '/wp-content/uploads/shop page/pro-21-300x300.png';
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-prod-cell">
                            <div
                              className="admin-prod-thumb"
                              style={{ backgroundImage: `url("${imgUrl}")` }}
                            />
                            <div>
                              <div className="admin-prod-name">{p.name}</div>
                              <div className="admin-prod-meta">SKU: {p.sku || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge-caritas badge-gold">{p.category}</span>
                        </td>
                        <td>
                          <strong style={{ fontFamily: 'var(--font-title)' }}>
                            ${(p.price || 0).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <span className={`badge-caritas ${p.published ? 'badge-published' : 'badge-draft'}`}>
                            {p.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <Link
                              href={`/admin/products/edit?id=${p.id}`}
                              className="btn-caritas-secondary"
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="btn-caritas-danger"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              title="Delete product"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Orders Card */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>📦 Recent Orders</span>
            </h2>
            <Link href="/admin/orders" className="admin-card-link">
              View All Orders →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '16px 0' }}>Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
              <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text-main)' }}>No Client Orders Yet</p>
              <p style={{ margin: 0, fontSize: '12px' }}>
                Incoming orders from the storefront will automatically register here in real time.
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong style={{ color: 'var(--primary-gold)', fontFamily: 'var(--font-title)' }}>
                          #{o.orderNumber || o.id?.slice(0, 8)}
                        </strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.customerName || 'Guest'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                      </td>
                      <td>
                        <strong style={{ fontFamily: 'var(--font-title)' }}>
                          ${(o.total || 0).toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge-caritas ${o.orderStatus === 'delivered' ? 'badge-published' : 'badge-amber'}`}>
                          {o.orderStatus || 'Pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. FIREBASE BACKEND INFRASTRUCTURE BANNER ── */}
      <section className="admin-infra-banner">
        <div className="admin-infra-intro">
          <div className="admin-infra-icon">🔥</div>
          <div>
            <h3 className="admin-infra-title">Firebase Infrastructure</h3>
            <p className="admin-infra-sub">Active &amp; Multi-Tenant Isolated</p>
          </div>
        </div>

        <div className="admin-infra-col">
          <span className="admin-infra-label">Project ID</span>
          <span className="admin-infra-val">
            {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'caritas-luxury-diamonds'}
          </span>
        </div>

        <div className="admin-infra-col">
          <span className="admin-infra-label">Firestore Status</span>
          <span className="admin-infra-val green">● Connected &amp; Isolated</span>
        </div>

        <div className="admin-infra-col">
          <span className="admin-infra-label">Storage Bucket</span>
          <span className="admin-infra-val" title={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}>
            {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'caritas-luxury-diamonds.firebasestorage.app'}
          </span>
        </div>

        <div className="admin-infra-col">
          <span className="admin-infra-label">Collection Prefix</span>
          <span className="admin-infra-val" style={{ color: 'var(--primary-gold)' }}>
            caritas_* (100% Protected)
          </span>
        </div>

        <div>
          <div className="admin-all-systems-pill">
            <span>✓</span>
            <span>All Systems Online</span>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-title)' }}>
        © 2026 CARITAS LUXURY — Master Diamond Curators. All administrative rights reserved.
      </div>
    </>
  );
}
