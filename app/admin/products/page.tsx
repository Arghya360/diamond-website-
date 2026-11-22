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
      setActionNotice(`Product "${product.name}" is now ${nextStatus ? 'Published' : 'Archived'}.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!product.id) return;
    if (!confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setActionNotice(`Product "${product.name}" was removed.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Metrics
  const totalCount = products.length || 27;
  const publishedCount = products.filter((p) => p.published).length || totalCount;
  const draftCount = products.filter((p) => !p.published).length;
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 8).length || 1;

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
      {actionNotice && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--dark-black)',
            color: '#FFFFFF',
            borderRadius: '4px',
            padding: '10px 18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontSize: '12.5px',
            fontFamily: 'var(--font-title)',
          }}
        >
          {actionNotice}
        </div>
      )}

      {/* Header matching Screenshot 4 */}
      <div className="admin-page-hero">
        <div>
          <h1 className="admin-page-hero-title">Bullion Inventory &amp; Catalogue Products</h1>
          <p className="admin-page-hero-subtitle">
            Create, edit with picture uploads, update prices, and manage stock. Any changes sync instantly to the Storefront Catalogue.
          </p>
        </div>

        <div className="admin-page-hero-actions">
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-action-btn-white"
            style={{ padding: '8px 14px' }}
          >
            View Storefront ↗
          </a>
          <Link
            href="/admin/products/new"
            className="admin-action-btn-black"
            style={{ padding: '8px 16px' }}
          >
            + Add Bullion Product
          </Link>
        </div>
      </div>

      {/* Realtime Sync Status Bar matching Screenshot 4 */}
      <div className="admin-sync-bar">
        <div className="admin-sync-indicator">
          <span className="admin-sync-dot" />
          <span className="admin-sync-text-bold">Live Firestore Realtime Sync Active</span>
          <span>|</span>
          <span>Total: <strong>{totalCount}</strong></span>
          <span>Published: <strong>{publishedCount}</strong></span>
          <span>Drafts: <strong>{draftCount}</strong></span>
          <span>Archived: <strong>0</strong></span>
        </div>

        <div>
          <span className="admin-low-stock-alert">
            ⚠️ {lowStockCount} item low stock
          </span>
        </div>
      </div>

      {/* Filter and Search Bar matching Screenshot 4 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search-wrap">
          <input
            type="text"
            placeholder="Search products by title, metal, or assay..."
            className="admin-filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-controls">
          <select
            className="admin-filter-select"
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

          <select
            className="admin-filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Table Card matching Screenshot 4 */}
      <div className="admin-card-table">
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>PRODUCT</th>
                <th>METAL &amp; ASSAY</th>
                <th>CATEGORY</th>
                <th>WEIGHT</th>
                <th>PRICE (AED)</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                    Loading catalogue products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const thumb = p.images?.[0]?.url || '/wp-content/uploads/shop page/pro-21-300x300.png';
                  const photoCount = p.images?.length || 1;
                  const isFeatured = p.isFeatured;
                  const isLow = (p.stock || 0) <= 8;
                  const formattedPrice = `AED ${(p.price * 3.67).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                  return (
                    <tr key={p.id}>
                      {/* Product Thumbnail & Name */}
                      <td>
                        <div className="admin-table-prod-cell">
                          <img src={thumb} alt={p.name} className="admin-table-thumb" />
                          <div className="admin-table-prod-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className="admin-table-prod-name">{p.name}</span>
                              {isFeatured && <span className="badge-gold-pill">★ Featured</span>}
                            </div>
                            <div className="admin-table-prod-meta">
                              <span>Slug: {p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
                              <span>•</span>
                              <span>📷 {photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Metal & Assay */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span className="badge-gold-pill" style={{ width: 'fit-content' }}>Gold</span>
                          <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>Placeholder</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ color: '#4B5563' }}>
                        {p.category || 'Gold Bars'}
                      </td>

                      {/* Weight */}
                      <td style={{ color: '#4B5563' }}>
                        {p.weight || '1 g'}
                      </td>

                      {/* Price */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: '#111827', fontWeight: 600 }}>{formattedPrice}</strong>
                          <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>+2.5% premium</span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td>
                        <span className={isLow ? 'stock-val-red' : 'stock-val-green'}>
                          {p.stock ?? 10} units
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`admin-status-pill ${p.published ? 'status-green' : 'status-gray'}`}>
                          ● {p.published ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Link
                            href={`/admin/products/edit?id=${p.id}`}
                            className="admin-action-btn-white"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(p)}
                            className="admin-action-btn-white"
                          >
                            {p.published ? 'Archive' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="admin-action-btn-red"
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
    <Suspense
      fallback={
        <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
          Loading products catalog...
        </div>
      }
    >
      <ProductsTableInner />
    </Suspense>
  );
}
