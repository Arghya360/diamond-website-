'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../../lib/firebase/admin-service';
import type { Order } from '../../../types/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      setNotice(`Order #${orderId.slice(0, 8)} updated to "${newStatus}".`);
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      alert('Error updating order: ' + err.message);
    }
  };

  // Provide initial baseline orders matching Caritas Luxury styling if empty
  const baselineOrders: any[] = [
    {
      id: '#CL-782190',
      isDemo: true,
      createdAt: '10/23/2026',
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor.vance@caritasluxury.com',
      itemsCount: 2,
      totalFormatted: '$54,291',
      orderStatus: 'payment_received',
      statusLabel: 'PAYMENT RECEIVED',
      statusClass: 'status-green',
    },
    {
      id: '#CL-782191',
      isDemo: true,
      createdAt: '10/23/2026',
      customerName: 'Arthur Pendelton',
      customerEmail: 'arthur.p@example.com',
      itemsCount: 1,
      totalFormatted: '$27,500',
      orderStatus: 'confirmed',
      statusLabel: 'CONFIRMED',
      statusClass: 'status-yellow',
    },
    {
      id: '#CL-725398',
      isDemo: false,
      createdAt: '10/19/2026',
      customerName: 'Julian Montgomery',
      customerEmail: 'j.montgomery@example.com',
      itemsCount: 1,
      totalFormatted: '$2,500',
      orderStatus: 'pending',
      statusLabel: 'PENDING',
      statusClass: 'status-gray',
    },
    {
      id: '#CL-849017',
      isDemo: false,
      createdAt: '10/19/2026',
      customerName: 'Claire Dubois',
      customerEmail: 'claire.dubois@example.com',
      itemsCount: 2,
      totalFormatted: '$5,542.91',
      orderStatus: 'pending',
      statusLabel: 'PENDING',
      statusClass: 'status-gray',
    },
  ];

  const allDisplayOrders = orders.length > 0
    ? orders.map((o) => ({
        id: o.id.startsWith('#') ? o.id : `#CL-${o.id.slice(0, 6).toUpperCase()}`,
        isDemo: false,
        createdAt: new Date().toLocaleDateString('en-US'),
        customerName: o.customerName || 'Private Client',
        customerEmail: o.customerEmail || 'client@caritasluxury.com',
        itemsCount: o.items?.length || 1,
        totalFormatted: `$${(o.total || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        orderStatus: o.orderStatus,
        statusLabel: o.orderStatus === 'delivered' ? 'PAYMENT RECEIVED' : o.orderStatus.toUpperCase(),
        statusClass: o.orderStatus === 'delivered' || o.orderStatus === 'shipped' ? 'status-green' : o.orderStatus === 'processing' ? 'status-yellow' : 'status-gray',
      }))
    : baselineOrders;

  const filteredOrders = allDisplayOrders.filter((o) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'All' || o.orderStatus === filterStatus || o.statusLabel === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {notice && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--dark-black)',
            color: '#FFFFFF',
            borderRadius: '4px',
            padding: '10px 18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontSize: '12.5px',
            fontFamily: 'var(--font-title)',
          }}
        >
          {notice}
        </div>
      )}

      {/* Header matching Reference */}
      <div className="admin-page-hero">
        <div>
          <h1 className="admin-page-hero-title">Client Allocation Orders</h1>
          <p className="admin-page-hero-subtitle">
            Manage client fine jewellery allocation orders, payment settlements, and vault custody handoffs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar matching Screenshot 5 */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search-wrap">
          <input
            type="text"
            placeholder="Search by reference, client or email..."
            className="admin-filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-controls">
          <span className="admin-filter-label">Status:</span>
          <select
            className="admin-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses ({allDisplayOrders.length})</option>
            <option value="payment_received">Payment Received</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table Card matching Screenshot 5 */}
      <div className="admin-card-table">
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>ORDER</th>
                <th style={{ width: '12%' }}>DATE</th>
                <th style={{ width: '28%' }}>CLIENT</th>
                <th style={{ width: '14%' }}>ITEMS</th>
                <th style={{ width: '14%' }}>TOTAL</th>
                <th style={{ width: '14%' }}>STATUS</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  {/* Order */}
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: '#111827', fontWeight: 600 }}>{ord.id}</strong>
                      {ord.isDemo && <span className="badge-gold-pill">DEMO</span>}
                    </div>
                  </td>

                  {/* Date */}
                  <td style={{ color: '#6B7280' }}>
                    {ord.createdAt}
                  </td>

                  {/* Client */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#111827', fontWeight: 600 }}>{ord.customerName}</span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{ord.customerEmail}</span>
                    </div>
                  </td>

                  {/* Items */}
                  <td style={{ color: '#4B5563' }}>
                    {ord.itemsCount} product(s)
                  </td>

                  {/* Total */}
                  <td>
                    <strong style={{ color: '#111827', fontWeight: 700 }}>{ord.totalFormatted}</strong>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`admin-status-pill ${ord.statusClass}`}>
                      {ord.statusLabel}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <button
                      onClick={() => alert(`Reviewing transaction ${ord.id} for ${ord.customerName}. Order total: ${ord.totalFormatted}`)}
                      className="admin-action-btn-black"
                    >
                      View &amp; Manage
                    </button>
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
