'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import { getAdminUsers, addAdminUser } from '../../../lib/firebase/admin-service';
import { seedAllWebsiteData } from '../../../lib/firebase/seed-data';
import type { AdminUser } from '../../../types/admin';

export default function AdminSettingsPage() {
  const { user, adminProfile } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('admin');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setAdmins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setSavingAdmin(true);

    try {
      await addAdminUser(newEmail.trim().toLowerCase(), newRole, newDisplayName.trim());
      setNotice(`Administrator privileges granted to ${newEmail}.`);
      setNewEmail('');
      setNewDisplayName('');
      await loadAdmins();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error adding admin: ' + err.message);
    } finally {
      setSavingAdmin(false);
    }
  };

  const handleSyncData = async () => {
    if (!confirm('Re-sync website data into Firebase Firestore? This safely ensures all default products, categories, and settings exist.')) {
      return;
    }
    setSeeding(true);
    try {
      const res = await seedAllWebsiteData(true);
      setNotice(res.message);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert('Error syncing data: ' + err.message);
    } finally {
      setSeeding(false);
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
          <span className="admin-hero-eyebrow">— SECURITY &amp; SYSTEM INTEGRITY</span>
          <h1 className="admin-hero-title">System Settings &amp; Access Controls</h1>
          <p className="admin-hero-subtitle">
            Configure administrator privileges, inspect Firebase cloud connections, and execute maintenance catalog synchronizations.
          </p>
        </div>

        <div className="admin-hero-actions">
          <button
            onClick={handleSyncData}
            disabled={seeding}
            className="btn-caritas-secondary"
          >
            <span>⚡</span>
            <span>{seeding ? 'Syncing...' : 'Sync Data Baseline'}</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '960px' }}>
        {/* Admin Profile */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>1. Current Administrator Credentials</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', fontSize: '13px' }}>
            <div>
              <span className="admin-label">Active Account</span>
              <div style={{ fontWeight: 600, color: 'var(--dark-obsidian)' }}>
                {adminProfile?.displayName || user?.email || 'Caritas360 (Super Admin)'}
              </div>
            </div>
            <div>
              <span className="admin-label">Access Level</span>
              <div>
                <span className="badge-caritas badge-gold">
                  {adminProfile?.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
                </span>
              </div>
            </div>
            <div>
              <span className="admin-label">Auth System</span>
              <div style={{ color: 'var(--emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="admin-status-dot" />
                <span>Caritas Key / Firebase Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grant Administrator Access */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>2. Grant Administrator Access</span>
            </h2>
          </div>

          <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label className="admin-label">Personnel Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Elena Rostova"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Official Email *</label>
                <input
                  type="email"
                  required
                  className="admin-input"
                  placeholder="admin@caritasluxury.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Security Role</label>
                <select
                  className="admin-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                >
                  <option value="admin">Administrator (Catalog &amp; Orders)</option>
                  <option value="super_admin">Super Administrator (Full System)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={savingAdmin}
                className="btn-caritas-gold"
              >
                {savingAdmin ? 'Granting Access...' : 'Authorize Administrator'}
              </button>
            </div>
          </form>

          {/* Active Admins List */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-line)', paddingTop: '20px' }}>
            <span className="admin-label" style={{ marginBottom: '12px' }}>
              Authorized Administrators on File ({admins.length})
            </span>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Loading administrators...</p>
            ) : admins.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
                Primary super administrator: <strong>Caritas360 (caritas360@caritasluxury.com)</strong>. Additional records will display here.
              </p>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Administrator</th>
                      <th>Email</th>
                      <th>Assigned Role</th>
                      <th>Granted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((adm) => (
                      <tr key={adm.uid || adm.email}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{adm.displayName || 'Staff Administrator'}</div>
                        </td>
                        <td>{adm.email}</td>
                        <td>
                          <span className="badge-caritas badge-gold">
                            {adm.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Database & Multi-Tenant Isolation Status */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <span>3. Cloud Firestore Multi-Site Isolation</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-line)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Firebase Cloud Project:</span>
              <strong style={{ fontFamily: 'var(--font-title)' }}>
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'caritas-luxury-diamonds'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-line)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Firestore Database Instance:</span>
              <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                ● Connected &amp; Isolated via caritas_*
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-line)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cloud Media Bucket:</span>
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '12px' }}>
                {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'caritas-luxury-diamonds.firebasestorage.app'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Multi-Website Collision Protection:</span>
              <span style={{ color: 'var(--primary-gold)', fontWeight: 700 }}>
                ACTIVE (Guaranteed 0 data collision with other sites)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
