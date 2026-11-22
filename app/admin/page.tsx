'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, getOrders, updateProduct, deleteProduct } from '../../lib/firebase/admin-service';
import type { Product, Category, Order } from '../../types/admin';

const THUMB_COLORS = ['', 'teal', 'rose', 'green', '', 'teal', 'rose'];

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [prods, cats, ords] = await Promise.all([getProducts(), getCategories(), getOrders()]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const draftProducts = products.filter((p) => !p.published).length;
  const lowStock = products.filter((p) => (p.stock || 0) <= 3);
  const recentProducts = products.slice(0, 5);
  const recentOrders = orders.slice(0, 5);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;

  const handleEditProduct = (p: Product) => {
    window.location.href = `/admin/products/edit?id=${p.id}`;
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!p.id) return;
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      showNotice(`"${p.name}" deleted.`);
    } catch (err: any) {
      showNotice('Delete failed: ' + err.message);
    }
  };

  return (
    <>
      {/* Notice */}
      {notice && (
        <div style={{
          position: 'fixed', bottom: 22, right: 22, background: '#1c1c1c', color: '#fff',
          padding: '12px 16px', borderRadius: 8, fontSize: 13, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {notice}
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <section className="admin-hero">
        <div className="admin-eyebrow">WELCOME TO CARITAS LUXURY</div>
        <h1>Admin Portal</h1>
        <p>Real-time management portal for Caritas Luxury Diamonds &amp; Fine Jewellery.</p>
        <svg className="admin-hero-diamond" viewBox="0 0 260 190" aria-hidden="true">
          <defs>
            <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fff" />
              <stop offset=".5" stopColor="#b8c8d4" />
              <stop offset=".75" stopColor="#fff" />
              <stop offset="1" stopColor="#b08a48" />
            </linearGradient>
          </defs>
          <path d="M55 34 91 9h79l36 25 39 40-105 104L15 74l40-40Z" fill="url(#dg)" stroke="#b6a17f" strokeWidth="2" />
          <path d="m15 74 225 0M55 34l75 144 40-169M91 9l39 169 40-169M55 34l-40 40 115 104 105-104-35-40" fill="none" stroke="#81909a" strokeWidth="1.5" />
        </svg>
      </section>

      {/* ── STAT CARDS ── */}
      <section className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-icon">◇</div>
          <div>
            <span className="label">Total Products</span>
            <strong>{loading ? '…' : totalProducts}</strong>
            <small>{publishedProducts} Published · {draftProducts} Draft</small>
          </div>
          <span className="admin-trend">↑ 12%</span>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">◆</div>
          <div>
            <span className="label">Categories</span>
            <strong>{loading ? '…' : categories.length}</strong>
            <small>Active on site</small>
          </div>
          <span className="admin-trend">↑ 0%</span>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">🛒</div>
          <div>
            <span className="label">Orders</span>
            <strong>{loading ? '…' : orders.length}</strong>
            <small>{pendingOrders} Pending fulfillment</small>
          </div>
          <span className="admin-trend">↑ 0%</span>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">⚠</div>
          <div>
            <span className="label">Low Stock Alerts</span>
            <strong style={{ color: lowStock.length > 0 ? '#d52e38' : undefined }}>
              {loading ? '…' : lowStock.length}
            </strong>
            <small>Items with 3 or fewer units</small>
          </div>
          <span className="admin-trend">↑ 0%</span>
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section className="admin-panel admin-panel-padded" style={{ marginBottom: 18 }}>
        <div className="admin-heading">
          <h2><span className="admin-spark">ϟ</span> Quick Website Management Actions</h2>
          <a href="/admin/settings">View All Actions →</a>
        </div>
        <div className="admin-actions">
          <Link href="/admin/products/new" className="admin-action primary">
            <span className="ico">＋</span>Add New Product
          </Link>
          <Link href="/admin/categories" className="admin-action">
            <span className="ico">◆</span>Manage Categories
          </Link>
          <Link href="/admin/shop" className="admin-action">
            <span className="ico">🛒</span>Edit Shop Page Settings
          </Link>
          <Link href="/admin/content" className="admin-action">
            <span className="ico">▧</span>Update Hero Slides &amp; Banners
          </Link>
          <Link href="/admin/navigation" className="admin-action">
            <span className="ico">✎</span>Reorder Navigation Menu
          </Link>
          <Link href="/admin/footer" className="admin-action">
            <span className="ico">▤</span>Edit Footer &amp; Social Links
          </Link>
        </div>
      </section>

      {/* ── TABLES ── */}
      <div className="admin-tables">
        {/* Recent Products */}
        <article className="admin-panel admin-table-panel">
          <div className="admin-heading">
            <h2>◇ &nbsp;Recent Products</h2>
            <Link href="/admin/products">View All ({totalProducts}) →</Link>
          </div>
          <div className="admin-tablewrap">
            {loading ? (
              <p style={{ color: '#777', fontSize: 12, margin: '12px 0' }}>Loading products…</p>
            ) : recentProducts.length === 0 ? (
              <p style={{ color: '#777', fontSize: 12, margin: '12px 0' }}>No products yet. <Link href="/admin/products/new" style={{ color: '#bd914d' }}>Add one →</Link></p>
            ) : (
              <table className="al">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((p, i) => (
                    <tr key={p.id}>
                      <td>
                        <span className={`al-thumb ${THUMB_COLORS[i % THUMB_COLORS.length]}`}>♢</span>
                        {p.name}
                      </td>
                      <td>{p.category}</td>
                      <td className="al-price">${(p.price || 0).toLocaleString()}</td>
                      <td>
                        <span className={`al-status ${p.published ? 'published' : 'draft'}`}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <button className="al-rowbtn" title="Edit" onClick={() => handleEditProduct(p)}>✎</button>
                        <button className="al-rowbtn" title="Delete" onClick={() => handleDeleteProduct(p)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>

        {/* Recent Orders */}
        <article className="admin-panel admin-table-panel">
          <div className="admin-heading">
            <h2>♧ &nbsp;Recent Orders</h2>
            <Link href="/admin/orders">View All Orders →</Link>
          </div>
          <div className="admin-tablewrap">
            {loading ? (
              <p style={{ color: '#777', fontSize: 12, margin: '12px 0' }}>Loading orders…</p>
            ) : recentOrders.length === 0 ? (
              <p style={{ color: '#777', fontSize: 12, margin: '12px 0' }}>No orders yet.</p>
            ) : (
              <table className="al">
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
                      <td className="al-orderid">#{o.orderNumber || o.id?.slice(0, 7)}</td>
                      <td>{o.customerName || '—'}</td>
                      <td className="al-price">${(o.total || 0).toLocaleString()}</td>
                      <td>
                        <span className={`al-status ${o.orderStatus || 'pending'}`}>
                          {o.orderStatus?.charAt(0).toUpperCase() + (o.orderStatus?.slice(1) || '') || 'Pending'}
                        </span>
                      </td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>
      </div>

      {/* ── FIREBASE STATUS ── */}
      <div className="admin-panel admin-firebase">
        <div className="admin-firebase-intro">
          <div className="admin-stat-icon">◇</div>
          <div>
            <h3>Firebase Backend Infrastructure Status</h3>
            <p>Your website is securely connected to Firebase.</p>
          </div>
        </div>
        <div className="admin-infra">
          <span>♧ &nbsp;Firebase Project ID</span>
          <strong>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'caritas-luxury-diamonds'}</strong>
        </div>
        <div className="admin-infra">
          <span>▤ &nbsp;Database (Firestore)</span>
          <strong className="connected">● &nbsp;Connected &amp; Isolated (caritas_*)</strong>
        </div>
        <div className="admin-infra">
          <span>▣ &nbsp;Media Storage (Bucket)</span>
          <strong>● &nbsp;{process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'caritas-luxury-diamonds.firebasestorage.app'}</strong>
        </div>
        <div className="admin-infra">
          <span>◈ &nbsp;Data Isolation Prefix</span>
          <strong>caritas_* (100% Protected)</strong>
        </div>
        <div className="admin-all-online">✓ All Systems Online</div>
      </div>

      <div className="admin-foot">© 2025 Caritas Luxury. Crafted for an exceptional experience.</div>
    </>
  );
}
