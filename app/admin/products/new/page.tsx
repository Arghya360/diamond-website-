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
    { url: '/images/products/pro-21.png', isMain: true, alt: 'Main piece photograph' },
  ]);

  // 4. Specifications
  const [specs, setSpecs] = useState<ProductSpecification[]>([
    { name: 'Metal', value: '18k White Gold / Platinum 950' },
    { name: 'Center Stone', value: '3.00 ct D/VVS1 Lab-Grown Diamond' },
    { name: 'Cut Grade', value: 'Super Ideal • Hearts & Arrows' },
    { name: 'Certification', value: 'GIA / IGI Dual Certified' },
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setErrorMsg('A valid product price is required.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please upload at least one photograph for this piece.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Editorial Breadcrumbs & Header Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#707974' }}>
          <span>Catalogue</span>
          <span>/</span>
          <span style={{ color: '#725B38' }}>Jewellery Products</span>
          <span>/</span>
          <span style={{ color: '#003629' }}>Create New Piece</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 500, color: '#131B2E', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Create New Fine Jewellery Piece
            </h1>
            <p style={{ fontSize: 14, color: '#404945', margin: '4px 0 0' }}>
              Catalog a bespoke diamond creation with vault specifications, high-definition photographs, and real-time storefront publishing.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/admin/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                color: '#131B2E',
                border: '1px solid #EAEDFF',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
              <span>Back to Catalogue</span>
            </Link>

            <button
              onClick={handleSubmit}
              disabled={saving}
              type="button"
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
                cursor: saving ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,54,41,0.2)',
                opacity: saving ? 0.75 : 1,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#BAEED9' }}>publish</span>
              <span>{saving ? 'Publishing Piece...' : 'Publish Piece to Vault'}</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            backgroundColor: '#FFDAD6',
            border: '1px solid #FFB4AB',
            color: '#BA1A1A',
            padding: '12px 18px',
            borderRadius: 10,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 2px 8px rgba(186, 26, 26, 0.08)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
          <span style={{ fontWeight: 500 }}>{errorMsg}</span>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 24, alignItems: 'start' }} className="admin-form-split-wrap">
          
          {/* ════ LEFT COLUMN: MAIN PIECE ATTRIBUTES ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 1. Basic Information Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>edit_note</span>
                  <h2 style={cardTitleStyle}>1. Piece Identity &amp; Craft Narrative</h2>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#707974', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Atelier Identity
                </span>
              </div>

              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={labelStyle}>
                    Piece Title <span style={{ color: '#BA1A1A' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Celestial Marquise Solitaire Ring"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Storefront URL Slug</label>
                    <input
                      type="text"
                      placeholder="the-celestial-marquise-solitaire-ring"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Primary Category <span style={{ color: '#BA1A1A' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={selectStyle}
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
                            <option value="High Jewellery">High Jewellery</option>
                          </>
                        )}
                      </select>
                      <span className="material-symbols-outlined" style={selectArrowStyle}>expand_more</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Subcategory / Collection Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Engagement Rings, Solitaire, Spring Atelier"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Short Summary (Quick View)</label>
                    <input
                      type="text"
                      placeholder="e.g. 3.20 ct D/IF certified lab-grown diamond set in Platinum 950."
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Comprehensive Atelier Craft Narrative</label>
                  <textarea
                    rows={4}
                    placeholder="Provide a comprehensive narrative describing the diamond brilliance, master setting craftsmanship, provenance, and aesthetic character..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputStyle, height: 'auto', minHeight: 96, padding: '12px 14px', lineHeight: 1.6 }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Pricing & Vault Inventory */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>account_balance_wallet</span>
                  <h2 style={cardTitleStyle}>2. Valuation &amp; Vault Inventory</h2>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#707974', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Financial &amp; Stock
                </span>
              </div>

              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>
                      Selling Price ($ USD) <span style={{ color: '#BA1A1A' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      placeholder="64500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Compare-at Price ($)</label>
                      {discountPercent !== null && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#003629', backgroundColor: '#BAEED9', padding: '1px 6px', borderRadius: 4 }}>
                          -{discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="72000 (optional)"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>SKU / Vault Ref</label>
                    <input
                      type="text"
                      placeholder="CRT-RNG-8942"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Units in Vault</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="10"
                      value={stock}
                      onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Vault Status</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value as any)}
                        style={selectStyle}
                      >
                        <option value="in_stock">In Stock (Vault Ready)</option>
                        <option value="preorder">Pre-Order / Bespoke Commission</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                      <span className="material-symbols-outlined" style={selectArrowStyle}>expand_more</span>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Gross Metal Weight</label>
                    <input
                      type="text"
                      placeholder="e.g. 5.2g (Pt 950)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Gemological Specifications Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>diamond</span>
                  <h2 style={cardTitleStyle}>3. Gemological &amp; Metal Specifications</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    borderRadius: 6,
                    backgroundColor: '#F2F3FF',
                    color: '#003629',
                    border: '1px solid #EAEDFF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                  <span>Add Spec</span>
                </button>
              </div>

              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 8,
                      backgroundColor: '#F8F9FE',
                      border: '1px solid #EAEDFF',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Attribute (e.g. Metal, Cut, Clarity, Origin)"
                      value={spec.name}
                      onChange={(e) => handleSpecChange(i, 'name', e.target.value)}
                      style={{ ...inputStyle, height: 38, flex: 1, backgroundColor: '#FFFFFF' }}
                    />
                    <input
                      type="text"
                      placeholder="Specification Value (e.g. Platinum 950, Round Brilliant D/VVS1)"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                      style={{ ...inputStyle, height: 38, flex: 1.5, backgroundColor: '#FFFFFF' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(i)}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        backgroundColor: '#FFF1F0',
                        color: '#BA1A1A',
                        border: '1px solid #FFDAD6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      title="Remove specification"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Product Photographs & Gallery Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>photo_library</span>
                  <h2 style={cardTitleStyle}>4. Haute Joaillerie Gallery Photographs</h2>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#707974', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Direct Media Vault
                </span>
              </div>

              <div style={{ padding: 24 }}>
                <MultiImageUpload
                  images={images}
                  onChange={setImages}
                  folder="products"
                  maxImages={8}
                />
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: SIDEBAR MERCHANDISING & ACTIONS ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Card 5: Publishing & Status */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>verified</span>
                  <h2 style={cardTitleStyle}>Storefront Publishing</h2>
                </div>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#003629', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#131B2E' }}>Published on Storefront</span>
                    <span style={{ fontSize: 11.5, color: '#707974' }}>Live immediately for global visitors</span>
                  </div>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10, borderTop: '1px solid #EAEDFF' }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 8,
                      backgroundColor: '#003629',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: saving ? 'wait' : 'pointer',
                      boxShadow: '0 4px 12px rgba(0,54,41,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#BAEED9' }}>publish</span>
                    <span>{saving ? 'Publishing Piece...' : 'Publish Piece to Vault'}</span>
                  </button>

                  <Link
                    href="/admin/products"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      color: '#131B2E',
                      border: '1px solid #EAEDFF',
                      fontSize: 13,
                      fontWeight: 600,
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 6: Curator Highlights & Badges */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>auto_awesome</span>
                  <h2 style={cardTitleStyle}>Curator Merchandising</h2>
                </div>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ width: 17, height: 17, accentColor: '#003629', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#131B2E' }}>Featured Piece</span>
                    <span style={{ fontSize: 11, color: '#707974' }}>Showcased in curator&apos;s spotlight</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    style={{ width: 17, height: 17, accentColor: '#003629', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#131B2E' }}>New Arrival</span>
                    <span style={{ fontSize: 11, color: '#707974' }}>Display in latest collections</span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    style={{ width: 17, height: 17, accentColor: '#003629', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#131B2E' }}>Trending Atelier Piece</span>
                    <span style={{ fontSize: 11, color: '#707974' }}>Popular demand flag</span>
                  </div>
                </label>

                <div style={{ paddingTop: 8, borderTop: '1px solid #EAEDFF' }}>
                  <label style={labelStyle}>Promotional Pill Badge</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={badge || ''}
                      onChange={(e) => setBadge((e.target.value as any) || null)}
                      style={selectStyle}
                    >
                      <option value="">No Promotional Badge</option>
                      <option value="NEW">NEW ARRIVAL</option>
                      <option value="HOT">HOT PIECE</option>
                      <option value="TRENDING">TRENDING</option>
                      <option value="BESTSELLER">BESTSELLER</option>
                    </select>
                    <span className="material-symbols-outlined" style={selectArrowStyle}>expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 7: Search Engine Optimization (SEO) */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#725B38' }}>search</span>
                  <h2 style={cardTitleStyle}>SEO &amp; Discovery</h2>
                </div>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Meta Title</label>
                  <input
                    type="text"
                    placeholder={`${name || 'Jewellery Piece'} | Caritas Luxury`}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="Discover our bespoke certified lab-grown diamond piece..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    style={{ ...inputStyle, height: 'auto', minHeight: 64, padding: '8px 10px', fontSize: 12 }}
                  />
                </div>

                {/* Google Preview Snippet */}
                <div style={{ backgroundColor: '#F8F9FE', border: '1px solid #EAEDFF', borderRadius: 8, padding: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#707974', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
                    Google SERP Preview
                  </span>
                  <div style={{ fontSize: 13, color: '#1A0DAB', fontWeight: 500, lineHeight: 1.3, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {seoTitle || (name ? `${name} | CARITAS LUXURY Haute Joaillerie` : 'Caritas Luxury Fine Jewellery Piece')}
                  </div>
                  <div style={{ fontSize: 11, color: '#006621', marginBottom: 2 }}>
                    https://caratase.com/shop/{slug || 'fine-jewellery-piece'}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#545454', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {seoDescription || shortDescription || 'Discover exquisite certified lab-grown diamonds, bespoke engagement rings, and master atelier craftsmanship.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 8: Vault Guarantee & Telemetry */}
            <div style={{ ...cardStyle, backgroundColor: '#F2F3FF', border: '1px solid #DAE2FD' }}>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#003629' }}>shield_with_heart</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#003629', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Swiss Atelier Standard
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#404945', lineHeight: 1.5, margin: 0 }}>
                  Every catalogued piece is protected by 256-bit cryptographic telemetry, FINMA AML compliance, and dual GIA/IGI gemological dossiers.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#003629', fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#376757' }} />
                  <span>Cloud Firestore Sync Armed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 992px) {
          .admin-form-split-wrap {
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
