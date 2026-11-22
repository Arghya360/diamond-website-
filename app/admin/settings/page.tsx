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
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
          System Settings & Administrator Access
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
          Manage administrator permissions, review Firebase infrastructure, and perform maintenance syncs.
        </p>
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

      {/* Admin Profile */}
      <div className="admin-card">
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
          1. Current Administrator Profile
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div>
            <span style={{ color: 'var(--admin-muted)' }}>Signed-in Email:</span>
            <div style={{ fontWeight: 600, color: 'var(--admin-text)', marginTop: '4px' }}>
              {user?.email || 'N/A'}
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--admin-muted)' }}>Assigned Role:</span>
            <div style={{ fontWeight: 600, color: 'var(--admin-gold)', marginTop: '4px' }}>
              {adminProfile?.role === 'super_admin' ? 'Master Super Administrator' : 'Administrator'}
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--admin-muted)' }}>Authentication Provider:</span>
            <div style={{ fontWeight: 600, color: '#34d399', marginTop: '4px' }}>
              Firebase Auth (Email/Password)
            </div>
          </div>
        </div>
      </div>

      {/* Administrator Management */}
      <div className="admin-card">
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
          2. Manage Authorized Administrators
        </h3>

        {/* Existing admins */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: 'var(--admin-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Active Administrators ({admins.length})
          </div>
          {loading ? (
            <p style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>Loading admin accounts...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {admins.map((adm, i) => (
                <div
                  key={adm.uid || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#0c1315',
                    borderRadius: '6px',
                    border: '1px solid var(--admin-border)',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--admin-text)', fontSize: '13px' }}>{adm.email}</strong>
                    {adm.displayName && (
                      <span style={{ color: 'var(--admin-muted)', fontSize: '12px', marginLeft: '8px' }}>
                        ({adm.displayName})
                      </span>
                    )}
                  </div>
                  <span className="badge-status badge-gold">{adm.role || 'admin'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new admin */}
        <form onSubmit={handleAddAdmin} style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '12px' }}>
            Grant Administrator Access to Another Team Member
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label className="admin-label">Member Email *</label>
              <input
                type="email"
                required
                placeholder="colleague@domain.com"
                className="admin-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Display Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="admin-input"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Role</label>
              <select
                className="admin-select"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
              >
                <option value="admin">Administrator (Full Access)</option>
                <option value="editor">Editor (Products & Content Only)</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={savingAdmin} className="btn-gold" style={{ fontSize: '13px' }}>
            {savingAdmin ? 'Granting Access...' : '+ Authorize New Administrator'}
          </button>
        </form>
      </div>

      {/* Firebase Infrastructure details & Resync */}
      <div className="admin-card">
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--admin-text)' }}>
          3. Firebase Backend Connection Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--admin-muted)' }}>Firebase Project:</span>
            <span>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Ready for new Firebase account'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--admin-muted)' }}>Collection Prefix:</span>
            <span style={{ color: 'var(--admin-gold)' }}>caritas_* (100% Isolated from other websites)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--admin-muted)' }}>Storage Bucket:</span>
            <span>{process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Pending new account setup'}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '6px' }}>
            Website Data Maintenance Sync
          </div>
          <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--admin-muted)' }}>
            Safely re-sync the baseline website database with all original products, categories, hero slides, and settings.
          </p>
          <button onClick={handleSyncData} disabled={seeding} className="btn-secondary">
            {seeding ? 'Syncing...' : '⚡ Re-Sync Default Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
