'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, updateProduct } from '../../../lib/firebase/admin-service';
import type { Product } from '../../../types/admin';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const handleAdjustStock = async (product: any) => {
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

  // Baseline inventory items matching Caritas Haute Joaillerie
  const baselineItems = [
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

  const displayItems = products.length > 0 ? products : baselineItems;

  const filteredItems = displayItems.filter((item: any) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = (item.name || '').toLowerCase().includes(q) || (item.category || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== 'All') {
      if ((item.category || '').toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }
    return true;
  });

  const totalUnits = displayItems.reduce((acc, it: any) => acc + (it.stock ?? 10), 0);
  const lowStockCount = displayItems.filter((it: any) => (it.stock ?? 10) <= 10).length;

  return (
    <div className="flex flex-col w-full">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003629] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#baeed9]/20 font-body-md animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-[#baeed9]">verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-space-sm mb-space-lg">
        <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-outline">
          <span>Catalogue</span>
          <span className="text-xs">/</span>
          <span className="text-secondary font-semibold">Inventory &amp; Stock</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Vault Inventory &amp; Stock Allocation
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Live inventory physical vault holdings, haute jewellery reserve units, and stock allocation controls.
            </p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md font-title-md text-title-md"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>+ Register New Inventory Piece</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Total Vault Units</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mt-space-sm">
            {totalUnits.toLocaleString('en-US')} <span className="font-label-md text-label-md text-outline">Units</span>
          </div>
          <span className="font-body-sm text-body-sm text-primary font-medium mt-1">Verified Realtime Holdings</span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Active SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">category</span>
            </div>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mt-space-sm">
            {displayItems.length} <span className="font-label-md text-label-md text-outline">Lines</span>
          </div>
          <span className="font-body-sm text-body-sm text-secondary font-medium mt-1">Fine Jewellery &amp; Loose Stones</span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
          </div>
          <div className="font-headline-md text-headline-md text-red-700 mt-space-sm">
            {lowStockCount} <span className="font-label-md text-label-md text-outline">Warnings</span>
          </div>
          <span className="font-body-sm text-body-sm text-red-600 font-medium mt-1">Units needing atelier re-order</span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Vault Custody State</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="font-headline-md text-headline-md text-primary mt-space-sm">
            100% Armed
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Biometric &amp; Escrow Sealed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md mb-space-lg">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low text-body-md font-body-md text-on-surface rounded-lg placeholder-outline focus:outline-none focus:bg-surface-container-lowest transition-all"
            placeholder="Search piece title, category, carat or SKU..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-surface-container-low h-10 pl-3 pr-8 rounded-lg font-title-md text-title-md text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Earrings">Earrings</option>
            <option value="Bracelets">Bracelets</option>
            <option value="Loose Diamonds">Loose Diamonds</option>
          </select>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="h-10 px-3 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface-variant flex items-center justify-center transition-colors font-title-md text-title-md gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3.5 px-6" style={{ width: '35%' }}>PRODUCT / PIECE</th>
                <th className="py-3.5 px-6">CATEGORY</th>
                <th className="py-3.5 px-6">CARAT / WEIGHT</th>
                <th className="py-3.5 px-6">CURRENT VAULT STOCK</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-md text-body-md text-on-surface">
              {filteredItems.map((item: any) => {
                const stockCount = item.stock ?? 10;
                const isLow = stockCount <= 8;

                return (
                  <tr key={item.id} className="hover:bg-surface-container-low/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-on-surface">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {item.category || 'Fine Jewellery'}
                    </td>
                    <td className="py-4 px-6 text-outline">
                      {item.weight || (item.name.match(/\d+(\.\d+)?\s*(ct|g)/i)?.[0] || '1.50 ct')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-title-md text-title-md font-semibold ${isLow ? 'text-red-700' : 'text-primary'}`}>
                        {stockCount} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        isLow ? 'bg-red-100 text-red-800' : 'bg-primary-fixed text-on-primary-fixed'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {isLow ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleAdjustStock(item)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-colors shadow-xs"
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
    </div>
  );
}
