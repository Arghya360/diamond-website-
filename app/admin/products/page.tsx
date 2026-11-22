'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, updateProduct, deleteProduct, getCategories } from '../../../lib/firebase/admin-service';
import type { Product, Category } from '../../../types/admin';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
      setActionNotice(`Product "${product.name}" is now ${nextStatus ? 'Published' : 'Unpublished (Draft)'}.`);
      setTimeout(() => setActionNotice(null), 3500);
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
      setActionNotice(`Product "${product.name}" was successfully deleted.`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'published' && p.published) ||
      (selectedStatus === 'draft' && !p.published);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Product Catalog Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Add, update, publish, or delete products displayed on the live /shop page.
          </p>
        </div>

        <Link href="/admin/products/new" className="btn-gold">
          <span>+</span> Add New Product
        </Link>
      </div>

      {actionNotice && (
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
          }}
        >
          {actionNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px' }}>
            <input
              type="text"
              placeholder="Search products by title, SKU, or category..."
              className="admin-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
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
              <option value="published">Published</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>

          {(search || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="btn-secondary"
              style={{ padding: '9px 14px' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table Card */}
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Image</th>
              <th>Product Name & Details</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Highlights</th>
              <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  Loading product catalog...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  No products matched your criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const mainImg = p.images?.[0]?.url || '/wp-content/uploads/shop page/pro-21-300x300.png';
                return (
                  <tr key={p.id}>
                    <td>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '6px',
                          backgroundColor: '#1a2226',
                          backgroundImage: `url("${mainImg}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: '1px solid var(--admin-border)',
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text)', marginBottom: '3px' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                        SKU: {p.sku || 'N/A'} • Slug: /{p.slug}
                      </div>
                    </td>
                    <td>
                      <span className="badge-status badge-gold">{p.category}</span>
                      {p.subcategory && (
                        <div style={{ fontSize: '11px', color: 'var(--admin-muted)', marginTop: '2px' }}>
                          {p.subcategory}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                        ${(p.price || 0).toLocaleString()}
                      </div>
                      {p.salePrice && (
                        <div style={{ fontSize: '11px', color: 'var(--admin-muted)', textDecoration: 'line-through' }}>
                          ${(p.salePrice || 0).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          color: (p.stock || 0) > 3 ? '#34d399' : (p.stock || 0) > 0 ? '#fbbf24' : '#f87171',
                          fontWeight: 600,
                        }}
                      >
                        {p.stock ?? 0} in stock
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(p)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title="Click to toggle publish status"
                      >
                        <span className={`badge-status ${p.published ? 'badge-published' : 'badge-draft'}`}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {p.isFeatured && <span className="badge-status badge-gold">Featured</span>}
                        {p.isNewArrival && <span className="badge-status badge-gold">New</span>}
                        {p.isTrending && <span className="badge-status badge-gold">Trending</span>}
                        {p.badge && <span className="badge-status badge-gold">{p.badge}</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link
                          href={`/admin/products/edit?id=${p.id}`}
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          className="btn-danger"
                          title="Delete product"
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
  );
}
