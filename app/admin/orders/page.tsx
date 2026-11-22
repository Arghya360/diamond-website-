'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../../lib/firebase/admin-service';
import type { Order } from '../../../types/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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
      setNotice(`Order #${orderId.slice(0, 6)} status updated to "${newStatus}".`);
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error updating order: ' + err.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'All') return true;
    return o.orderStatus === filterStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Orders Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--admin-muted)', fontSize: '13px' }}>
            Track client purchase orders, payment verification, and delivery fulfillment status.
          </p>
        </div>

        <div style={{ width: '180px' }}>
          <select
            className="admin-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items & Details</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th style={{ textAlign: 'right', paddingRight: '20px' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  Loading client orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-muted)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>📦</div>
                  <div>No orders recorded in Firebase yet.</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    New orders placed through the website will appear here in real time.
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <strong style={{ color: 'var(--admin-gold)' }}>#{ord.orderNumber || ord.id?.slice(0, 8)}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{ord.customerEmail}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      {ord.items?.map((it, i) => (
                        <div key={i}>
                          {it.quantity}x {it.productName}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong>${(ord.total || 0).toLocaleString()}</strong>
                  </td>
                  <td>
                    <span
                      className={`badge-status ${
                        ord.paymentStatus === 'paid' ? 'badge-published' : 'badge-draft'
                      }`}
                    >
                      {ord.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td>
                    <span className="badge-status badge-gold">{ord.orderStatus || 'pending'}</span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    {ord.id && (
                      <select
                        className="admin-select"
                        style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord.id!, e.target.value as any)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
