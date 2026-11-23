'use client';

import React, { useEffect, useState } from 'react';
import { getNavigation, updateNavigation } from '../../../lib/firebase/admin-service';
import { INITIAL_NAVIGATION } from '../../../lib/firebase/seed-data';
import type { NavigationItem } from '../../../types/admin';

const C = {
  primary: '#003629', secondary: '#725B38', surfaceLow: '#F2F3FF',
  card: '#FFFFFF', onSurface: '#131B2E', outline: '#707974', variant: '#404945',
  border: '#EAEDFF', primaryFixed: '#BAEED9', onPrimaryFixed: '#002117',
  secondaryFixed: '#FEDEB2', onSecondaryFixed: '#78603E', container: '#EAEDFF',
};

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const nav = await getNavigation();
        setItems(nav && nav.length > 0 ? nav : INITIAL_NAVIGATION);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    load();
  }, []);

  const handleItemChange = (index: number, field: keyof NavigationItem, val: any) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: val } : item));
  };

  const handleAddChild = (parentIndex: number) => {
    const parent = items[parentIndex];
    const newChild = { id: `mi-${Date.now()}`, label: 'New Link', href: '/shop', active: true };
    handleItemChange(parentIndex, 'children', [...(parent.children || []), newChild]);
    handleItemChange(parentIndex, 'hasChildren', true);
  };

  const handleRemoveChild = (parentIndex: number, childIndex: number) => {
    const updated = (items[parentIndex].children || []).filter((_, i) => i !== childIndex);
    handleItemChange(parentIndex, 'children', updated);
    if (updated.length === 0) handleItemChange(parentIndex, 'hasChildren', false);
  };

  const handleChildChange = (parentIndex: number, childIndex: number, field: 'label' | 'href' | 'active', val: any) => {
    const updated = (items[parentIndex].children || []).map((c, i) => i === childIndex ? { ...c, [field]: val } : c);
    handleItemChange(parentIndex, 'children', updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateNavigation(items);
      setNotice('Storefront navigation saved successfully.');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) { alert('Error saving: ' + err.message); } finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {notice && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: C.primary, color: '#FFF', padding: '12px 20px', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 9999, fontSize: 13, fontWeight: 600 }}>
          {notice}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
            <span style={{ color: C.secondary }}>Storefront Architecture</span>
            <span style={{ color: C.outline }}>/</span>
            <span style={{ color: C.outline }}>Header Navigation</span>
          </div>
          <h1 style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 32, fontWeight: 500, color: C.onSurface, margin: 0 }}>
            Navigation Menu
          </h1>
          <p style={{ color: C.variant, fontSize: 13, marginTop: 4 }}>
            Configure navigation items, dropdown mega-menus, destination URLs, and visibility states.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, background: C.card, color: C.onSurface, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.secondary }}>visibility</span>
          Preview Live Navigation ↗
        </a>
      </div>

      {loading ? (
        <div style={{ background: C.card, borderRadius: 16, padding: '48px', textAlign: 'center', color: C.outline, border: `1px solid ${C.border}` }}>
          Loading navigation menu...
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960 }}>
            {items.map((item, pIdx) => (
              <div key={item.id || pIdx} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                {/* Item Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: C.surfaceLow, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 6, background: C.primaryFixed, color: C.onPrimaryFixed, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{pIdx + 1}</span>
                    <strong style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>{item.label}</strong>
                    <span style={{ fontSize: 12, color: C.outline }}>→ {item.href}</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: item.active ? C.primary : C.outline }}>
                    <div style={{ position: 'relative', width: 36, height: 20 }}>
                      <input type="checkbox" checked={item.active} onChange={(e) => handleItemChange(pIdx, 'active', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: item.active ? C.primary : '#ccc', transition: '0.2s' }}></div>
                      <div style={{ position: 'absolute', top: 2, left: item.active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#FFF', transition: '0.2s' }}></div>
                    </div>
                    Visible in Header
                  </label>
                </div>

                {/* Item Fields */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline, marginBottom: 6 }}>Menu Item Title</label>
                      <input type="text" value={item.label} onChange={(e) => handleItemChange(pIdx, 'label', e.target.value)} style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.onSurface, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline, marginBottom: 6 }}>Link Destination URL</label>
                      <input type="text" value={item.href} onChange={(e) => handleItemChange(pIdx, 'href', e.target.value)} style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, color: C.onSurface, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  {/* Sub-menu */}
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.outline }}>
                        Dropdown Sub-Links ({item.children?.length || 0})
                      </span>
                      <button type="button" onClick={() => handleAddChild(pIdx)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.card, color: C.onSurface, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span> Add Link
                      </button>
                    </div>
                    {item.children && item.children.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {item.children.map((child, cIdx) => (
                          <div key={child.id || cIdx} style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surfaceLow, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}` }}>
                            <span style={{ color: C.secondary, fontSize: 16, flexShrink: 0 }}>↳</span>
                            <input type="text" placeholder="Link Title" value={child.label} onChange={(e) => handleChildChange(pIdx, cIdx, 'label', e.target.value)} style={{ flex: 1, height: 36, padding: '0 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.onSurface, outline: 'none', background: C.card }} />
                            <input type="text" placeholder="URL Path" value={child.href} onChange={(e) => handleChildChange(pIdx, cIdx, 'href', e.target.value)} style={{ flex: 1, height: 36, padding: '0 10px', borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, color: C.onSurface, outline: 'none', background: C.card }} />
                            <button type="button" onClick={() => handleRemoveChild(pIdx, cIdx)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #FFD6D6', background: '#FFF5F5', color: '#BA1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: C.outline, fontStyle: 'italic' }}>Single menu item — no dropdown children.</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
              <button type="submit" disabled={saving} style={{ padding: '12px 32px', borderRadius: 8, background: saving ? C.variant : C.primary, color: '#FFF', fontSize: 14, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0,54,41,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{saving ? 'sync' : 'save'}</span>
                {saving ? 'Publishing Navigation...' : 'Save & Publish Navigation'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
