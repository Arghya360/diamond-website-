'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, getOrders } from '../../lib/firebase/admin-service';
import { seedAllWebsiteData } from '../../lib/firebase/seed-data';
import type { Product, Category, Order } from '../../types/admin';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
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
    loadData();
  }, []);

  const handleSeedData = async () => {
    if (!confirm('This will seed the existing website data (products, categories, shop settings, slides) into Firebase Firestore. Continue?')) {
      return;
    }
    setSeeding(true);
    setSeedNotice(null);
    try {
      const res = await seedAllWebsiteData(true);
      setSeedNotice(res.message);
      // Reload dashboard data
      const [prods, cats, ords] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
    } catch (err: any) {
      setSeedNotice('Failed to seed: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const draftProducts = products.filter((p) => !p.published).length;
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= 3);
  const recentProducts = products.slice(0, 5);

  return (
    <div>
      {/* Top Banner / Heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Website Overview
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Real-time management portal for Caritas Luxury Diamonds & Fine Jewellery.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="btn-secondary"
            title="Populate Firebase with all initial hardcoded website content"
          >
            {seeding ? 'Syncing...' : '⚡ Sync / Seed Existing Data'}
          </button>
          <Link href="/admin/products/new" className="btn-gold">
            <span>+</span> Add New Product
          </Link>
        </div>
      </div>

      {seedNotice && (
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '13px',
          }}
        >
          {seedNotice}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Total Products */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Products
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: 'var(--admin-text)' }}>
                {loading ? '...' : totalProducts}
              </div>
            </div>
            <span style={{ fontSize: '24px' }}>💎</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--admin-muted)' }}>
            <span style={{ color: '#34d399' }}>{publishedProducts} Published</span> • {draftProducts} Draft
          </div>
        </div>

        {/* Categories */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Categories
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: 'var(--admin-text)' }}>
                {loading ? '...' : categories.length}
              </div>
            </div>
            <span style={{ fontSize: '24px' }}>🏷️</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--admin-gold)' }}>
            Active on /shop and navigation
          </div>
        </div>

        {/* Orders */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Orders
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: 'var(--admin-text)' }}>
                {loading ? '...' : orders.length}
              </div>
            </div>
            <span style={{ fontSize: '24px' }}>📦</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--admin-muted)' }}>
            {orders.filter((o) => o.orderStatus === 'pending').length} Pending fulfillment
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Low Stock Alerts
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: lowStockProducts.length > 0 ? '#f87171' : 'var(--admin-text)' }}>
                {loading ? '...' : lowStockProducts.length}
              </div>
            </div>
            <span style={{ fontSize: '24px' }}>⚠️</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--admin-muted)' }}>
            Items with 3 or fewer units
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="admin-card">
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--admin-text)' }}>
          Quick Website Management Actions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/admin/products/new" className="btn-secondary">
            + Add New Product
          </Link>
          <Link href="/admin/categories" className="btn-secondary">
            🏷️ Manage Categories
          </Link>
          <Link href="/admin/shop" className="btn-secondary">
            🛍️ Edit Shop Page Settings
          </Link>
          <Link href="/admin/content" className="btn-secondary">
            🖼️ Update Hero Slides & Banners
          </Link>
          <Link href="/admin/navigation" className="btn-secondary">
            🧭 Reorder Navigation Menu
          </Link>
          <Link href="/admin/footer" className="btn-secondary">
            📄 Edit Footer & Social Links
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Products & System Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Recent Products */}
        <div className="admin-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--admin-text)' }}>
              Recent Products
            </h3>
            <Link href="/admin/products" style={{ color: 'var(--admin-gold)', fontSize: '12px', textDecoration: 'none' }}>
              View All ({totalProducts}) →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>Loading products...</p>
          ) : recentProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--admin-muted)' }}>
              <p style={{ margin: '0 0 12px', fontSize: '14px' }}>No products found in Firebase.</p>
              <button onClick={handleSeedData} className="btn-gold" style={{ fontSize: '12px' }}>
                Seed Website Products Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#0c1315',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        backgroundColor: '#1a2226',
                        backgroundImage: p.images?.[0]?.url ? `url("${p.images[0].url}")` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                        {p.category} • ${(p.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge-status ${p.published ? 'badge-published' : 'badge-draft'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      href={`/admin/products/edit?id=${p.id}`}
                      style={{
                        color: 'var(--admin-gold)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--admin-border)',
                        fontSize: '11px',
                        textDecoration: 'none',
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backend & Firebase Live Status */}
        <div className="admin-card" style={{ margin: 0 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--admin-text)' }}>
            Firebase Backend Infrastructure Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--admin-border)' }}>
              <span style={{ color: 'var(--admin-muted)' }}>Firebase Project ID:</span>
              <strong style={{ color: 'var(--admin-text)' }}>hopeful-dryad-l9brs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--admin-border)' }}>
              <span style={{ color: 'var(--admin-muted)' }}>Database (Firestore):</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>● Connected & Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--admin-border)' }}>
              <span style={{ color: 'var(--admin-muted)' }}>Media Storage (Bucket):</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>● hopeful-dryad-l9brs.firebasestorage.app</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--admin-border)' }}>
              <span style={{ color: 'var(--admin-muted)' }}>Authentication Provider:</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>● Email/Password Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--admin-muted)' }}>Master Administrator:</span>
              <span style={{ color: 'var(--admin-gold)', fontWeight: 600 }}>arghyabiswas0792@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
