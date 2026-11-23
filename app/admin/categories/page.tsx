'use client';

import React, { useEffect, useState } from 'react';
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please provide a category title.');
      return;
    }

    setSaving(true);
    const subcategories = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Category> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      image,
      itemsCountText: itemsCountText.trim(),
      displayOrder: Number(displayOrder) || 1,
      published,
      textDark,
      subcategories,
    };

    try {
      if (editingCat && editingCat.id) {
        await updateCategory(editingCat.id, payload);
        setNotice(`Category "${name}" updated successfully.`);
      } else {
        await createCategory(payload as Omit<Category, 'id'>);
        setNotice(`Category "${name}" created successfully.`);
      }

      setShowModal(false);
      await loadCategories();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Failed to save category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!cat.id) return;
    if (!confirm(`Are you sure you want to remove the category "${cat.name}"?`)) return;

    try {
      await deleteCategory(cat.id);
      setNotice(`Category "${cat.name}" removed.`);
      await loadCategories();
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003629] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#baeed9]/20 font-body-md animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-[#baeed9]">verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-space-sm mb-space-lg">
        <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-outline">
          <span>Catalogue</span>
          <span className="text-xs">/</span>
          <span className="text-secondary font-semibold">Categories</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Diamond &amp; Fine Jewellery Categories
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Configure diamond categories, hero showcase cards, subcategory filters, and storefront navigation hierarchy.
            </p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md font-title-md text-title-md"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>+ Add New Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3.5 px-6" style={{ width: '80px' }}>Banner</th>
                <th className="py-3.5 px-6">Category Name</th>
                <th className="py-3.5 px-6">Slug</th>
                <th className="py-3.5 px-6">Subcategories</th>
                <th className="py-3.5 px-6">Item Count</th>
                <th className="py-3.5 px-6">Order</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-md text-body-md text-on-surface">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-2 block">category</span>
                    No categories configured yet.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id || c.name} className="hover:bg-surface-container-low/70 transition-colors">
                    <td className="py-4 px-6">
                      <div
                        className="w-14 h-14 rounded-lg bg-cover bg-center border border-surface-container shadow-xs"
                        style={{
                          backgroundImage: c.image ? `url("${c.image}")` : 'none',
                          backgroundColor: '#f2f3ff',
                        }}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-title-md text-title-md text-on-surface font-semibold">{c.name}</div>
                      {c.description && (
                        <div className="font-body-sm text-body-sm text-outline max-w-xs truncate">
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-outline font-body-sm text-body-sm">
                      /{c.slug}
                    </td>
                    <td className="py-4 px-6">
                      {c.subcategories && c.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {c.subcategories.map((sub, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface">
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-outline text-body-sm">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-on-surface font-title-md text-title-md">
                      {c.itemsCountText || '—'}
                    </td>
                    <td className="py-4 px-6 font-mono text-outline font-body-sm text-body-sm">
                      {c.displayOrder || 1}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        c.published !== false ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-outline'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {c.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete Category"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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

      {/* Modal for Add / Edit Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-space-xl shadow-2xl border border-surface-container flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-space-md border-b border-surface-container-low">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                  Catalogue Configuration
                </span>
                <h2 className="font-headline-md text-headline-md text-primary mt-1">
                  {editingCat ? `Edit Category: ${editingCat.name}` : 'Create New Category'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="py-space-md space-y-space-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Category Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
                    placeholder="e.g. Loose Diamonds"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Slug (URL Path)</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none font-mono text-sm"
                    placeholder="e.g. loose-diamonds"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
                  placeholder="Curated selection of certified loose diamonds..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Banner Image (Local Upload or URL)</label>
                <ImageUpload
                  value={image}
                  onChange={(url) => setImage(url)}
                  folder="categories"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Items Count Text</label>
                  <input
                    type="text"
                    value={itemsCountText}
                    onChange={(e) => setItemsCountText(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
                    placeholder="e.g. 12 Items"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Display Order Priority</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Subcategories (Comma-separated)</label>
                <input
                  type="text"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none"
                  placeholder="e.g. Solitaires, Halo Rings, Eternity Bands"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-primary accent-[#003629]"
                  />
                  <span className="font-title-md text-title-md text-on-surface">Publish Immediately on Storefront</span>
                </label>
              </div>

              <div className="pt-space-md border-t border-surface-container-low flex items-center justify-end gap-space-sm">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-title-md text-title-md shadow-md transition-all disabled:opacity-50"
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
