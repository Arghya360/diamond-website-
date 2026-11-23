'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, updateProduct } from '../../../lib/firebase/admin-service';
import type { Product } from '../../../types/admin';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdjustStock = async (product: Product) => {
    if (!product.id) return;
    const current = product.stock ?? 10;
    const input = prompt(`Enter new vault stock units for "${product.name}":`, String(current));
    if (input === null) return;
    const newStock = parseInt(input, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid non-negative integer.');
      return;
    }

    try {
      await updateProduct(product.id, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
      );
      setNotice(`Vault stock for "${product.name}" updated to ${newStock} units.`);
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      alert('Error updating stock: ' + err.message);
    }
  };

  // If no products in database yet, provide standard Caritas Luxury inventory items
  const displayItems = products.length > 0
    ? products
    : [
        { id: 'inv-1', name: 'Pink Cluster Diamond Necklace', category: 'Necklaces', weight: '4.20 ct', stock: 500, availability: 'in_stock' },
        { id: 'inv-2', name: 'Teal Drop Ring & Earring Set', category: 'Rings & Sets', weight: '3.15 ct', stock: 350, availability: 'in_stock' },
        { id: 'inv-3', name: 'Fancy Pink Drop Earrings', category: 'Earrings', weight: '2.80 ct', stock: 300, availability: 'in_stock' },
        { id: 'inv-4', name: 'Pink Morganite Butterfly Ring', category: 'Rings', weight: '5.50 ct', stock: 280, availability: 'in_stock' },
        { id: 'inv-5', name: 'Emerald Eternity Band', category: 'Rings', weight: '1.95 ct', stock: 8, availability: 'in_stock' },
        { id: 'inv-6', name: 'Classic Solitaire Diamond Ring (1.50ct)', category: 'Rings', weight: '1.50 ct', stock: 70, availability: 'in_stock' },
        { id: 'inv-7', name: 'Round Brilliant Loose Diamond (D/VVS1)', category: 'Loose Diamonds', weight: '1.02 ct', stock: 150, availability: 'in_stock' },
        { id: 'inv-8', name: 'Princess Cut Loose Diamond (E/VVS2)', category: 'Loose Diamonds', weight: '1.55 ct', stock: 85, availability: 'in_stock' },
        { id: 'inv-9', name: 'Cushion Cut Pink Fancy Diamond', category: 'Loose Diamonds', weight: '2.10 ct', stock: 40, availability: 'in_stock' },
        { id: 'inv-10', name: 'Diamond Tennis Bracelet (18k Gold)', category: 'Bracelets', weight: '7.00 ct', stock: 120, availability: 'in_stock' },
        { id: 'inv-11', name: 'Oval Brilliant Cut Diamond (1.80ct)', category: 'Loose Diamonds', weight: '1.80 ct', stock: 25, availability: 'in_stock' },
        { id: 'inv-12', name: 'Pear Shape Fancy Intense Yellow Diamond', category: 'Loose Diamonds', weight: '2.50 ct', stock: 15, availability: 'in_stock' },
      ];

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

      {/* Header */}
      <div className="admin-page-hero">
        <div>
          <h1 className="admin-page-hero-title">Vault Inventory &amp; Stock Allocation</h1>
          <p className="admin-page-hero-subtitle">
            Live inventory physical vault holdings, haute jewellery reserve units, and stock allocation controls.
          </p>
        </div>

        <div className="admin-page-hero-actions">
          <Link href="/admin/products/new" className="admin-action-btn-black" style={{ padding: '8px 16px' }}>
            + Add New Piece
          </Link>
        </div>
      </div>

      {/* Table Card matching Reference */}
      <div className="admin-card-table">
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>PRODUCT</th>
                <th>CATEGORY</th>
                <th>CARAT / WEIGHT</th>
                <th>CURRENT STOCK</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item: any) => {
                const stockCount = item.stock ?? 10;
                const isLow = stockCount <= 8;

                return (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ color: '#111827', fontWeight: 600 }}>{item.name}</strong>
                    </td>
                    <td style={{ color: '#6B7280' }}>
                      {item.category || 'Fine Jewellery'}
                    </td>
                    <td style={{ color: '#6B7280' }}>
                      {item.weight || (item.name.match(/\d+(\.\d+)?\s*(ct|g)/i)?.[0] || '1.50 ct')}
                    </td>
                    <td>
                      <span className={isLow ? 'stock-val-red' : 'stock-val-green'}>
                        {stockCount} units
                      </span>
                    </td>
                    <td>
                      <span className="admin-status-pill status-green">
                        IN STOCK
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <button
                        onClick={() => handleAdjustStock(item)}
                        className="admin-action-btn-black"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
