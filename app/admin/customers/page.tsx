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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Customers & Inquiries
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Client directory, contact requests, and purchase history.
          </p>
        </div>

        <div style={{ width: '280px' }}>
          <input
            type="text"
            placeholder="Search by customer name or email..."
            className="admin-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Account Type</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  Loading customer records...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>👥</div>
                  <div>No client inquiries or registered customer accounts yet.</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Clients submitting inquiries or placing orders will automatically appear here.
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone || 'N/A'}</td>
                  <td>
                    <span className="badge-status badge-gold">{c.type || 'customer'}</span>
                  </td>
                  <td>{c.totalOrders || 0}</td>
                  <td>${(c.totalSpent || 0).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
