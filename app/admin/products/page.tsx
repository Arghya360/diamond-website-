'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, updateProduct, deleteProduct } from '../../../lib/firebase/admin-service';
import type { Product } from '../../../types/admin';

const C = {
  primary: '#003629', secondary: '#725B38', surface: '#faf8ff', surfaceLow: '#F2F3FF',
  card: '#FFFFFF', onSurface: '#131B2E', outline: '#707974', variant: '#404945',
  border: '#EAEDFF', primaryFixed: '#BAEED9', onPrimaryFixed: '#002117',
  secondaryFixed: '#FEDEB2', onSecondaryFixed: '#78603E', container: '#EAEDFF',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    try { setProducts(await getProducts()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const showNotice = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(null), 2800); };

  const togglePublish = async (p: Product) => {
    if (!p.id) return;
    const next = !p.published;
    await updateProduct(p.id, { published: next });
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, published: next } : x));
    showNotice(`"${p.name}" ${next ? 'published' : 'moved to draft'}.`);
  };

  const removeProduct = async (p: Product) => {
    if (!p.id || !confirm(`Delete "${p.name}"?`)) return;
    await deleteProduct(p.id);
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    showNotice(`"${p.name}" deleted.`);
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category || 'Uncategorised').filter(Boolean)))];

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || (statusFilter === 'Published' ? p.published !== false : p.published === false);
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const published = products.filter((p) => p.published !== false).length;
  const draft = products.filter((p) => p.published === false).length;
  const lowStock = products.filter((p) => (p.stock ?? 100) <= 3).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {notice && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: C.primary, color: '#FFF', padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 9999, fontSize: 13, fontWeight: 600 }}>
          {notice}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
            <span style={{ color: C.secondary }}>Atelier Haute Joaillerie</span>
            <span style={{ color: C.outline }}>/</span>
            <span style={{ color: C.outline }}>Product Catalogue</span>
          </div>
          <h1 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 500, color: C.onSurface, margin: 0, letterSpacing: '-0.5px' }}>
            Jewellery Products Catalogue
          </h1>
          <p style={{ color: C.variant, fontSize: 13, marginTop: 4 }}>
            Create, edit, and manage jewellery pieces. Changes sync instantly to the live Caritas storefront.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <a href="/shop" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, background: C.card, color: C.onSurface, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.secondary }}>storefront</span>
            View Storefront ↗
          </a>
          <Link href="/admin/products/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: C.primary, color: '#FFF', fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,54,41,0.2)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.primaryFixed }}>add_circle</span>
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }}></span>
          <span style={{ fontWeight: 600, color: C.primary }}>Live Firestore Realtime Sync Active</span>
        </div>
        <span style={{ color: C.outline }}>|</span>
        <span style={{ color: C.variant }}>Total: <strong style={{ color: C.onSurface }}>{products.length}</strong></span>
        <span style={{ color: C.variant }}>Published: <strong style={{ color: '#003629' }}>{published}</strong></span>
        <span style={{ color: C.variant }}>Draft: <strong style={{ color: C.secondary }}>{draft}</strong></span>
        {lowStock > 0 && (
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, background: '#FFF3CD', color: '#8A6900', fontSize: 12, fontWeight: 700 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
            {lowStock} item{lowStock > 1 ? 's' : ''} low stock
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total Products', value: products.length, sub: `${published} Published · ${draft} Draft`, icon: 'auto_awesome', bg: C.primaryFixed, fg: C.onPrimaryFixed },
          { label: 'Published Live', value: published, sub: 'Active in storefront', icon: 'visibility', bg: C.primaryFixed, fg: C.onPrimaryFixed },
          { label: 'Draft / Hidden', value: draft, sub: 'Not visible to customers', icon: 'edit_note', bg: C.secondaryFixed, fg: C.onSecondaryFixed },
          { label: 'Low Stock Alerts', value: lowStock, sub: '3 or fewer units remain', icon: 'warning', bg: lowStock > 0 ? '#FFF3CD' : C.container, fg: lowStock > 0 ? '#8A6900' : C.onSurface },
        ].map((card) => (
          <div key={card.label} style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.outline }}>{card.label}</span>
              <span style={{ padding: 4, borderRadius: 6, background: card.bg, color: card.fg }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>{card.icon}</span></span>
            </div>
            <span style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 600, color: C.onSurface }}>{card.value}</span>
            <div style={{ marginTop: 4, fontSize: 12, color: C.outline }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: C.outline }}>search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products by title, SKU..." style={{ width: '100%', height: 40, paddingLeft: 36, paddingRight: 12, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 13, color: C.onSurface, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ height: 40, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 13, color: C.onSurface, outline: 'none', cursor: 'pointer' }}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
        </select>
        <div style={{ display: 'inline-flex', background: C.surfaceLow, borderRadius: 8, padding: 3, gap: 2 }}>
          {(['All', 'Published', 'Draft'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: statusFilter === s ? C.card : 'transparent', color: statusFilter === s ? C.primary : C.variant, fontSize: 13, fontWeight: statusFilter === s ? 700 : 500, cursor: 'pointer', boxShadow: statusFilter === s ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.surfaceLow }}>
                {['Product', 'Category', 'Price (USD)', 'Stock', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: i === 5 ? 'right' : 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: C.outline, fontSize: 14 }}>Loading products...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: C.outline, fontSize: 14 }}>No products found. <Link href="/admin/products/new" style={{ color: C.primary, fontWeight: 600 }}>Add the first product →</Link></td></tr>
              ) : filtered.map((p) => {
                const isPublished = p.published !== false;
                const isLow = (p.stock ?? 100) <= 3;
                const thumb = p.images?.[0]?.url || (p as any).mainImage || '';
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.12s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: C.surfaceLow, flexShrink: 0 }}>
                          {thumb ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 22, color: C.outline }}>diamond</span></div>}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.onSurface }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: C.outline }}>Slug: {p.slug || p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: C.variant }}>{p.category || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: C.onSurface }}>{p.price ? `$${Number(p.price).toLocaleString()}` : '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isLow ? '#BA1A1A' : C.onSurface }}>{p.stock ?? '—'}</span>
                      {isLow && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: '#FFD6D6', color: '#BA1A1A' }}>LOW</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: isPublished ? C.primaryFixed : C.secondaryFixed, color: isPublished ? C.onPrimaryFixed : C.onSecondaryFixed }}>
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <Link href={`/admin/products/edit?id=${p.id}`} style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.card, color: C.onSurface, fontSize: 12, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>Edit</Link>
                        <button onClick={() => void togglePublish(p)} style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.surfaceLow, color: C.variant, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{isPublished ? 'Archive' : 'Publish'}</button>
                        <button onClick={() => void removeProduct(p)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #FFD6D6', background: '#FFF5F5', color: '#BA1A1A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
