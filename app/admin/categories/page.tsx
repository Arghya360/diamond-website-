'use client';

import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, uploadFileToStorage } from '../../../lib/firebase/admin-service';
import type { Category } from '../../../types/admin';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [itemsCountText, setItemsCountText] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [published, setPublished] = useState(true);
  const [textDark, setTextDark] = useState(false);
  const [subcategoriesStr, setSubcategoriesStr] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('/wp-content/uploads/shop page/banner-01.jpg');
    setItemsCountText('5 Items');
    setDisplayOrder(categories.length + 1);
    setPublished(true);
    setTextDark(false);
    setSubcategoriesStr('');
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setItemsCountText(cat.itemsCountText || '');
    setDisplayOrder(cat.displayOrder || 1);
    setPublished(cat.published !== false);
    setTextDark(!!cat.textDark);
    setSubcategoriesStr(cat.subcategories ? cat.subcategories.join(', ') : '');
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFileToStorage(file, 'categories');
      setImage(url);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const subcats = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const catData: Omit<Category, 'id'> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      itemsCountText: itemsCountText.trim() || undefined,
      displayOrder: Number(displayOrder) || 1,
      published,
      textDark,
      subcategories: subcats,
    };

    try {
      if (editingCat?.id) {
        await updateCategory(editingCat.id, catData);
        setNotice(`Category "${name}" updated successfully.`);
      } else {
        await createCategory(catData);
        setNotice(`Category "${name}" created successfully.`);
      }
      setShowModal(false);
      await loadCategories();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error saving category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!cat.id) return;
    if (!confirm(`Delete category "${cat.name}"? Products in this category will not be deleted.`)) return;
    try {
      await deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setNotice(`Category "${cat.name}" deleted.`);
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error deleting category: ' + err.message);
    }
  };

  return (
    <>
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
          }}
        >
          {notice}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— MERCHANDISE ARCHITECTURE</span>
          <h1 className="admin-hero-title">Diamond Jewelry Categories</h1>
          <p className="admin-hero-subtitle">
            Configure diamond categories, banner cards, subcategory filters, and storefront navigation hierarchy.
          </p>
        </div>

        <div className="admin-hero-actions">
          <button onClick={openAddModal} className="btn-caritas-gold">
            <span>+</span>
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table Card */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '56px' }}>Banner</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Subcategories</th>
                <th>Item Count Text</th>
                <th>Display Order</th>
                <th>Storefront Status</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏷️</div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text-main)' }}>No categories configured</p>
                    <button onClick={openAddModal} className="btn-caritas-gold" style={{ marginTop: '12px', fontSize: '12px' }}>
                      Add Your First Category
                    </button>
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id || c.name}>
                    <td>
                      <div
                        className="admin-prod-thumb"
                        style={{
                          backgroundImage: c.image ? `url("${c.image}")` : 'none',
                        }}
                      />
                    </td>
                    <td>
                      <div className="admin-prod-name">{c.name}</div>
                      {c.description && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '240px', whiteSpace: 'normal' }}>
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        /{c.slug}
                      </span>
                    </td>
                    <td>
                      {c.subcategories && c.subcategories.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '220px' }}>
                          {c.subcategories.map((sub, i) => (
                            <span key={i} className="badge-caritas badge-gold" style={{ fontSize: '10px' }}>
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
                        {c.itemsCountText || '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                        #{c.displayOrder || 1}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-caritas ${c.published !== false ? 'badge-published' : 'badge-draft'}`}>
                        {c.published !== false ? '● Live on Store' : '○ Draft'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(c)}
                          className="btn-caritas-secondary"
                          style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="btn-caritas-danger"
                          title="Delete category"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: CREATE / EDIT CATEGORY ── */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(12, 19, 21, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-line)',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-title)', fontSize: '18px', color: 'var(--dark-obsidian)' }}>
                {editingCat ? `Edit Category: ${editingCat.name}` : 'Create New Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Category Name *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Diamond ring"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Slug</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="diamond-ring"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  placeholder="Bespoke diamond engagement rings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Banner Image URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="/wp-content/uploads/shop page/banner-01.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <div style={{ marginTop: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '12px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-label">Items Count Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. 7 Items"
                    value={itemsCountText}
                    onChange={(e) => setItemsCountText(e.target.value)}
                  />
                </div>
                <div>
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    className="admin-input"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Subcategories (comma separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Engagement Rings, Eternity Bands, Solitaire Rings"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  <span>Published on Storefront</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={textDark}
                    onChange={(e) => setTextDark(e.target.checked)}
                  />
                  <span>Dark Text on Banner (for light images)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-line)' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-caritas-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-caritas-gold"
                >
                  {saving ? 'Saving Category...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
