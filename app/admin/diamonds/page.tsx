'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { deleteDiamond, getDiamonds, updateDiamond } from '../../../lib/firebase/admin-service';
import type { Diamond } from '../../../types/admin';

export default function AdminDiamondsPage() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | 'white' | 'pink'>('All');
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    try {
      setDiamonds(await getDiamonds());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const togglePublish = async (diamond: Diamond) => {
    if (!diamond.id) return;
    await updateDiamond(diamond.id, { published: !diamond.published });
    setDiamonds((items) => items.map((item) => item.id === diamond.id ? { ...item, published: !item.published } : item));
    setNotice(diamond.published ? 'Diamond unpublished.' : 'Diamond published.');
  };

  const removeDiamond = async (diamond: Diamond) => {
    if (!diamond.id || !confirm(`Delete "${diamond.name}"?`)) return;
    await deleteDiamond(diamond.id);
    setDiamonds((items) => items.filter((item) => item.id !== diamond.id));
    setNotice('Diamond deleted.');
  };

  const filtered = diamonds.filter((diamond) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [diamond.name, diamond.shape, diamond.color, diamond.clarity]
      .some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (category === 'All' || diamond.category === category);
  });

  return (
    <>
      {notice && <div className="admin-toast" role="status">{notice}</div>}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— DIAMOND CATALOGUE</span>
          <h1 className="admin-hero-title">Diamond Management</h1>
          <p className="admin-hero-subtitle">Manage the diamonds displayed on the live diamond catalogue and white/pink collections.</p>
        </div>
        <div className="admin-hero-actions">
          <Link href="/admin/diamonds/new" className="btn-caritas-gold">+ Add Diamond</Link>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-search-wrap">
          <input className="admin-filter-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search shape, color, clarity..." />
        </div>
        <div className="admin-filter-controls">
          <select className="admin-filter-select" value={category} onChange={(event) => setCategory(event.target.value as 'All' | 'white' | 'pink')}>
            <option value="All">All Collections</option>
            <option value="white">White Diamonds</option>
            <option value="pink">Pink Diamonds</option>
          </select>
        </div>
      </div>

      <div className="admin-card-table">
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>DIAMOND</th><th>SHAPE</th><th>4CS</th><th>PRICE</th><th>COLLECTION</th><th>STATUS</th><th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Loading diamonds...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No diamonds found. Add the first diamond to populate the catalogue.</td></tr>
              ) : filtered.map((diamond) => (
                <tr key={diamond.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {diamond.image && <img src={diamond.image} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />}
                      <strong>{diamond.name}</strong>
                    </div>
                  </td>
                  <td>{diamond.shape} · {diamond.carat} ct</td>
                  <td>{diamond.cut} / {diamond.color} / {diamond.clarity}</td>
                  <td>${diamond.price.toLocaleString()}</td>
                  <td><span className="badge-gold-pill">{diamond.category.toUpperCase()}</span></td>
                  <td>
                    <button type="button" className={`admin-status-toggle ${diamond.published ? 'published' : ''}`} onClick={() => void togglePublish(diamond)}>
                      {diamond.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link href={`/admin/diamonds/edit?id=${diamond.id}`} className="admin-table-action">Edit</Link>
                    <button type="button" className="admin-table-action danger" onClick={() => void removeDiamond(diamond)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
