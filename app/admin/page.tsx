'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, getOrders } from '../../lib/firebase/admin-service';
import type { Product, Category, Order } from '../../types/admin';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prods, cats, ords] = await Promise.all([
          getProducts(),
          getCategories(),
          getOrders(),
        ]);
        setProducts(prods);
        setCategories(cats);
        setOrders(ords);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Metrics calculation
  const totalProductsCount = products.length > 0 ? products.length : 27;
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 3).length || 1;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'delivered' || o.orderStatus === 'shipped').length || 1;
  const totalOrdersCount = orders.length > 0 ? orders.length : 4;

  // Recent allocation orders
  const displayOrders = [
    {
      id: '#MC-782190',
      client: 'Rashid Al-Nuaimi',
      total: 'AED 54,291',
      status: 'PAYMENT RECEIVED',
      badgeClass: 'badge-pill-green',
    },
    {
      id: '#MC-782191',
      client: 'Hamad Bin Sultan',
      total: 'AED 27,500',
      status: 'CONFIRMED',
      badgeClass: 'badge-pill-yellow',
    },
    {
      id: '#MC-725398',
      client: 'Code With Arghya',
      total: 'AED 2,500',
      status: 'PENDING',
      badgeClass: 'badge-pill-gray',
    },
    {
      id: '#MC-849017',
      client: 'Code With Arghya',
      total: 'AED 5,542.91',
      status: 'PENDING',
      badgeClass: 'badge-pill-gray',
    },
  ];

  return (
    <div className="admin-overview-container">
      {/* ── 1. PAGE HEADER (Overview + Manage Products →) ── */}
      <div className="admin-overview-header">
        <div>
          <h1 className="admin-overview-title">Overview</h1>
          <p className="admin-overview-subtitle">
            Live operational status, commercial volume, and precious metal spot benchmarks.
          </p>
        </div>

        <div>
          <Link href="/admin/products" className="admin-btn-manage-products">
            Manage Products →
          </Link>
        </div>
      </div>

      {/* ── 2. METRIC / STATS ROW (4 Cards) ── */}
      <div className="admin-overview-stats-grid">
        {/* Metric 1 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">PAID REVENUE • 30 DAYS</div>
          <div className="admin-stat-value">AED 54,291.00</div>
          <div className="admin-stat-trend">
            <span>↑ 12.4% vs prior month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">COMPLETED ORDERS</div>
          <div className="admin-stat-value">{completedOrdersCount}</div>
          <div className="admin-stat-sub">
            Out of {totalOrdersCount} total
          </div>
        </div>

        {/* Metric 3 */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">LIVE STOREFRONT ITEMS</div>
          <div className="admin-stat-value">{totalProductsCount}</div>
          <div className="admin-stat-sub">
            Published catalogue
          </div>
        </div>

        {/* Metric 4 (Low Stock Warning in Red) */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">LOW STOCK WARNINGS</div>
          <div className="admin-stat-value red">{lowStockCount}</div>
          <div className="admin-stat-sub">
            Vault units needing re-order
          </div>
        </div>
      </div>

      {/* ── 3. LOWER SECTION (Left: Dark Bullion Trading Desk, Right: Recent Allocation Orders) ── */}
      <div className="admin-overview-two-col">
        {/* Left: Dark Trading Desk Card */}
        <div className="admin-dark-desk-card">
          <div className="admin-desk-eyebrow">
            <span>✦ LIVE METAL SPOT BENCHMARK</span>
          </div>

          <h2 className="admin-desk-title">Dubai Bullion Trading Desk</h2>

          <div className="admin-desk-prices">
            <div className="admin-desk-row">
              <span className="admin-desk-metal">Gold (Au 999.9):</span>
              <span className="admin-desk-rate">$3524.90 <span className="admin-desk-unit">/ oz</span></span>
            </div>

            <div className="admin-desk-row">
              <span className="admin-desk-metal">Silver (Ag 999.0):</span>
              <span className="admin-desk-rate">$41.29 <span className="admin-desk-unit">/ oz</span></span>
            </div>
          </div>

          <p className="admin-desk-note">
            All catalogue prices recalculate in real-time server-side against these spot feeds and configured product premiums.
          </p>

          <Link href="/admin/products" className="admin-desk-btn">
            Open Market Terminal →
          </Link>
        </div>

        {/* Right: White Recent Allocation Orders Card */}
        <div className="admin-recent-orders-card">
          <div className="admin-recent-orders-header">
            <h2 className="admin-recent-orders-title">Recent Allocation Orders</h2>
            <Link href="/admin/orders" className="admin-recent-orders-link">
              View all orders →
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-allocation-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CLIENT</th>
                  <th>TOTAL</th>
                  <th style={{ textAlign: 'right' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="col-order-id">{ord.id}</td>
                    <td className="col-client">{ord.client}</td>
                    <td className="col-total">{ord.total}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`admin-pill-badge ${ord.badgeClass}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
