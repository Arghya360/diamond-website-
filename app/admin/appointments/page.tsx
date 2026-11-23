'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: string;
  dateTime: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed' | 'canceled';
  statusLabel: string;
  statusClass: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '#APT-1042',
    clientName: 'Eleanor Vance',
    clientEmail: 'eleanor.vance@caritasluxury.com',
    clientPhone: '+41 22 819 3000',
    type: 'High Jewellery Curation',
    dateTime: 'Nov 26, 2026 • 14:00 CET',
    location: 'Geneva Private Atelier',
    status: 'confirmed',
    statusLabel: 'CONFIRMED',
    statusClass: 'status-green',
  },
  {
    id: '#APT-1043',
    clientName: 'Sophia Laurent',
    clientEmail: 'sophia.laurent@example.com',
    clientPhone: '+33 1 42 68 55 00',
    type: 'Bespoke Engagement Ring',
    dateTime: 'Nov 28, 2026 • 11:30 CET',
    location: 'Paris Place Vendôme Suite',
    status: 'confirmed',
    statusLabel: 'CONFIRMED',
    statusClass: 'status-green',
  },
  {
    id: '#APT-1044',
    clientName: 'Arthur Pendelton',
    clientEmail: 'arthur.p@example.com',
    clientPhone: '+44 20 7946 0921',
    type: 'Rare Fancy Diamond Viewing',
    dateTime: 'Dec 02, 2026 • 16:00 GMT',
    location: 'London Mayfair Salon',
    status: 'pending',
    statusLabel: 'PENDING',
    statusClass: 'status-yellow',
  },
  {
    id: '#APT-1045',
    clientName: 'Claire Dubois',
    clientEmail: 'claire.dubois@example.com',
    clientPhone: '+971 4 362 7000',
    type: 'Custom Diamond Tennis Suite',
    dateTime: 'Dec 05, 2026 • 15:00 GST',
    location: 'Dubai Private Depository',
    status: 'pending',
    statusLabel: 'PENDING',
    statusClass: 'status-yellow',
  },
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'confirmed' | 'pending' | 'completed'>('All');
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = appointments.filter((apt) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      apt.clientName.toLowerCase().includes(q) ||
      apt.clientEmail.toLowerCase().includes(q) ||
      apt.id.toLowerCase().includes(q) ||
      apt.location.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const statusLabel = newStatus.toUpperCase();
          const statusClass =
            newStatus === 'confirmed' || newStatus === 'completed'
              ? 'status-green'
              : newStatus === 'pending'
              ? 'status-yellow'
              : 'status-gray';
          return { ...a, status: newStatus, statusLabel, statusClass };
        }
        return a;
      })
    );
    setNotice(`Appointment ${id} updated to ${newStatus}.`);
    setTimeout(() => setNotice(null), 3000);
  };

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
          <h1 className="admin-page-hero-title">Private Salon Consultations &amp; Appointments</h1>
          <p className="admin-page-hero-subtitle">
            Manage private atelier appointments, bespoke consultation bookings, and diamond curation sessions.
          </p>
        </div>

        <div className="admin-page-hero-actions">
          <button
            onClick={() => {
              alert('Opening private appointment scheduler...');
            }}
            className="admin-action-btn-black"
            style={{ padding: '8px 16px' }}
          >
            + Book Client Appointment
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-label">TOTAL APPOINTMENTS</div>
          <div className="admin-stat-value">12</div>
          <div className="admin-stat-sub">All-time salon reservations</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">UPCOMING APPOINTMENTS</div>
          <div className="admin-stat-value amber">4</div>
          <div className="admin-stat-sub">Scheduled for this month</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">COMPLETED CONSULTATIONS</div>
          <div className="admin-stat-value green">7</div>
          <div className="admin-stat-sub">Successfully conducted</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">CANCELED / RESCHEDULED</div>
          <div className="admin-stat-value blue">1</div>
          <div className="admin-stat-sub">Requires follow-up</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search-wrap">
          <input
            type="text"
            placeholder="Search by client name, email, appointment ID or location..."
            className="admin-filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-controls">
          <span className="admin-filter-label">Status:</span>
          <div className="admin-pill-group">
            {(['All', 'confirmed', 'pending', 'completed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                className={`admin-pill-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
              >
                {st === 'All' ? 'All' : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Table Card */}
      <div className="admin-card-table">
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>APPOINTMENT</th>
                <th>CLIENT</th>
                <th>CONSULTATION TYPE</th>
                <th>DATE &amp; TIME</th>
                <th>SALON LOCATION</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                    No appointments found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <strong style={{ color: '#111827', fontWeight: 600 }}>{apt.id}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ color: '#111827', fontWeight: 600 }}>{apt.clientName}</strong>
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{apt.clientEmail}</span>
                      </div>
                    </td>
                    <td style={{ color: '#4B5563', fontWeight: 500 }}>
                      {apt.type}
                    </td>
                    <td style={{ color: '#111827', fontWeight: 500 }}>
                      {apt.dateTime}
                    </td>
                    <td style={{ color: '#4B5563' }}>
                      {apt.location}
                    </td>
                    <td>
                      <span className={`admin-status-pill ${apt.statusClass}`}>
                        {apt.statusLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {apt.status !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                            className="admin-action-btn-white"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            className="admin-action-btn-black"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
