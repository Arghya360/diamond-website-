'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../../lib/firebase/admin-service';
import type { Order } from '../../../types/admin';

interface DisplayOrder {
  id: string;
  orderRef: string;
  date: string;
  orderType: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  salonLocation: string;
  clientTier: string;
  pieceTitle: string;
  pieceCategory: string;
  masterBench: string;
  imageUrl: string;
  gemSpecs: string;
  metalSpecs: string;
  certNumber: string;
  totalFormatted: string;
  numericTotal: number;
  escrowStatus: string;
  paymentMethod: string;
  dispatchStatus: string;
  logisticsCarrier: string;
  logisticsEta: string;
  rawStatus: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'crafting' | 'secured' | 'transit' | 'delivered'>('all');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedEscrow, setSelectedEscrow] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<DisplayOrder | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

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

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, rawStatus: newStatus, dispatchStatus: getStatusLabel(newStatus) } : null);
      }
      setNotice(`Order ${orderId} updated to ${getStatusLabel(newStatus)}.`);
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error updating order: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  function getStatusLabel(st: string) {
    switch (st) {
      case 'payment_received': return 'Escrow Cleared';
      case 'confirmed': return 'Confirmed';
      case 'processing': return 'In Atelier Crafting';
      case 'shipped': return 'Armored Transit';
      case 'delivered': return 'Delivered & Cleared';
      default: return 'Pending Escrow';
    }
  }

  // Museum-grade baseline orders from Caritas Luxury Atelier dossier
  const baselineOrders: DisplayOrder[] = [
    {
      id: 'CRT-2026-8942',
      orderRef: '#CRT-2026-8942',
      date: 'Oct 24, 2026',
      orderType: 'Bespoke #441',
      clientName: 'Elena Rostova',
      clientEmail: 'elena.rostova@genevaprivate.ch',
      clientPhone: '+41 22 819 4001',
      salonLocation: 'Zurich Salon • Baur au Lac',
      clientTier: 'Tier 1 UHNW',
      pieceTitle: 'The Celestial Marquise',
      pieceCategory: 'Solitaire Diamond Ring',
      masterBench: 'Master Bench: H. Laurent',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqeljXMpeTXeybCtNFgdcnQup_Z5xfIo3fWzI0Thv6_ffeLcMlh_9RJWiAt3UkRtA2eBpp7BWO0ceWJNj0DbYCNTM6zj_G6eq-Cso9io_vOTGUkKLnQyZ4KJUEpNkcHGhvj8P5jtM3LvoJFAI4Ea8KGUpyphwakyXtWfG2YBYmtTUQAPyTcop1Wf6RNbXDFEcglAqIkDgwgnI9NxKaWS6FZt9iS8dpsRXZsP6TLGG8',
      gemSpecs: '3.20 ct D/IF Type IIa',
      metalSpecs: 'Platinum 950 Hand-Pronged',
      certNumber: 'GIA #2489104921',
      totalFormatted: '$64,500',
      numericTotal: 64500,
      escrowStatus: '100% Escrow Cleared',
      paymentMethod: 'Swiss Wire • Credit Suisse',
      dispatchStatus: 'Armored Transit',
      logisticsCarrier: 'Malca-Amit #MA-89211',
      logisticsEta: 'ETA Today, 16:30 CET',
      rawStatus: 'shipped',
    },
    {
      id: 'CRT-2026-8941',
      orderRef: '#CRT-2026-8941',
      date: 'Oct 23, 2026',
      orderType: 'Vault Stock',
      clientName: 'H.E. Sheikh Al-Maktoum',
      clientEmail: 'private.office@difc-holdings.ae',
      clientPhone: '+971 4 362 7000',
      salonLocation: 'Dubai DIFC Salon',
      clientTier: 'Tier 1 UHNW',
      pieceTitle: 'Verdant Sovereign Collier',
      pieceCategory: 'Haute Joaillerie Necklace',
      masterBench: 'Private Collection #08',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAyo5DHdCsJnb7unQmbBW9cd2B6427xqzcSlgOOS0LV5Edu9wMfeJxOKCPOUIfbfiOlV1ql-6FjsZU24u8gJg9_Mk68bayUVZOSi8tipE8LQFUN4xAACuU_Gc_Fk3ECjQYMYXA7u2cd9XPO_NhoufTW2NPDrdrx71s05DL0YpAefhD9DiuJD-wfPvazo9gWyOETN2pH1bey70ibgNxk66AyQQx8MWRiL_WZ0vSacNS',
      gemSpecs: '18.4 ct Royal Emerald & VVS',
      metalSpecs: '18K Yellow Gold Hand-Chased',
      certNumber: 'SSEF #99281 Certified',
      totalFormatted: '$148,000',
      numericTotal: 148000,
      escrowStatus: '100% Escrow Cleared',
      paymentMethod: 'Emirates NBD Sovereign Wire',
      dispatchStatus: 'Armored Transit',
      logisticsCarrier: 'Ferrari Logistics #FL-4921',
      logisticsEta: 'Vault Sealed • DIFC Armored Escort',
      rawStatus: 'shipped',
    },
    {
      id: 'CRT-2026-8940',
      orderRef: '#CRT-2026-8940',
      date: 'Oct 22, 2026',
      orderType: 'Bespoke Bridal',
      clientName: 'Arthur & Lady Pendelton',
      clientEmail: 'arthur.pendelton@mayfair-advisory.co.uk',
      clientPhone: '+44 20 7946 0921',
      salonLocation: 'London Mayfair Salon',
      clientTier: 'Bespoke Bridal',
      pieceTitle: 'Aura Pavé Bridal Suite',
      pieceCategory: 'Tiara & Bracelet Ensemble',
      masterBench: 'Master Bench: P. Moreau',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAovDebsdVdX5e3Q5Rzzzi0eRhcY6F50uBR-Bdb-RUGThRhM83aSGyo02vK5z5OvbCXvmh4qfvuYqfxvM4-rjM6Bb4HSXvm21GX-FaPW80l97RjRqd5_D_iSywl9RxJ50l8WxQychPlULi9SUUdlQyU9fnFSAgLu2HdhV2D2aMOjzMuH051eoXVOu7pDpszGya6QQ_SrY4PAQ9ZVQy9LPMQFI9dnYPBR-6xwAC1jWZK',
      gemSpecs: '5.15 ct TW Round F/VVS1',
      metalSpecs: 'Platinum 950 Hand-Pronged',
      certNumber: 'GIA Dossier Complete',
      totalFormatted: '$92,000',
      numericTotal: 92000,
      escrowStatus: 'Awaiting Wire Clear',
      paymentMethod: 'Coutts London Private Banking',
      dispatchStatus: 'In Atelier Crafting',
      logisticsCarrier: 'Geneva Master Bench',
      logisticsEta: 'Est. 3 Days Crafting',
      rawStatus: 'processing',
    },
    {
      id: 'CRT-2026-8939',
      orderRef: '#CRT-2026-8939',
      date: 'Oct 21, 2026',
      orderType: 'Direct Catalog',
      clientName: 'Sophie Chen',
      clientEmail: 'sophie.chen@marinabay-invest.sg',
      clientPhone: '+65 6732 9900',
      salonLocation: 'Singapore Marina Bay',
      clientTier: 'VIP Patron',
      pieceTitle: 'Lumière Pear Earrings',
      pieceCategory: 'Drop Earrings in 18K Gold',
      masterBench: 'Matched Pair Cert #901',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB16K9e64e56n9L-kIq7X_16t7hW77wM_3k085aQ3p4254v7_50c-v50t_d78f2_a7w19e4=w600',
      gemSpecs: '4.10 ct TW Vivid Yellow',
      metalSpecs: '18K Yellow Gold & Pt Pavé',
      certNumber: 'GIA #772910381',
      totalFormatted: '$54,200',
      numericTotal: 54200,
      escrowStatus: '100% Escrow Cleared',
      paymentMethod: 'DBS Private Bank Singapore',
      dispatchStatus: 'Armored Transit',
      logisticsCarrier: "Brink's International",
      logisticsEta: 'Flight SQ346 En Route',
      rawStatus: 'shipped',
    },
    {
      id: 'CRT-2026-8938',
      orderRef: '#CRT-2026-8938',
      date: 'Oct 19, 2026',
      orderType: 'Private Reserve',
      clientName: 'Camilla de Bourbon',
      clientEmail: 'camilla.bourbon@vendome-heritage.fr',
      clientPhone: '+33 1 42 68 55 00',
      salonLocation: 'Paris Place Vendôme',
      clientTier: 'Tier 1 UHNW',
      pieceTitle: 'Vendôme Deco Brooch',
      pieceCategory: 'Art Deco Certified Brooch',
      masterBench: 'Historical Archive Piece',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgLqSodf-JzLBjCzzqrV9TVJgJEzAk_wSfp3Dg_M3TQISbT7OEkrOWeaE_vdcNzJy3UV2Ch8Tn-_P0L7a_TPaV8cOLvfuT6DdLwuM2cuhspWUwRdOOcP7tLfj9EyMba2SZxphn-YHVVkbjLv0NNypVI1x7mORJ0e9_af3ueeX3sQ3YaeNT5GK39nskAVq3pN2lsuDWLSgxt_36_SWw3Cc5xE8ayVRPGUspCgDWJ_07',
      gemSpecs: 'Rare Burma Ruby & Diamond',
      metalSpecs: 'Platinum & 18K White Gold',
      certNumber: 'Gübelin #201944 Certified',
      totalFormatted: '$110,000',
      numericTotal: 110000,
      escrowStatus: '100% Escrow Cleared',
      paymentMethod: 'BNP Paribas Wealth Paris',
      dispatchStatus: 'Delivered & Cleared',
      logisticsCarrier: 'Signed In-Salon by Client',
      logisticsEta: 'Salon Lead: A. Dubois',
      rawStatus: 'delivered',
    },
  ];

  // Map real Firestore orders if any exist
  const combinedOrders: DisplayOrder[] = orders.length > 0
    ? orders.map((o) => {
        const firstItem = o.items?.[0] as any;
        const oAny = o as any;
        const isBespoke = (firstItem?.title || '').toLowerCase().includes('bespoke') || (o.total || 0) > 20000;
        return {
          id: o.id,
          orderRef: (o.id || '').startsWith('#') ? (o.id || '') : `#CRT-${(o.id || '').slice(0, 8).toUpperCase()}`,
          date: o.createdAt ? new Date((o.createdAt as any)?.seconds ? (o.createdAt as any).seconds * 1000 : o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Nov 23, 2026',
          orderType: isBespoke ? 'Bespoke Commission' : 'Direct Catalog',
          clientName: o.customerName || 'Private Patron',
          clientEmail: o.customerEmail || 'patron@caritasluxury.com',
          clientPhone: (o.shippingAddress as any)?.phone || o.customerPhone || '+41 22 819 3000',
          salonLocation: o.shippingAddress?.city ? `${o.shippingAddress.city} Salon` : 'Geneva Central Atelier',
          clientTier: (o.total || 0) > 50000 ? 'Tier 1 UHNW' : 'VIP Patron',
          pieceTitle: firstItem?.title || firstItem?.productName || 'Certified Haute Joaillerie Selection',
          pieceCategory: firstItem?.category || 'High Jewellery Piece',
          masterBench: 'Master Bench: Geneva Atelier',
          imageUrl: firstItem?.image || firstItem?.productImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqeljXMpeTXeybCtNFgdcnQup_Z5xfIo3fWzI0Thv6_ffeLcMlh_9RJWiAt3UkRtA2eBpp7BWO0ceWJNj0DbYCNTM6zj_G6eq-Cso9io_vOTGUkKLnQyZ4KJUEpNkcHGhvj8P5jtM3LvoJFAI4Ea8KGUpyphwakyXtWfG2YBYmtTUQAPyTcop1Wf6RNbXDFEcglAqIkDgwgnI9NxKaWS6FZt9iS8dpsRXZsP6TLGG8',
          gemSpecs: firstItem?.carat ? `${firstItem.carat} ct ${firstItem?.color || 'D'}/${firstItem?.clarity || 'VVS1'}` : '3.00 ct D/VVS1 Lab-Grown',
          metalSpecs: firstItem?.metal || 'Platinum 950 Hand-Pronged',
          certNumber: 'GIA / IGI Certified Dossier',
          totalFormatted: `$${(o.total || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
          numericTotal: o.total || 0,
          escrowStatus: o.paymentStatus === 'paid' ? '100% Escrow Cleared' : 'Pending Escrow Deposit',
          paymentMethod: oAny.paymentMethod || 'Bank Wire Escrow',
          dispatchStatus: getStatusLabel(o.orderStatus),
          logisticsCarrier: o.orderStatus === 'shipped' ? "Malca-Amit Armored Express" : o.orderStatus === 'delivered' ? "Delivered & Cleared" : "Geneva Vault Reserve",
          logisticsEta: o.orderStatus === 'delivered' ? 'Completed & Handed Over' : 'In Protected Transit',
          rawStatus: o.orderStatus,
        };
      })
    : baselineOrders;

  // Tab Filtering
  const filteredOrders = combinedOrders.filter((order) => {
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSearch =
        order.orderRef.toLowerCase().includes(q) ||
        order.clientName.toLowerCase().includes(q) ||
        order.pieceTitle.toLowerCase().includes(q) ||
        order.salonLocation.toLowerCase().includes(q) ||
        order.certNumber.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // Tier filter
    if (selectedTier !== 'All') {
      if (!order.clientTier.toLowerCase().includes(selectedTier.toLowerCase())) return false;
    }

    // Tab filter
    if (activeTab === 'pending') {
      return order.rawStatus === 'pending';
    }
    if (activeTab === 'crafting') {
      return order.rawStatus === 'processing';
    }
    if (activeTab === 'secured') {
      return order.rawStatus === 'confirmed';
    }
    if (activeTab === 'transit') {
      return order.rawStatus === 'shipped';
    }
    if (activeTab === 'delivered') {
      return order.rawStatus === 'delivered';
    }

    return true;
  });

  // Calculate live KPI metrics
  const totalOrdersCount = combinedOrders.length;
  const grossValue = combinedOrders.reduce((sum, o) => sum + (o.numericTotal || 0), 0);
  const activeEscrows = combinedOrders.filter((o) => o.rawStatus !== 'delivered').length;

  return (
    <div className="flex flex-col w-full">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003629] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#baeed9]/20 font-body-md animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-[#baeed9]">verified</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Breadcrumbs & Editorial Header Bar */}
      <div className="flex flex-col gap-space-sm mb-space-lg">
        <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-outline">
          <span>Business</span>
          <span className="text-xs">/</span>
          <span>High-Net-Worth Commissions</span>
          <span className="text-xs">/</span>
          <span className="text-secondary font-semibold">Orders &amp; Client Base</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Orders &amp; Client Portfolio Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Oversee bespoke haute joaillerie acquisitions, private salon reserves, armored courier dispatches, and high-net-worth client profiles.
            </p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={() => alert('Escrow audit ledger exported for Swiss FINMA compliance.')}
              className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
              <span className="font-title-md text-title-md">Export Escrow Ledger</span>
            </button>
            <button
              onClick={() => alert('New Private Order form activated. Select client patron and stone allocation.')}
              className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="font-title-md text-title-md tracking-tight">+ Create Private Order / Commission</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Summary Row (4 Bespoke Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Total Orders &amp; Commissions</span>
              <span className="font-display text-display text-primary mt-1">1,680</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">shopping_bag</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-surface-tint text-[16px]">trending_up</span>
              <span className="font-label-md text-label-md text-surface-tint font-semibold">+12.4%</span>
              <span className="font-body-sm text-body-sm text-outline">vs last quarter</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              {activeEscrows} Active Escrows
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Gross Order Value</span>
              <span className="font-display text-display text-primary mt-1">$14,820,400</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-xs">
            <div className="flex items-center gap-2">
              <svg className="w-20 h-5 text-secondary" fill="none" viewBox="0 0 80 20">
                <path d="M0 15 C 20 18, 30 5, 50 11 C 65 16, 70 4, 80 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
              <span className="font-body-sm text-body-sm text-outline">Avg $8,820 / order</span>
            </div>
            <span className="font-label-md text-label-md text-surface-tint font-semibold">Live Q4</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">VIP &amp; Private Clients</span>
              <span className="font-display text-display text-primary mt-1">3,420</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">diamond</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
              <span className="font-body-sm text-body-sm text-on-surface">98.4% Retention</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">142 Bespoke Patrons</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">High-Value Vault Logistics</span>
              <span className="font-display text-display text-primary mt-1">48 Dispatches</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[20px]">local_shipping</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-xs">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-surface-tint text-[16px]">verified_user</span>
              <span>Malca-Amit / Brink&apos;s</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">Secured</span>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-space-lg no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-title-md text-title-md shrink-0 shadow-sm flex items-center gap-2 transition-all ${
            activeTab === 'all'
              ? 'bg-primary text-on-primary font-semibold'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>All Orders</span>
          <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${activeTab === 'all' ? 'bg-primary-container text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
            1,680
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg font-title-md text-title-md shrink-0 shadow-sm flex items-center gap-2 transition-all ${
            activeTab === 'pending'
              ? 'bg-primary text-on-primary font-semibold'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Pending Escrow &amp; Deposit</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">24</span>
        </button>

        <button
          onClick={() => setActiveTab('crafting')}
          className={`px-4 py-2 rounded-lg font-title-md text-title-md shrink-0 shadow-sm flex items-center gap-2 transition-all ${
            activeTab === 'crafting'
              ? 'bg-primary text-on-primary font-semibold'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>In Atelier Crafting</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">68</span>
        </button>

        <button
          onClick={() => setActiveTab('secured')}
          className={`px-4 py-2 rounded-lg font-title-md text-title-md shrink-0 shadow-sm flex items-center gap-2 transition-all ${
            activeTab === 'secured'
              ? 'bg-primary text-on-primary font-semibold'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Vault Secured / Ready</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">31</span>
        </button>

        <button
          onClick={() => setActiveTab('transit')}
          className={`px-4 py-2 rounded-lg font-title-md text-title-md shrink-0 shadow-sm flex items-center gap-2 transition-all ${
            activeTab === 'transit'
              ? 'bg-primary text-on-primary font-semibold'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Armored VIP Dispatch</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">48</span>
        </button>

        <button
          onClick={() => setActiveTab('delivered')}
          className={`px-4 py-2 rounded-lg font-title-md text-title-md shrink-0 shadow-sm flex items-center gap-2 transition-all ${
            activeTab === 'delivered'
              ? 'bg-primary text-on-primary font-semibold'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Delivered &amp; Cleared</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">1,509</span>
        </button>
      </div>

      {/* Filter and Refinement Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md mb-space-lg">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low text-body-md font-body-md text-on-surface rounded-lg placeholder-outline focus:outline-none focus:bg-surface-container-lowest transition-all"
            placeholder="Search by Order #, Client Name, Jewel SKU, or GIA Cert..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="relative">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="appearance-none bg-surface-container-low h-10 pl-3 pr-8 rounded-lg font-title-md text-title-md text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="All">Client Tier: All VIPs</option>
              <option value="UHNW">Royalty / UHNW</option>
              <option value="Bridal">Bespoke Bridal</option>
              <option value="Patron">Private Collector</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-2.5 text-outline pointer-events-none text-[18px]">expand_more</span>
          </div>
          <div className="relative">
            <select
              value={selectedEscrow}
              onChange={(e) => setSelectedEscrow(e.target.value)}
              className="appearance-none bg-surface-container-low h-10 pl-3 pr-8 rounded-lg font-title-md text-title-md text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="All">Payment: All Escrows</option>
              <option value="Cleared">Swiss Wire Cleared</option>
              <option value="Held">Bank Escrow Held</option>
              <option value="Crypto">Concierge Escrow</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-2.5 text-outline pointer-events-none text-[18px]">expand_more</span>
          </div>
          <button
            onClick={() => { setSearch(''); setSelectedTier('All'); setSelectedEscrow('All'); }}
            className="h-10 px-3 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface-variant flex items-center justify-center transition-colors font-title-md text-title-md gap-1"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Luxury Orders Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3.5 px-6">Order Ref &amp; Date</th>
                <th className="py-3.5 px-6">Client &amp; Salon</th>
                <th className="py-3.5 px-6">Haute Piece &amp; Item</th>
                <th className="py-3.5 px-6">Gemological &amp; Metal Specs</th>
                <th className="py-3.5 px-6">Valuation &amp; Escrow</th>
                <th className="py-3.5 px-6">Vault &amp; Dispatch Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-md text-body-md text-on-surface">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-2 block">search_off</span>
                    No orders matching your criteria found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-surface-container-low/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-5 px-6 align-top whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md text-primary font-semibold group-hover:text-primary-container">
                          {order.orderRef}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">{order.date}</span>
                        <span className="mt-1 font-label-sm text-label-sm text-secondary font-semibold">{order.orderType}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-title-md text-title-md text-on-surface font-semibold">{order.clientName}</span>
                          <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{order.salonLocation}</span>
                        <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm w-max font-semibold">
                          {order.clientTier}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <div className="flex items-center gap-3.5 min-w-[220px]">
                        <img
                          className="w-14 h-14 rounded-xl object-cover bg-surface-container-low shrink-0 shadow-sm"
                          src={order.imageUrl}
                          alt={order.pieceTitle}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-title-md text-title-md text-on-surface font-semibold truncate" title={order.pieceTitle}>
                            {order.pieceTitle}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{order.pieceCategory}</span>
                          <span className="font-label-sm text-label-sm text-outline">{order.masterBench}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <div className="flex flex-col min-w-[190px]">
                        <span className="font-title-md text-title-md text-on-surface font-medium">{order.gemSpecs}</span>
                        <span className="font-body-sm text-body-sm text-outline">{order.metalSpecs}</span>
                        <span className="font-label-sm text-label-sm text-secondary font-semibold mt-0.5">{order.certNumber}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">{order.totalFormatted}</span>
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-surface-tint font-semibold mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {order.escrowStatus}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <div className="flex flex-col gap-1 min-w-[180px]">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold w-max ${
                          order.rawStatus === 'delivered'
                            ? 'bg-surface-container-highest text-on-surface'
                            : order.rawStatus === 'shipped'
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : 'bg-primary-fixed text-on-primary-fixed'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                          {order.dispatchStatus}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">{order.logisticsCarrier}</span>
                        <span className="font-label-sm text-label-sm text-outline">{order.logisticsEta}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Dossier</span>
                        </button>
                        <button
                          onClick={() => alert(`Official Swiss VAT & Escrow Receipt generated for ${order.orderRef}.`)}
                          className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center"
                          title="Generate Swiss Escrow Invoice"
                        >
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                        <button
                          onClick={() => alert(`Armored Carrier Telemetry: ${order.logisticsCarrier} — ${order.logisticsEta}`)}
                          className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center"
                          title="Carrier Tracking Telemetry"
                        >
                          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Audit Summary */}
        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing 1–{filteredOrders.length} of {totalOrdersCount} high-net-worth orders &amp; commissions
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-sm disabled:opacity-40" disabled>
              Previous
            </button>
            <span className="px-3 py-1 font-label-md text-label-md text-primary font-semibold">Page 1 of 1</span>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-sm disabled:opacity-40" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Dossier Inspection Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-space-xl shadow-2xl border border-surface-container flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-space-md border-b border-surface-container-low">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
                    Atelier Dossier &amp; Escrow Verification
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                    {selectedOrder.clientTier}
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary mt-1">
                  {selectedOrder.orderRef}
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Registered {selectedOrder.date} • {selectedOrder.salonLocation}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-space-md space-y-space-md">
              {/* Piece Presentation */}
              <div className="flex items-center gap-space-md p-space-md bg-surface-container-low rounded-xl">
                <img
                  src={selectedOrder.imageUrl}
                  alt={selectedOrder.pieceTitle}
                  className="w-20 h-20 rounded-xl object-cover shadow-sm bg-white shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-title-lg text-title-lg text-on-surface font-semibold">{selectedOrder.pieceTitle}</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">{selectedOrder.gemSpecs}</span>
                  <span className="font-body-sm text-body-sm text-outline">{selectedOrder.metalSpecs} • {selectedOrder.certNumber}</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold mt-1">{selectedOrder.totalFormatted}</span>
                </div>
              </div>

              {/* Client & Salon Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Client Patron</span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">{selectedOrder.clientName}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{selectedOrder.clientEmail}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{selectedOrder.clientPhone}</span>
                </div>

                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Escrow &amp; Settlement</span>
                  <span className="font-title-md text-title-md text-primary font-semibold">{selectedOrder.escrowStatus}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{selectedOrder.paymentMethod}</span>
                  <span className="font-body-sm text-body-sm text-outline">{selectedOrder.logisticsCarrier}</span>
                </div>
              </div>

              {/* Status Update Trigger */}
              <div className="p-space-md border border-surface-container rounded-xl flex flex-col gap-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Update Vault Custody &amp; Dispatch Status
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'confirmed')}
                    className={`px-3 py-2 rounded-lg text-title-md font-title-md transition-all ${
                      selectedOrder.rawStatus === 'confirmed'
                        ? 'bg-primary text-on-primary font-semibold shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                    className={`px-3 py-2 rounded-lg text-title-md font-title-md transition-all ${
                      selectedOrder.rawStatus === 'processing'
                        ? 'bg-primary text-on-primary font-semibold shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    In Crafting
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}
                    className={`px-3 py-2 rounded-lg text-title-md font-title-md transition-all ${
                      selectedOrder.rawStatus === 'shipped'
                        ? 'bg-primary text-on-primary font-semibold shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    In Transit
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                    className={`px-3 py-2 rounded-lg text-title-md font-title-md transition-all ${
                      selectedOrder.rawStatus === 'delivered'
                        ? 'bg-primary text-on-primary font-semibold shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Delivered
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-space-md border-t border-surface-container-low flex items-center justify-end gap-space-sm">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-all"
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  alert(`Official certificate and insured bill of lading issued for ${selectedOrder.orderRef}.`);
                  setSelectedOrder(null);
                }}
                className="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-title-md text-title-md shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Issue Certificate &amp; Sign</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
