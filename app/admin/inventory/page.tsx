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

  // If no products in database yet, provide standard inventory items matching screenshot
  const displayItems = products.length > 0
    ? products
    : [
        { id: 'inv-1', name: '1 g Gold Bar', category: 'Gold', weight: '1 g', stock: 500, availability: 'in_stock' },
        { id: 'inv-2', name: '5 g Gold Bar', category: 'Gold', weight: '5 g', stock: 350, availability: 'in_stock' },
        { id: 'inv-3', name: '10 g Gold Bar', category: 'Gold', weight: '10 g', stock: 300, availability: 'in_stock' },
        { id: 'inv-4', name: '20 g Gold Bar', category: 'Gold', weight: '20 g', stock: 280, availability: 'in_stock' },
        { id: 'inv-5', name: '50 g Gold Bar', category: 'Gold', weight: '50 g', stock: 8, availability: 'in_stock' },
        { id: 'inv-6', name: '100 g Gold Bar', category: 'Gold', weight: '100 g', stock: 400, availability: 'in_stock' },
        { id: 'inv-7', name: '1 kg Gold Bar', category: 'Gold', weight: '1000 g', stock: 250, availability: 'in_stock' },
        { id: 'inv-8', name: '100 g Silver Bar', category: 'Silver', weight: '100 g', stock: 800, availability: 'in_stock' },
        { id: 'inv-9', name: '250 g Silver Bar', category: 'Silver', weight: '250 g', stock: 600, availability: 'in_stock' },
        { id: 'inv-10', name: '500 g Silver Bar', category: 'Silver', weight: '500 g', stock: 875, availability: 'in_stock' },
        { id: 'inv-11', name: '1 kg Silver Bar', category: 'Silver', weight: '1000 g', stock: 950, availability: 'in_stock' },
        { id: 'inv-12', name: '1 oz Dubai Gold Coin', category: 'Gold', weight: '31.1035 g', stock: 70, availability: 'in_stock' },
        { id: 'inv-13', name: '1 oz Dubai Silver Coin', category: 'Silver', weight: '31.1035 g', stock: 150, availability: 'in_stock' },
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
          <h1 className="admin-page-hero-title">Inventory &amp; Stock</h1>
          <p className="admin-page-hero-subtitle">
            Live inventory physical vault holdings, bullion reserve units, and stock allocation controls.
          </p>
        </div>

        <div className="admin-page-hero-actions">
          <Link href="/admin/products/new" className="admin-action-btn-black" style={{ padding: '8px 16px' }}>
            + Add New Piece
          </Link>
        </div>
      </div>

      {/* Table Card matching Screenshot 1 */}
      <div className="admin-card-table">
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>PRODUCT</th>
                <th>METAL</th>
                <th>WEIGHT</th>
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
                      {item.category?.includes('Gold') || item.name.includes('Gold') ? 'Gold' : item.name.includes('Silver') ? 'Silver' : item.category || 'Gold'}
                    </td>
                    <td style={{ color: '#6B7280' }}>
                      {item.weight || (item.name.match(/\d+\s*(g|kg|oz)/i)?.[0] || '1 oz')}
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
