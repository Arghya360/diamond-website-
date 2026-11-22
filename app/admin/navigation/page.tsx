'use client';

import React, { useEffect, useState } from 'react';
import { getNavigation, updateNavigation } from '../../../lib/firebase/admin-service';
import { INITIAL_NAVIGATION } from '../../../lib/firebase/seed-data';
import type { NavigationItem } from '../../../types/admin';

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const nav = await getNavigation();
        if (nav && nav.length > 0) {
          setItems(nav);
        } else {
          setItems(INITIAL_NAVIGATION);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleItemChange = (index: number, field: keyof NavigationItem, val: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleAddChild = (parentIndex: number) => {
    const parent = items[parentIndex];
    const newChild = {
      id: `mi-${Date.now()}`,
      label: 'New Link',
      href: '/shop',
      active: true,
    };
    const updatedChildren = [...(parent.children || []), newChild];
    handleItemChange(parentIndex, 'children', updatedChildren);
    handleItemChange(parentIndex, 'hasChildren', true);
  };

  const handleRemoveChild = (parentIndex: number, childIndex: number) => {
    const parent = items[parentIndex];
    const updatedChildren = (parent.children || []).filter((_, i) => i !== childIndex);
    handleItemChange(parentIndex, 'children', updatedChildren);
    if (updatedChildren.length === 0) {
      handleItemChange(parentIndex, 'hasChildren', false);
    }
  };

  const handleChildChange = (parentIndex: number, childIndex: number, field: 'label' | 'href' | 'active', val: any) => {
    const parent = items[parentIndex];
    const updatedChildren = (parent.children || []).map((c, i) =>
      i === childIndex ? { ...c, [field]: val } : c
    );
    handleItemChange(parentIndex, 'children', updatedChildren);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await updateNavigation(items);
      setNotice('Storefront navigation hierarchy saved successfully.');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error saving navigation: ' + err.message);
    } finally {
      setSaving(false);
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

      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— STOREFRONT ARCHITECTURE</span>
          <h1 className="admin-hero-title">Header Navigation Menu</h1>
          <p className="admin-hero-subtitle">
            Configure the 6 core navigation items, dropdown mega-menus, destination URLs, and visibility states.
          </p>
        </div>

        <div className="admin-hero-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-caritas-secondary"
          >
            <span>↗</span> Preview Live Navigation
          </a>
        </div>
      </div>

      {loading ? (
        <div className="admin-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading navigation menu...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: '960px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {items.map((item, pIdx) => (
              <div key={item.id || pIdx} className="admin-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge-caritas badge-gold">Item #{pIdx + 1}</span>
                    <strong style={{ fontFamily: 'var(--font-title)', fontSize: '15px' }}>{item.label}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({item.href})</span>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => handleItemChange(pIdx, 'active', e.target.checked)}
                    />
                    <span>Visible in Header</span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label className="admin-label">Menu Item Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={item.label}
                      onChange={(e) => handleItemChange(pIdx, 'label', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Link Destination URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={item.href}
                      onChange={(e) => handleItemChange(pIdx, 'href', e.target.value)}
                    />
                  </div>
                </div>

                {/* Sub-menu Dropdowns */}
                <div style={{ borderTop: '1px solid var(--border-line)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Dropdown Sub-Menu Links ({item.children?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddChild(pIdx)}
                      className="btn-caritas-secondary"
                      style={{ padding: '4px 12px', fontSize: '11px' }}
                    >
                      + Add Dropdown Link
                    </button>
                  </div>

                  {item.children && item.children.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.children.map((child, cIdx) => (
                        <div
                          key={child.id || cIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'var(--surface-bg)',
                            padding: '10px 14px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-line)',
                          }}
                        >
                          <span style={{ color: 'var(--primary-gold)', fontSize: '14px' }}>↳</span>
                          <input
                            type="text"
                            placeholder="Link Title"
                            className="admin-input"
                            style={{ flex: 1, padding: '7px 10px', fontSize: '12.5px' }}
                            value={child.label}
                            onChange={(e) => handleChildChange(pIdx, cIdx, 'label', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="URL Path"
                            className="admin-input"
                            style={{ flex: 1, padding: '7px 10px', fontSize: '12.5px' }}
                            value={child.href}
                            onChange={(e) => handleChildChange(pIdx, cIdx, 'href', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveChild(pIdx, cIdx)}
                            className="btn-caritas-danger"
                            style={{ padding: '6px 10px', fontSize: '11px' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Single menu item without dropdown children.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-caritas-gold"
              style={{ padding: '12px 32px' }}
            >
              {saving ? 'Publishing Menu...' : 'Save & Publish Navigation'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
