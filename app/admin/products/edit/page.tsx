'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, updateProduct, getCategories, uploadFileToStorage } from '../../../../lib/firebase/admin-service';
import type { Product, Category, ProductImage, ProductSpecification } from '../../../../types/admin';

function EditProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Rings');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number | ''>(10);
  const [availability, setAvailability] = useState<Product['availability']>('in_stock');
  const [weight, setWeight] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [badge, setBadge] = useState<Product['badge']>(null);
  const [published, setPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Images state
  const [images, setImages] = useState<ProductImage[]>([]);
  const [manualImgUrl, setManualImgUrl] = useState('');

  // Specifications
  const [specs, setSpecs] = useState<ProductSpecification[]>([]);

  useEffect(() => {
    async function init() {
      if (!productId) {
        setErrorMsg('No product ID provided in URL.');
        setLoading(false);
        return;
      }

      try {
        const [cats, prod] = await Promise.all([
          getCategories(),
          getProductById(productId),
        ]);
        setCategories(cats);

        if (prod) {
          setName(prod.name || '');
          setSlug(prod.slug || '');
          setCategory(prod.category || (cats[0]?.name || 'Rings'));
          setSubcategory(prod.subcategory || '');
          setDescription(prod.description || '');
          setShortDescription(prod.shortDescription || '');
          setPrice(prod.price ?? '');
          setSalePrice(prod.salePrice ?? '');
          setSku(prod.sku || '');
          setStock(prod.stock ?? 0);
          setAvailability(prod.availability || 'in_stock');
          setWeight(prod.weight || '');
          setIsFeatured(!!prod.isFeatured);
          setIsNewArrival(!!prod.isNewArrival);
          setIsTrending(!!prod.isTrending);
          setBadge(prod.badge || null);
          setPublished(prod.published !== false);
          setSeoTitle(prod.seoTitle || '');
          setSeoDescription(prod.seoDescription || '');
          setImages(prod.images || []);
          setSpecs(prod.specifications || []);
        } else {
          setErrorMsg(`Product with ID "${productId}" could not be found in Firebase.`);
        }
      } catch (err: any) {
        setErrorMsg('Error loading product: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [productId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImg(true);
    setErrorMsg(null);

    try {
      const newImgs: ProductImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const downloadUrl = await uploadFileToStorage(file, 'products');
        newImgs.push({
          url: downloadUrl,
          alt: file.name,
          isMain: images.length === 0 && i === 0,
        });
      }
      setImages((prev) => [...prev, ...newImgs]);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMsg('Image upload failed: ' + (err.message || 'Check storage permissions.'));
    } finally {
      setUploadingImg(false);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualImgUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      { url: manualImgUrl.trim(), isMain: prev.length === 0, alt: name || 'Product image' },
    ]);
    setManualImgUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
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

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const productData: Partial<Product> = {
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
        published,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
      };

      await updateProduct(productId, productData);
      setSuccessMsg('Product was updated successfully and changes are live!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error updating product:', err);
      setErrorMsg('Failed to update product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading product details...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— ATELIER &amp; VAULT CATALOG</span>
          <h1 className="admin-hero-title">Edit Piece: {name || 'Product'}</h1>
          <p className="admin-hero-subtitle">
            Update pricing, vault specifications, photography, and live customer visibility.
          </p>
        </div>

        <div className="admin-hero-actions">
          <Link href="/admin/products" className="btn-caritas-secondary">
            ← Return to Catalog
          </Link>
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-caritas-gold"
          >
            <span>↗</span> View in Live Shop
          </a>
        </div>
      </div>

      {successMsg && (
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
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            1. Basic Product Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="admin-label">Product Name *</label>
              <input
                type="text"
                required
                className="admin-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Product URL Slug</label>
              <input
                type="text"
                className="admin-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="admin-label">Primary Category *</label>
              <select
                className="admin-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="admin-label">Subcategory</label>
              <input
                type="text"
                className="admin-input"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Short Description</label>
            <input
              type="text"
              className="admin-input"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Full Product Description</label>
            <textarea
              rows={4}
              className="admin-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            2. Pricing & Inventory
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="admin-label">Price ($ USD) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="admin-input"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div>
              <label className="admin-label">Sale / Original Price ($ USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="admin-input"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div>
              <label className="admin-label">Stock Quantity</label>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div>
              <label className="admin-label">Product SKU</label>
              <input
                type="text"
                className="admin-input"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label className="admin-label">Availability Status</label>
              <select
                className="admin-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="preorder">Pre-Order</option>
              </select>
            </div>

            <div>
              <label className="admin-label">Estimated Metal Weight</label>
              <input
                type="text"
                className="admin-input"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Media & Images */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            3. Product Images (Firebase Storage)
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                padding: '24px',
                border: '2px dashed var(--admin-border)',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>☁️</div>
              <div style={{ color: 'var(--admin-gold)', fontWeight: 600, fontSize: '14px' }}>
                {uploadingImg ? 'Uploading image to Firebase Storage...' : 'Upload Additional Images to Firebase Storage'}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                disabled={uploadingImg}
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Or add image URL manually..."
              className="admin-input"
              value={manualImgUrl}
              onChange={(e) => setManualImgUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddManualUrl}
              className="btn-secondary"
            >
              Add URL
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  width: '120px',
                  borderRadius: '8px',
                  border: img.isMain ? '2px solid var(--admin-gold)' : '1px solid var(--admin-border)',
                  overflow: 'hidden',
                  backgroundColor: '#0c1315',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100px',
                    backgroundImage: `url("${img.url}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ padding: '6px', textAlign: 'center', backgroundColor: '#141c1f' }}>
                  {img.isMain ? (
                    <span style={{ fontSize: '10px', color: 'var(--admin-gold)', fontWeight: 700 }}>
                      ★ MAIN
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--admin-muted)', fontSize: '10px', cursor: 'pointer', padding: 0 }}
                    >
                      Set Main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '10px', cursor: 'pointer', marginLeft: '8px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-text)' }}>
              4. Product Specifications
            </h3>
            <button type="button" onClick={handleAddSpec} className="btn-secondary" style={{ fontSize: '12px' }}>
              + Add Specification Row
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {specs.map((spec, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Specification Name"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={spec.name}
                  onChange={(e) => handleSpecChange(i, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={spec.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(i)}
                  className="btn-danger"
                  style={{ padding: '8px 12px' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility & Badges */}
        <div className="admin-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
            5. Website Visibility & Highlights
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '18px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)' }}
              />
              <strong>Published (Visible on live website)</strong>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)' }}
              />
              <span>Show in "New Arrivals" Grid</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)' }}
              />
              <span>Show in "Trending Products" Marquee</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)' }}
              />
              <span>Featured Product</span>
            </label>
          </div>

          <div style={{ width: '220px' }}>
            <label className="admin-label">Promotional Badge Tag</label>
            <select
              className="admin-select"
              value={badge || ''}
              onChange={(e) => setBadge((e.target.value || null) as any)}
            >
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="HOT">HOT</option>
              <option value="TRENDING">TRENDING</option>
              <option value="BESTSELLER">BESTSELLER</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <Link href="/admin/products" className="btn-secondary" style={{ padding: '12px 24px' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ padding: '12px 32px', fontSize: '15px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Updating Firebase...' : 'Save Product Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditProductPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-muted)' }}>Loading editor...</div>}>
      <EditProductForm />
    </Suspense>
  );
}
