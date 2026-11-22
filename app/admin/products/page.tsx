'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProducts, updateProduct, deleteProduct, getCategories } from '../../../lib/firebase/admin-service';
import type { Product, Category } from '../../../types/admin';

function ProductsTableInner() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleTogglePublish = async (product: Product) => {
    if (!product.id) return;
    const nextStatus = !product.published;
    try {
      await updateProduct(product.id, { published: nextStatus });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, published: nextStatus } : p))
      );
      setActionNotice(`Product "${product.name}" is now ${nextStatus ? 'Published' : 'Draft'}.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!product.id) return;
    if (!confirm(`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setActionNotice(`Product "${product.name}" was successfully removed.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'published' && p.published) ||
      (selectedStatus === 'draft' && !p.published);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <>
      {/* Toast Notice */}
      {actionNotice && (
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
          }}
        >
          {actionNotice}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— INVENTORY &amp; MERCHANDISING</span>
          <h1 className="admin-hero-title">Fine Jewelry Catalog</h1>
          <p className="admin-hero-subtitle">
            Manage your bespoke diamond pieces, pricing, vault availability, and showcase visibility on the live storefront.
          </p>
        </div>

        <div className="admin-hero-actions">
          <Link href="/admin/products/new" className="btn-caritas-gold">
            <span>+</span>
            <span>Create New Piece</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px' }}>
            <input
              type="text"
              placeholder="Search pieces by title, SKU, or category..."
              className="admin-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '190px' }}>
            <select
              className="admin-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '160px' }}>
            <select
              className="admin-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {(search || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="btn-caritas-secondary"
              style={{ padding: '9px 16px' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table Card */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '56px' }}>Piece</th>
                <th>Title &amp; Reference</th>
                <th>Category</th>
                <th>Vault Price</th>
                <th>Inventory</th>
                <th>Storefront Status</th>
                <th>Merchandising</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    Loading Caritas catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>💎</div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text-main)' }}>No matching pieces found</p>
                    <p style={{ margin: 0, fontSize: '12px' }}>Adjust your search query or reset filter options.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const mainImg = p.images?.[0]?.url || '/wp-content/uploads/shop page/pro-21-300x300.png';
                  return (
                    <tr key={p.id}>
                      <td>
                        <div
                          className="admin-prod-thumb"
                          style={{ backgroundImage: `url("${mainImg}")` }}
                        />
                      </td>
                      <td>
                        <div className="admin-prod-name">{p.name}</div>
                        <div className="admin-prod-meta">
                          SKU: {p.sku || 'N/A'} • Slug: /{p.slug}
                        </div>
                      </td>
                      <td>
                        <span className="badge-caritas badge-gold">{p.category}</span>
                        {p.subcategory && (
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                            {p.subcategory}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-title)' }}>
                          ${(p.price || 0).toLocaleString()}
                        </div>
                        {p.salePrice && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ${(p.salePrice || 0).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            color: (p.stock || 0) > 3 ? 'var(--emerald)' : (p.stock || 0) > 0 ? 'var(--amber)' : 'var(--crimson)',
                            fontWeight: 700,
                            fontFamily: 'var(--font-title)',
                          }}
                        >
                          {p.stock ?? 0} in stock
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleTogglePublish(p)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          title="Click to toggle published / draft state"
                        >
                          <span className={`badge-caritas ${p.published ? 'badge-published' : 'badge-draft'}`}>
                            {p.published ? '● Published' : '○ Draft'}
                          </span>
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {p.isFeatured && <span className="badge-caritas badge-gold" title="Featured piece">⭐ Featured</span>}
                          {p.isNewArrival && <span className="badge-caritas badge-blue">New Arrival</span>}
                          {p.isTrending && <span className="badge-caritas badge-amber">Trending</span>}
                          {p.badge && <span className="badge-caritas badge-gold">{p.badge}</span>}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <Link
                            href={`/admin/products/edit?id=${p.id}`}
                            className="btn-caritas-secondary"
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p)}
                            className="btn-caritas-danger"
                            title="Delete piece permanently"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="admin-card" style={{ padding: '32px', textAlign: 'center' }}>Loading products...</div>}>
      <ProductsTableInner />
    </Suspense>
  );
}
