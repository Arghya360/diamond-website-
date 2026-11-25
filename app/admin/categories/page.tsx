'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../lib/firebase/admin-service';
import ImageUpload from '../../../components/admin/ImageUpload';
import type { Category } from '../../../types/admin';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    setImage('/images/shop/banner-01.jpg');
    setItemsCountText('7 Items');
    setDisplayOrder(categories.length + 1);
    setPublished(true);
    setTextDark(false);
    setSubcategoriesStr('Engagement Rings, Eternity Bands, Solitaire Rings');
    setErrorMsg(null);
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImage(cat.image || '/images/shop/banner-01.jpg');
    setItemsCountText(cat.itemsCountText || '5 Items');
    setDisplayOrder(cat.displayOrder || 1);
    setPublished(cat.published !== false);
    setTextDark(!!cat.textDark);
    setSubcategoriesStr(cat.subcategories ? cat.subcategories.join(', ') : '');
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat || !slug || slug === editingCat.slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Category title is required.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const subcategories = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Category> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      image: image || '/images/shop/banner-01.jpg',
      itemsCountText: itemsCountText.trim() || '5 Items',
      displayOrder: Number(displayOrder) || 1,
      published,
      textDark,
      subcategories,
    };

    try {
      if (editingCat && editingCat.id) {
        await updateCategory(editingCat.id, payload);
        setNotice(`Category "${name}" updated successfully in vault.`);
      } else {
        await createCategory(payload as Omit<Category, 'id'>);
        setNotice(`Category "${name}" created successfully.`);
      }

      setShowModal(false);
      await loadCategories();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      setErrorMsg('Failed to save category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!cat.id) return;
    if (!confirm(`Are you sure you want to remove the category "${cat.name}"?`)) return;

    try {
      await deleteCategory(cat.id);
      setNotice(`Category "${cat.name}" removed from vault.`);
      await loadCategories();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {notice && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            backgroundColor: '#003629',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#BAEED9' }}>verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#707974' }}>
          <span>Catalogue</span>
          <span>/</span>
          <span style={{ color: '#725B38' }}>Architecture</span>
          <span>/</span>
          <span style={{ color: '#003629' }}>Categories</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 500, color: '#131B2E', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Diamond &amp; Fine Jewellery Categories
            </h1>
            <p style={{ fontSize: 14, color: '#404945', margin: '4px 0 0' }}>
              Configure diamond collection cards, storefront curation banners, subcategory navigation, and atelier catalog hierarchy.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={openAddModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 20px',
                borderRadius: 8,
                backgroundColor: '#003629',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,54,41,0.2)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#BAEED9' }}>add_circle</span>
              <span>+ Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>category</span>
            <h2 style={cardTitleStyle}>Active Category Registry</h2>
          </div>
          <span style={{ fontSize: 12, color: '#707974' }}>
            {categories.length} Collection{categories.length !== 1 ? 's' : ''} Configured
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8F9FE', borderBottom: '1px solid #EAEDFF' }}>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', width: 90 }}>Banner</th>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Category Title</th>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Storefront URL Slug</th>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Subcategories</th>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Items Badge</th>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Order</th>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974' }}>Status</th>
                <th style={{ padding: '12px 18px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#707974', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#707974', fontSize: 13.5 }}>
                    Loading categories from vault...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#707974', fontSize: 13.5 }}>
                    No categories configured yet.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr
                    key={c.id || c.name}
                    style={{ borderBottom: '1px solid #EAEDFF', transition: 'background-color 0.12s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 8,
                          overflow: 'hidden',
                          backgroundColor: '#F2F3FF',
                          border: '1px solid #EAEDFF',
                        }}
                      >
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/shop/banner-01.jpg';
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#707974' }}>category</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#131B2E' }}>{c.name}</div>
                      {c.description && (
                        <div style={{ fontSize: 11.5, color: '#707974', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontSize: 12.5, color: '#707974' }}>
                      /{c.slug}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {c.subcategories && c.subcategories.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 260 }}>
                          {c.subcategories.map((sub, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '2px 8px',
                                borderRadius: 4,
                                backgroundColor: '#F2F3FF',
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#131B2E',
                              }}
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#707974', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700, color: '#131B2E' }}>
                      {c.itemsCountText || '—'}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontSize: 13, color: '#707974' }}>
                      {c.displayOrder || 1}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: c.published !== false ? '#BAEED9' : '#EAEDFF',
                          color: c.published !== false ? '#002117' : '#131B2E',
                        }}
                      >
                        {c.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => openEditModal(c)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '6px 14px',
                            borderRadius: 6,
                            backgroundColor: '#003629',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: 12.5,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,54,41,0.15)',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#BAEED9' }}>edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            border: '1px solid #FFD6D6',
                            backgroundColor: '#FFF5F5',
                            color: '#BA1A1A',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Delete Category"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
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

      {/* ════ REDESIGNED LUXURY ATELIER MODAL / DOSSIER ════ */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(19, 27, 46, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 960,
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.18)',
              border: '1px solid #EAEDFF',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid #EAEDFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#725B38' }}>
                  Atelier Architecture
                </div>
                <h2 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 24, fontWeight: 500, color: '#131B2E', margin: '2px 0 0' }}>
                  {editingCat ? `Edit Category: ${editingCat.name}` : 'Create New Collection Category'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#F8F9FE',
                  border: '1px solid #EAEDFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#707974',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {errorMsg && (
              <div style={{ margin: '16px 28px 0', padding: '12px 16px', borderRadius: 8, backgroundColor: '#FFDAD6', border: '1px solid #FFB4AB', color: '#BA1A1A', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Two-Column Split in Modal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }} className="admin-cat-modal-split">
                
                {/* Left Side: Identity & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>
                      Category Title <span style={{ color: '#BA1A1A' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diamond ring"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>URL Slug</label>
                      <input
                        type="text"
                        required
                        placeholder="diamond-ring"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Item Count Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. 7 Items"
                        value={itemsCountText}
                        onChange={(e) => setItemsCountText(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Curator Description</label>
                    <textarea
                      rows={3}
                      placeholder="Bespoke diamond engagement rings and fine bands handcrafted to perfection..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ ...inputStyle, height: 'auto', minHeight: 76, padding: '10px 14px', lineHeight: 1.5 }}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Subcategories (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Engagement Rings, Eternity Bands, Solitaire Rings"
                      value={subcategoriesStr}
                      onChange={(e) => setSubcategoriesStr(e.target.value)}
                      style={inputStyle}
                    />
                    <span style={{ fontSize: 11, color: '#707974', marginTop: 4, display: 'block' }}>
                      Used for category pills and faceted navigation.
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Display Order</label>
                      <input
                        type="number"
                        min={1}
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(Number(e.target.value))}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Overlay Typography</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={textDark ? 'dark' : 'light'}
                          onChange={(e) => setTextDark(e.target.value === 'dark')}
                          style={selectStyle}
                        >
                          <option value="light">Light Typography (for dark image)</option>
                          <option value="dark">Dark Typography (for cream image)</option>
                        </select>
                        <span className="material-symbols-outlined" style={selectArrowStyle}>expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Showcase Banner & Publishing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ backgroundColor: '#F8F9FE', border: '1px solid #EAEDFF', borderRadius: 12, padding: 16 }}>
                    <label style={{ ...labelStyle, marginBottom: 12 }}>Collection Showcase Banner</label>
                    <ImageUpload
                      label="Banner Image"
                      value={image}
                      onChange={(url) => setImage(url)}
                      folder="categories"
                    />

                    {/* Live Preview Card */}
                    <div style={{ marginTop: 14 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#707974', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                        Storefront Card Preview
                      </span>
                      <div
                        style={{
                          height: 140,
                          borderRadius: 10,
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#111827',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          padding: 16,
                          color: textDark ? '#111827' : '#FFFFFF',
                        }}
                      >
                        {image && (
                          <img
                            src={image}
                            alt="preview"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/shop/banner-01.jpg';
                            }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                          />
                        )}
                        <div style={{ position: 'relative', zIndex: 2 }}>
                          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                            {itemsCountText || '5 Items'}
                          </span>
                          <h4 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 18, margin: '2px 0 0', fontWeight: 600 }}>
                            {name || 'Category Title'}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8F9FE', border: '1px solid #EAEDFF', borderRadius: 12, padding: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: '#003629', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#131B2E' }}>Publish Category Live</span>
                        <span style={{ fontSize: 11, color: '#707974' }}>Immediate visibility on /shop and navigation</span>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid #EAEDFF' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    color: '#131B2E',
                    border: '1px solid #EAEDFF',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 24px',
                    borderRadius: 8,
                    backgroundColor: '#003629',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: saving ? 'wait' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0,54,41,0.2)',
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#BAEED9' }}>save</span>
                  <span>{saving ? 'Saving Category...' : editingCat ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-cat-modal-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Reusable Component Styling Objects ──
const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  border: '1px solid #EAEDFF',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
  overflow: 'hidden',
};

const cardHeaderStyle: React.CSSProperties = {
  padding: '16px 24px',
  borderBottom: '1px solid #F2F3FF',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontSize: 15,
  fontWeight: 700,
  color: '#131B2E',
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11.5,
  fontWeight: 700,
  color: '#404945',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
  fontFamily: 'Plus Jakarta Sans, sans-serif',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 42,
  padding: '0 14px',
  borderRadius: 8,
  border: '1px solid #EAEDFF',
  backgroundColor: '#F8F9FE',
  fontSize: 13.5,
  color: '#131B2E',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  outline: 'none',
  transition: 'border-color 0.15s, background-color 0.15s',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  paddingRight: 36,
  cursor: 'pointer',
};

const selectArrowStyle: React.CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 11,
  fontSize: 20,
  color: '#707974',
  pointerEvents: 'none',
};
