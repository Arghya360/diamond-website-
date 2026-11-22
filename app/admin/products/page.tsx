'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, updateProduct, deleteProduct, getCategories } from '../../../lib/firebase/admin-service';
import type { Product, Category } from '../../../types/admin';

const THUMB_COLORS = ['', 'teal', 'rose', 'green', '', 'teal', 'rose'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const showNotice = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(null), 3500); };

  const handleTogglePublish = async (p: Product) => {
    if (!p.id) return;
    const next = !p.published;
    await updateProduct(p.id, { published: next });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, published: next } : x));
    showNotice(`"${p.name}" is now ${next ? 'Published' : 'Draft'}.`);
  };

  const handleDelete = async (p: Product) => {
    if (!p.id || !confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await deleteProduct(p.id);
    setProducts(prev => prev.filter(x => x.id !== p.id));
    showNotice(`"${p.name}" deleted.`);
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (!q || p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q)) &&
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (selectedStatus === 'All' || (selectedStatus === 'published' ? p.published : !p.published));
  });

  return (
    <>
      {notice && (
        <div style={{ position: 'fixed', bottom: 22, right: 22, background: '#1c1c1c', color: '#fff', padding: '12px 16px', borderRadius: 8, fontSize: 13, zIndex: 999 }}>{notice}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ font: '600 28px Playfair Display, Georgia, serif', margin: '0 0 4px' }}>Product Catalog</h1>
          <p style={{ margin: 0, color: '#777b82', fontSize: 13 }}>Manage products displayed on the live /shop page.</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold"><span>＋</span> Add New Product</Link>
      </div>

      {/* Filters */}
      <div className="al-card" style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <input type="text" placeholder="Search by name or SKU…" className="admin-input" style={{ flex: '1 1 220px' }} value={search} onChange={e => setSearch(e.target.value)} />
          <select className="admin-select" style={{ width: 170 }} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select className="admin-select" style={{ width: 150 }} value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {(search || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button className="btn-secondary" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedStatus('All'); }}>Reset</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="al-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="al">
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Flags</th>
              <th style={{ textAlign: 'right', paddingRight: 16 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 36, color: '#777' }}>Loading products…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 36, color: '#777' }}>No products matched your filters.</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id}>
                <td style={{ width: 44 }}>
                  <span className={`al-thumb ${THUMB_COLORS[i % THUMB_COLORS.length]}`}>♢</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#191817', fontSize: 12 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>SKU: {p.sku || 'N/A'}</div>
                </td>
                <td><span className="badge-gold">{p.category}</span></td>
                <td className="al-price">${(p.price || 0).toLocaleString()}</td>
                <td style={{ color: (p.stock || 0) > 3 ? '#167747' : '#d52e38', fontWeight: 600, fontSize: 12 }}>{p.stock ?? 0}</td>
                <td>
                  <button onClick={() => handleTogglePublish(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <span className={`al-status ${p.published ? 'published' : 'draft'}`}>{p.published ? 'Published' : 'Draft'}</span>
                  </button>
                </td>
                <td style={{ fontSize: 10 }}>
                  {p.isFeatured && <span className="badge-gold" style={{ marginRight: 3 }}>⭐</span>}
                  {p.isNewArrival && <span className="badge-gold" style={{ marginRight: 3 }}>NEW</span>}
                  {p.isTrending && <span className="badge-gold">🔥</span>}
                </td>
                <td style={{ textAlign: 'right', paddingRight: 16 }}>
                  <Link href={`/admin/products/edit?id=${p.id}`} className="al-rowbtn" title="Edit" style={{ textDecoration: 'none' }}>✎</Link>
                  <button className="al-rowbtn" title="Delete" onClick={() => handleDelete(p)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
