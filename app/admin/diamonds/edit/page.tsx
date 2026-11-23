'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDiamondById, updateDiamond } from '../../../../lib/firebase/admin-service';
import ImageUpload from '../../../../components/admin/ImageUpload';
import type { Diamond } from '../../../../types/admin';

function EditDiamondForm() {
  const router = useRouter();
  const id = useSearchParams().get('id') || '';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Diamond | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No diamond ID was provided.');
      setLoading(false);
      return;
    }
    getDiamondById(id).then((diamond) => {
      if (!diamond) setError('Diamond could not be found.');
      setForm(diamond);
      setLoading(false);
    }).catch((err) => {
      setError(err.message || 'Unable to load diamond.');
      setLoading(false);
    });
  }, [id]);

  const set = (field: keyof Diamond, value: any) => setForm((current) => current ? { ...current, [field]: value } : current);

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form?.id || form.price <= 0) return;
    setSaving(true);
    try {
      await updateDiamond(form.id, form);
      router.push('/admin/diamonds');
    } catch (err: any) {
      setError(err.message || 'Unable to save diamond.');
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-card" style={{ padding: 48, textAlign: 'center' }}>Loading diamond...</div>;
  if (!form) return <div className="admin-error-alert">{error || 'Diamond not found.'}</div>;

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div className="admin-page-hero">
        <div><span className="admin-hero-eyebrow">— EDIT DIAMOND</span><h1 className="admin-hero-title">{form.name}</h1></div>
        <div className="admin-hero-actions"><Link href="/admin/diamonds" className="btn-caritas-secondary">← Back</Link></div>
      </div>
      {error && <div className="admin-error-alert">{error}</div>}
      <form onSubmit={submitForm}>
        <div className="admin-card">
          <div className="admin-card-header"><h2 className="admin-card-title">Diamond Details</h2></div>
          <div className="admin-form-grid">
            <div><label className="admin-label">Diamond Name *</label><input className="admin-input" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div><label className="admin-label">Slug</label><input className="admin-input" value={form.slug} onChange={(e) => set('slug', e.target.value)} /></div>
            <div><label className="admin-label">Shape</label><select className="admin-select" value={form.shape} onChange={(e) => set('shape', e.target.value)}>{['Round','Oval','Emerald','Asscher','Marquise','Cushion','Pear','Radiant','Princess','Heart','Old Mine','Elongated Cushion'].map((value) => <option key={value}>{value}</option>)}</select></div>
            <div><label className="admin-label">Collection</label><select className="admin-select" value={form.category} onChange={(e) => set('category', e.target.value)}><option value="white">White</option><option value="pink">Pink</option></select></div>
            <div><label className="admin-label">Carat</label><input className="admin-input" type="number" min="0.01" step="0.01" value={form.carat} onChange={(e) => set('carat', Number(e.target.value))} /></div>
            <div><label className="admin-label">Cut</label><select className="admin-select" value={form.cut} onChange={(e) => set('cut', e.target.value)}>{['Fair','Good','Very Good','Ideal','Super Ideal'].map((value) => <option key={value}>{value}</option>)}</select></div>
            <div><label className="admin-label">Color</label><input className="admin-input" value={form.color} onChange={(e) => set('color', e.target.value)} /></div>
            <div><label className="admin-label">Clarity</label><input className="admin-input" value={form.clarity} onChange={(e) => set('clarity', e.target.value)} /></div>
            <div><label className="admin-label">Price ($ USD)</label><input className="admin-input" type="number" min="0" value={form.price} onChange={(e) => set('price', Number(e.target.value))} /></div>
            <div><label className="admin-label">Origin</label><select className="admin-select" value={form.origin} onChange={(e) => set('origin', e.target.value)}><option>Lab Grown</option><option>Natural</option></select></div>
            <div><label className="admin-label">Availability</label><select className="admin-select" value={form.availability} onChange={(e) => set('availability', e.target.value)}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></div>
            <div><label className="admin-label">Popular Rank</label><input className="admin-input" type="number" value={form.popularRank || 100} onChange={(e) => set('popularRank', Number(e.target.value))} /></div>
          </div>
          <div style={{ marginTop: 16 }}><label className="admin-label">Description</label><textarea className="admin-textarea" rows={4} value={form.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header"><h2 className="admin-card-title">Image & Publishing</h2></div>
          <ImageUpload label="Diamond Image" value={form.image} onChange={(value) => set('image', value)} folder="diamonds" />
          <div className="admin-checkbox-row">
            <label><input type="checkbox" checked={form.quickShip} onChange={(e) => set('quickShip', e.target.checked)} /> QuickShip</label>
            <label><input type="checkbox" checked={form.bestValue} onChange={(e) => set('bestValue', e.target.checked)} /> BestValue</label>
            <label><input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} /> Published</label>
          </div>
        </div>
        <div className="admin-form-actions"><Link href="/admin/diamonds" className="btn-caritas-secondary">Cancel</Link><button className="btn-caritas-gold" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button></div>
      </form>
    </div>
  );
}

export default function EditDiamondPage() {
  return <Suspense fallback={<div className="admin-card" style={{ padding: 48, textAlign: 'center' }}>Loading diamond editor...</div>}><EditDiamondForm /></Suspense>;
}
