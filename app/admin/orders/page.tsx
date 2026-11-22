'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../../lib/firebase/admin-service';
import type { Order } from '../../../types/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    setLoading(true);
    try { const data = await getOrders(); setOrders(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      setNotice(`Order updated to "${newStatus}".`);
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) { alert('Error: ' + err.message); }
  };

  const filtered = orders.filter(o => filterStatus === 'All' || o.orderStatus === filterStatus);

  return (
    <>
      {notice && <div style={{ position: 'fixed', bottom: 22, right: 22, background: '#1c1c1c', color: '#fff', padding: '12px 16px', borderRadius: 8, fontSize: 13, zIndex: 999 }}>{notice}</div>}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ font: '600 28px Playfair Display, Georgia, serif', margin: '0 0 4px' }}>Orders Management</h1>
          <p style={{ margin: 0, color: '#777b82', fontSize: 13 }}>Track purchase orders, payment, and delivery status.</p>
        </div>
        <select className="admin-select" style={{ width: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="al-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="al">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: 16 }}>Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 36, color: '#777' }}>Loading orders…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 36, color: '#777' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📦</div>
                <div>No orders yet. New orders will appear here automatically.</div>
              </td></tr>
            ) : filtered.map(o => (
              <tr key={o.id}>
                <td className="al-orderid">#{o.orderNumber || o.id?.slice(0, 7)}</td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{o.customerName || '—'}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>{o.customerEmail}</div>
                </td>
                <td style={{ fontSize: 11 }}>
                  {o.items?.map((it, i) => <div key={i}>{it.quantity}× {it.productName}</div>)}
                </td>
                <td className="al-price">${(o.total || 0).toLocaleString()}</td>
                <td>
                  <span className={`al-status ${o.paymentStatus === 'paid' ? 'delivered' : 'pending'}`}>
                    {o.paymentStatus || 'pending'}
                  </span>
                </td>
                <td><span className={`al-status ${o.orderStatus || 'pending'}`}>{o.orderStatus || 'Pending'}</span></td>
                <td style={{ textAlign: 'right', paddingRight: 16 }}>
                  {o.id && (
                    <select className="admin-select" style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }} value={o.orderStatus} onChange={e => handleStatusChange(o.id!, e.target.value as any)}>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
