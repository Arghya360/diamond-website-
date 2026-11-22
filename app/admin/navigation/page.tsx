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

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `mi-${Date.now()}`,
        label: 'New Menu Item',
        href: '/shop',
        hasChildren: false,
        order: prev.length + 1,
        active: true,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (!confirm('Remove this top-level menu item?')) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setItems(reordered);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      await updateNavigation(items);
      setNotice('Header navigation menu successfully updated in Firebase!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error updating navigation: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading navigation items...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Header Navigation Menu Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Edit labels, destinations, and dropdown menus for the site header navigation.
          </p>
        </div>

        <button type="button" onClick={handleAddItem} className="btn-gold">
          <span>+</span> Add Menu Item
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

      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="admin-card"
              style={{ margin: 0, border: '1px solid var(--admin-border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    style={{ background: 'none', border: '1px solid var(--admin-border)', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    style={{ background: 'none', border: '1px solid var(--admin-border)', color: '#fff', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ▼
                  </button>
                  <strong style={{ color: 'var(--admin-gold)', fontSize: '14px' }}>
                    Menu #{idx + 1}
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => handleItemChange(idx, 'active', e.target.checked)}
                      style={{ accentColor: 'var(--admin-gold)' }}
                    />
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="btn-danger"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Main item inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-label">Menu Label</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={item.label}
                    onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                  />
                </div>
                <div>
                  <label className="admin-label">Destination URL</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={item.href}
                    onChange={(e) => handleItemChange(idx, 'href', e.target.value)}
                  />
                </div>
              </div>

              {/* Sub-menu Dropdowns */}
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#0c1315', borderRadius: '6px', border: '1px solid var(--admin-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--admin-muted)', fontWeight: 600 }}>
                    Sub-menu Dropdown Items ({item.children?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddChild(idx)}
                    className="btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                  >
                    + Add Dropdown Item
                  </button>
                </div>

                {item.children && item.children.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.children.map((child, cIdx) => (
                      <div key={child.id || cIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Sub-item Label"
                          className="admin-input"
                          style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}
                          value={child.label}
                          onChange={(e) => handleChildChange(idx, cIdx, 'label', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="/path"
                          className="admin-input"
                          style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}
                          value={child.href}
                          onChange={(e) => handleChildChange(idx, cIdx, 'href', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(idx, cIdx)}
                          className="btn-danger"
                          style={{ padding: '6px 10px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-muted)' }}>
                    No dropdown sub-items. This item functions as a single direct link.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ padding: '12px 36px', fontSize: '15px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Updating Firebase...' : 'Save Navigation Menu'}
          </button>
        </div>
      </form>
    </div>
  );
}
