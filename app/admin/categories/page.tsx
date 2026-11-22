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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Category Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Manage diamond and fine jewellery categories shown on the /shop banner grid and navigation.
          </p>
        </div>

        <button onClick={openAddModal} className="btn-gold">
          <span>+</span> Add Category
        </button>
      </div>

      {notice && (
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
          {notice}
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Banner</th>
              <th>Category Name & Slug</th>
              <th>Subcategories</th>
              <th>Items Label</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  No categories found. Click "Add Category" to create your first category.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div
                      style={{
                        width: '70px',
                        height: '46px',
                        borderRadius: '6px',
                        backgroundColor: '#1a2226',
                        backgroundImage: cat.image ? `url("${cat.image}")` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid var(--admin-border)',
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{cat.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>/{cat.slug}</div>
                  </td>
                  <td>
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {cat.subcategories.map((sub, i) => (
                          <span key={i} className="badge-status badge-gold" style={{ fontSize: '10px' }}>
                            {sub}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--admin-muted)', fontSize: '12px' }}>None</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: 'var(--admin-muted)', fontSize: '12px' }}>
                      {cat.itemsCountText || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <strong>#{cat.displayOrder || 1}</strong>
                  </td>
                  <td>
                    <span className={`badge-status ${cat.published ? 'badge-published' : 'badge-draft'}`}>
                      {cat.published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(cat)}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="btn-danger"
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

      {/* Modal Dialog */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 200,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--admin-text)' }}>
                {editingCat ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
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
                <label className="admin-label">Subcategories (comma separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Solitaire, Halo, Eternity Bands, Three-Stone"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Category Banner Image</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="URL or select image to upload..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <label
                    className="btn-secondary"
                    style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '9px 12px', fontSize: '13px' }}
                  >
                    Upload File
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </label>
                </div>
                {image && (
                  <div
                    style={{
                      height: '80px',
                      borderRadius: '6px',
                      backgroundImage: `url("${image}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid var(--admin-border)',
                    }}
                  />
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    className="admin-input"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  />
                </div>

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
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  placeholder="Category description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    style={{ accentColor: 'var(--admin-gold)' }}
                  />
                  Published on Website
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={textDark}
                    onChange={(e) => setTextDark(e.target.checked)}
                    style={{ accentColor: 'var(--admin-gold)' }}
                  />
                  Use Dark Text (for light card backgrounds)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold"
                >
                  {saving ? 'Saving...' : editingCat ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
