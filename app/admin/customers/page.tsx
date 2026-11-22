'use client';

import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../../lib/firebase/admin-service';
import type { Customer } from '../../../types/admin';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <span className="admin-hero-eyebrow">— CLIENT RELATIONSHIPS &amp; INQUIRIES</span>
          <h1 className="admin-hero-title">Client Directory &amp; Concierge</h1>
          <p className="admin-hero-subtitle">
            Private client dossiers, bespoke jewellery consultation inquiries, and lifetime diamond purchase histories.
          </p>
        </div>

        <div className="admin-hero-actions">
          <input
            type="text"
            placeholder="Search by client name or email..."
            className="admin-input"
            style={{ width: '280px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email Address</th>
                <th>Phone Contact</th>
                <th>Client Tier</th>
                <th>Orders Placed</th>
                <th>Lifetime Value</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    Loading client records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text-main)' }}>No client records currently registered</p>
                    <p style={{ margin: 0, fontSize: '12px' }}>
                      Clients submitting contact requests or purchasing diamond pieces will automatically appear in this directory.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-prod-name">{c.name}</div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td>
                      <span className="badge-caritas badge-gold">
                        {c.type === 'inquiry' ? 'Concierge Inquiry' : 'Registered Client'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.totalOrders || 0}</td>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-title)', color: 'var(--primary-gold)' }}>
                        ${(c.totalSpent || 0).toLocaleString()}
                      </strong>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
