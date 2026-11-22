'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProduct, getCategories } from '../../../../lib/firebase/admin-service';
import MultiImageUpload from '../../../../components/admin/MultiImageUpload';
import type { Product, Category, ProductImage, ProductSpecification } from '../../../../types/admin';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Basic Information
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Rings');
  const [subcategory, setSubcategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // 2. Pricing & Inventory
  const [price, setPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number | ''>(10);
  const [availability, setAvailability] = useState<Product['availability']>('in_stock');
  const [weight, setWeight] = useState('');

  // 3. Images
  const [images, setImages] = useState<ProductImage[]>([
    { url: '/wp-content/uploads/shop page/pro-21-300x300.png', isMain: true, alt: 'Main product photograph' },
  ]);

  // 4. Specifications
  const [specs, setSpecs] = useState<ProductSpecification[]>([
    { name: 'Metal', value: '18k White Gold' },
    { name: 'Diamond Clarity', value: 'VS1' },
    { name: 'Carat Weight', value: '1.50 ct' },
  ]);

  // 5. Merchandising
  const [published, setPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isTrending, setIsTrending] = useState(false);
  const [badge, setBadge] = useState<Product['badge']>('NEW');

  // 6. SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && !category) {
        setCategory(cats[0].name);
      }
    });
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(autoSlug);
  };

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { name: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'name' | 'value', val: string) => {
    setSpecs((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: val } : spec))
    );
  };

  const discountPercent =
    salePrice !== '' && price !== '' && Number(salePrice) > 0 && Number(price) < Number(salePrice)
      ? Math.round(((Number(salePrice) - Number(price)) / Number(salePrice)) * 100)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setErrorMsg('A valid product price is required.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please upload at least one photograph for this piece.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const productData: Omit<Product, 'id'> = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        subcategory: subcategory.trim() || undefined,
        description: description.trim(),
        shortDescription: shortDescription.trim() || undefined,
        price: Number(price),
        salePrice: salePrice !== '' ? Number(salePrice) : null,
        sku: sku.trim() || undefined,
        stock: stock !== '' ? Number(stock) : 0,
        availability,
        weight: weight.trim() || undefined,
        images,
        specifications: specs.filter((s) => s.name.trim() !== ''),
        isFeatured,
        isNewArrival,
        isTrending,
        badge: badge || null,
        rating: 5.0,
        published,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
      };

      await createProduct(productData);
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error creating product:', err);
      setErrorMsg('Failed to create product: ' + err.message);
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— ATELIER &amp; VAULT CATALOG</span>
          <h1 className="admin-hero-title">Create New Fine Jewelry Piece</h1>
          <p className="admin-hero-subtitle">
            Catalog a bespoke diamond creation with pricing, vault specifications, multiple gallery photographs, and live storefront publishing.
          </p>
        </div>

        <div className="admin-hero-actions">
          <Link href="/admin/products" className="btn-caritas-secondary">
            ← Return to Catalog
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'rgba(192, 50, 58, 0.08)',
            border: '1px solid rgba(192, 50, 58, 0.25)',
            color: 'var(--crimson)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '13px',
            fontFamily: 'var(--font-title)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 1. Basic Information */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>1. Basic Piece Information</span>
            </h2>
          </div>

          <div className="admin-form-grid-2">
            <div>
              <label className="admin-label">
                Piece Title <span className="admin-field-required">*</span>
              </label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="e.g. Diamond Halo Engagement Ring"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Storefront URL Slug</label>
              <input
                type="text"
                className="admin-input"
                placeholder="diamond-halo-engagement-ring"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-grid-2">
            <div>
              <label className="admin-label">
                Primary Category <span className="admin-field-required">*</span>
              </label>
              <select
                className="admin-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Diamonds">Diamonds</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="admin-label">Subcategory / Collection Tag</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Engagement Rings, Solitaire"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Short Summary (Shown in Quick Views)</label>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. Certified VS1 lab-grown diamond set in 18k white gold band."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Full Atelier Description</label>
            <textarea
              rows={4}
              className="admin-textarea"
              placeholder="Provide a comprehensive narrative describing the diamond cut, master setting craftsmanship, provenance, and aesthetic character..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Pricing & Inventory */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>2. Pricing &amp; Vault Inventory</span>
            </h2>
          </div>

          <div className="admin-form-grid-3">
            <div>
              <label className="admin-label">
                Selling Price ($ USD) <span className="admin-field-required">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step="any"
                className="admin-input"
                placeholder="3600"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div>
              <label className="admin-label">
                Original Price (for Sale Display)
              </label>
              <input
                type="number"
                min={0}
                step="any"
                className="admin-input"
                placeholder="4200 (optional)"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
              {discountPercent !== null && (
                <div style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 600, marginTop: '4px' }}>
                  Calculated discount: -{discountPercent}%
                </div>
              )}
            </div>

            <div>
              <label className="admin-label">SKU / Vault Reference</label>
              <input
                type="text"
                className="admin-input"
                placeholder="CR-RNG-104"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-grid-3">
            <div>
              <label className="admin-label">Units in Vault</label>
              <input
                type="number"
                min={0}
                className="admin-input"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div>
              <label className="admin-label">Vault Availability</label>
              <select
                className="admin-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
              >
                <option value="in_stock">In Stock (Vault Ready)</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="preorder">Pre-Order / Bespoke Commission</option>
              </select>
            </div>

            <div>
              <label className="admin-label">Weight / Metal Grams</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. 4.8g (18k)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3. Product Photographs */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>3. Product Photographs &amp; Gallery</span>
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Direct local upload to Firebase Storage
            </span>
          </div>

          <MultiImageUpload
            images={images}
            onChange={setImages}
            folder="products"
            maxImages={8}
          />
        </div>

        {/* 4. Specifications */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>4. Vault Specifications &amp; Gemstone Details</span>
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="btn-caritas-secondary"
              style={{ padding: '6px 14px', fontSize: '11.5px' }}
            >
              + Add Specification
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {specs.map((spec, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--surface-bg)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-line)',
                }}
              >
                <input
                  type="text"
                  placeholder="Attribute (e.g. Diamond Cut, Metal, Carat)"
                  className="admin-input"
                  style={{ flex: 1, height: '38px', fontSize: '13px' }}
                  value={spec.name}
                  onChange={(e) => handleSpecChange(i, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Specification Value (e.g. Round Brilliant, 18k Rose Gold)"
                  className="admin-input"
                  style={{ flex: 1, height: '38px', fontSize: '13px' }}
                  value={spec.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(i)}
                  className="btn-caritas-danger"
                  style={{ padding: '8px 12px', height: '38px' }}
                  title="Remove specification"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Merchandising & Visibility */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>5. Storefront Merchandising &amp; Badges</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '20px' }}>
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span><strong>Published on Storefront</strong> (Publicly visible)</span>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span><strong>Featured Piece</strong> (Curator&#39;s highlight)</span>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
              />
              <span><strong>New Arrival</strong> (Shows in latest releases)</span>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
              />
              <span><strong>Trending Piece</strong> (High demand)</span>
            </label>
          </div>

          <div style={{ maxWidth: '280px' }}>
            <label className="admin-label">Promotional Pill Badge</label>
            <select
              className="admin-select"
              value={badge || ''}
              onChange={(e) => setBadge((e.target.value as any) || null)}
            >
              <option value="">No Promotional Badge</option>
              <option value="NEW">NEW ARRIVAL</option>
              <option value="HOT">HOT PIECE</option>
              <option value="TRENDING">TRENDING</option>
              <option value="BESTSELLER">BESTSELLER</option>
            </select>
          </div>
        </div>

        {/* 6. SEO */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>6. Search Engine Optimization (SEO)</span>
            </h2>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Custom Meta Title</label>
            <input
              type="text"
              className="admin-input"
              placeholder={`${name || 'Product'} | Caritas Luxury Diamonds`}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Custom Meta Description</label>
            <textarea
              rows={2}
              className="admin-textarea"
              placeholder="Discover our bespoke certified lab-grown diamond piece..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', marginTop: '24px', marginBottom: '40px' }}>
          <Link href="/admin/products" className="btn-caritas-secondary" style={{ padding: '12px 24px' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-caritas-gold"
            style={{ padding: '12px 36px' }}
          >
            {saving ? 'Publishing Piece...' : 'Publish Piece to Catalog'}
          </button>
        </div>
      </form>
    </div>
  );
}
