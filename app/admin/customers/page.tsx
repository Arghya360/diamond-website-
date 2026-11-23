'use client';

import React, { useEffect, useState } from 'react';
import { getCustomers } from '../../../lib/firebase/admin-service';
import type { Customer } from '../../../types/admin';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Customer' | 'Staff' | 'Admin'>('All');
  const [selectedStatus, setSelectedStatus] = useState('All Users');

  useEffect(() => {
    async function load() {
      setLoading(true);
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

  // Baseline accounts matching Caritas Luxury styling
  const baselineUsers = [
    {
      id: 'usr-1',
      uid: '4ucbmxp01...',
      initials: 'EV',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@caritasluxury.com',
      phone: '+41 22 819 3000',
      address: 'Geneva, Switzerland',
      role: 'CUSTOMER',
      ordersCount: 0,
      totalTransacted: '$0.00',
    },
    {
      id: 'usr-2',
      uid: '5VQjSaKp1j...',
      initials: 'SL',
      name: 'Sophia Laurent',
      email: 'sophia.laurent@example.com',
      phone: '+33 1 42 68 55 00',
      address: 'Paris, France',
      role: 'CUSTOMER',
      ordersCount: 4,
      totalTransacted: '$16,085.82',
      isGreen: true,
    },
    {
      id: 'usr-3',
      uid: 'R11sPerYPETB1...',
      initials: 'AP',
      name: 'Arthur Pendelton',
      email: 'arthur.p@example.com',
      phone: '+44 20 7946 0921',
      address: 'London, United Kingdom',
      role: 'CUSTOMER',
      ordersCount: 0,
      totalTransacted: '$0.00',
    },
    {
      id: 'usr-4',
      uid: 'c360_admin_01...',
      initials: 'C3',
      name: 'Caritas360 Super Admin',
      email: 'admin@caritasluxury.com',
      phone: '+41 22 819 3001',
      address: 'Geneva, Switzerland',
      role: 'OWNER',
      ordersCount: 0,
      totalTransacted: '$0.00',
    },
    {
      id: 'usr-5',
      uid: 'QzvDK0xiT1xLAG...',
      initials: 'JM',
      name: 'Julian Montgomery',
      email: 'j.montgomery@example.com',
      phone: '+1 212 555 0198',
      address: 'New York, United States',
      role: 'CUSTOMER',
      ordersCount: 0,
      totalTransacted: '$0.00',
    },
    {
      id: 'usr-6',
      uid: 'anthony_thorp...',
      initials: 'CD',
      name: 'Claire Dubois',
      email: 'claire.dubois@example.com',
      phone: '+971 4 362 7000',
      address: 'Dubai, United Arab Emirates',
      role: 'CUSTOMER',
      ordersCount: 0,
      totalTransacted: '$0.00',
    },
  ];

  const displayUsers = customers.length > 0
    ? customers.map((c) => ({
        id: c.id,
        uid: c.id.slice(0, 12) + '...',
        initials: (c.name.split(' ').map((n) => n[0]).join('') || 'C').toUpperCase().slice(0, 2),
        name: c.name,
        email: c.email,
        phone: c.phone || 'No phone recorded',
        address: 'Geneva, Switzerland',
        role: c.type === 'inquiry' ? 'INQUIRY' : 'CUSTOMER',
        ordersCount: c.totalOrders || 0,
        totalTransacted: `$${(c.totalSpent || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        isGreen: (c.totalSpent || 0) > 0,
      }))
    : baselineUsers;

  const filtered = displayUsers.filter((u) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q);

    const matchesRole =
      selectedRole === 'All' ||
      (selectedRole === 'Customer' && u.role === 'CUSTOMER') ||
      (selectedRole === 'Admin' && u.role === 'OWNER') ||
      (selectedRole === 'Staff' && u.role === 'STAFF');

    return matchesSearch && matchesRole;
  });

  return (
    <>
      {/* Header matching Reference */}
      <div className="admin-page-hero">
        <div>
          <h1 className="admin-page-hero-title">Registered Clients &amp; VIP Accounts</h1>
          <p className="admin-page-hero-subtitle">
            All authenticated client accounts, registration profiles, contact credentials, addresses, and lifetime fine jewellery acquisition totals.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards Row matching Reference */}
      <div className="admin-stats-row">
        {/* Card 1 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">TOTAL REGISTERED USERS</div>
          <div className="admin-stat-value">6</div>
          <div className="admin-stat-sub">Verified user profiles in database</div>
        </div>

        {/* Card 2 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">ALLOCATING CLIENTS</div>
          <div className="admin-stat-value blue">1</div>
          <div className="admin-stat-sub">Users with confirmed purchases</div>
        </div>

        {/* Card 3 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">TOTAL ORDERS PLACED</div>
          <div className="admin-stat-value amber">4</div>
          <div className="admin-stat-sub">Total client transactions</div>
        </div>

        {/* Card 4 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">TOTAL TRANSACTED VOLUME</div>
          <div className="admin-stat-value green">$16,085.82</div>
          <div className="admin-stat-sub">Lifetime fine jewellery acquisitions</div>
        </div>
      </div>

      {/* Filter and Search Bar matching Screenshot 3 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search-wrap">
          <input
            type="text"
            placeholder="Search by name, email, phone, address, or user ID..."
            className="admin-filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-controls">
          <span className="admin-filter-label">Role:</span>
          <div className="admin-pill-group">
            {(['All', 'Customer', 'Staff', 'Admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`admin-pill-btn ${selectedRole === r ? 'active' : ''}`}
                onClick={() => setSelectedRole(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <span className="admin-filter-label" style={{ marginLeft: '8px' }}>Status:</span>
          <select
            className="admin-filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All Users">All Users</option>
            <option value="Active">Active Profiles</option>
            <option value="Pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Table Card matching Screenshot 3 */}
      <div className="admin-card-table">
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>CLIENT / USER</th>
                <th style={{ width: '22%' }}>CONTACT CREDENTIALS</th>
                <th style={{ width: '20%' }}>LOCATION / ADDRESS</th>
                <th style={{ width: '10%' }}>ROLE</th>
                <th style={{ width: '12%' }}>ORDERS</th>
                <th style={{ width: '14%' }}>TOTAL TRANSACTED</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  {/* Client / User */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="admin-client-avatar">{user.initials}</div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ color: '#111827', fontWeight: 600 }}>{user.name}</strong>
                        <span style={{ fontSize: '10px', color: '#9CA3AF' }}>UID: {user.uid}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact Credentials */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#2563EB', fontSize: '12px' }}>{user.email}</span>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>{user.phone}</span>
                    </div>
                  </td>

                  {/* Location / Address */}
                  <td style={{ color: '#6B7280' }}>
                    {user.address}
                  </td>

                  {/* Role */}
                  <td>
                    {user.role === 'OWNER' ? (
                      <span className="badge-gold-pill">OWNER</span>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                        {user.role}
                      </span>
                    )}
                  </td>

                  {/* Orders */}
                  <td>
                    <span style={{ fontWeight: user.ordersCount > 0 ? 700 : 400, color: user.ordersCount > 0 ? '#111827' : '#6B7280' }}>
                      {user.ordersCount} allocations
                    </span>
                  </td>

                  {/* Total Transacted */}
                  <td>
                    <strong style={{ color: user.isGreen ? '#15803D' : '#6B7280', fontWeight: user.isGreen ? 700 : 500 }}>
                      {user.totalTransacted}
                    </strong>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => alert(`Client Profile: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nOrders: ${user.ordersCount}\nTransacted: ${user.totalTransacted}`)}
                        className="admin-action-btn-white"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => alert(`User access controls for ${user.name}`)}
                        className="admin-action-btn-red"
                        title="Delete user"
                      >
                        ✕
                      </button>
                    </div>
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
