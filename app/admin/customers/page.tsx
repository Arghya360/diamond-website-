'use client';

import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../../lib/firebase/admin-service';
import type { Customer } from '../../../types/admin';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCustomers().then(setCustomers).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ font: '600 28px Playfair Display, Georgia, serif', margin: '0 0 4px' }}>Customers &amp; Inquiries</h1>
          <p style={{ margin: 0, color: '#777b82', fontSize: 13 }}>Client directory, contact requests, and purchase history.</p>
        </div>
        <input type="text" placeholder="Search by name or email…" className="admin-input" style={{ width: 260 }} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="al-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="al">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 36, color: '#777' }}>Loading customers…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 36, color: '#777' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
                <div>No customers yet. Clients who place orders or submit inquiries appear here.</div>
              </td></tr>
            ) : filtered.map(c => (
              <tr key={c.id}>
                <td><strong style={{ fontSize: 12 }}>{c.name}</strong></td>
                <td style={{ fontSize: 11 }}>{c.email}</td>
                <td style={{ fontSize: 11 }}>{c.phone || '—'}</td>
                <td><span className="badge-gold">{c.type || 'customer'}</span></td>
                <td>{c.totalOrders || 0}</td>
                <td className="al-price">${(c.totalSpent || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
