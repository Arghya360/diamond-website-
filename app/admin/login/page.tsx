'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, login, resetPassword, error: authError } = useAdminAuth();
  const [identifier, setIdentifier] = useState('Caritas360');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      const ok = await login(identifier.trim(), password);
      if (ok) {
        router.push('/admin');
      } else {
        setLocalError('Invalid administrative credentials. Please verify your username and password.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier) {
      setLocalError('Please enter your administrator username or email address first.');
      return;
    }
    try {
      await resetPassword(identifier);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      setLocalError('Password reset failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#080808',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(191, 163, 124, 0.12) 0%, transparent 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative luxury ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(191, 163, 124, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#0C1315',
          border: '1px solid rgba(191, 163, 124, 0.3)',
          borderRadius: '16px',
          padding: '40px 36px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/wp-content/uploads/caritas-logo-white.png"
              alt="Caritas Luxury"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '12px',
              letterSpacing: '3px',
              color: 'var(--primary-gold)',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            — MASTER DIAMOND CURATORS —
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Executive Admin Portal
          </h1>
          <p style={{ margin: '6px 0 0', color: 'rgba(255, 255, 255, 0.55)', fontSize: '12px' }}>
            Authorized personnel management interface
          </p>
        </div>

        {/* Alerts */}
        {(localError || authError) && (
          <div
            style={{
              backgroundColor: 'rgba(192, 50, 58, 0.12)',
              border: '1px solid rgba(192, 50, 58, 0.35)',
              color: '#F87171',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              marginBottom: '20px',
              fontFamily: 'var(--font-body)',
            }}
          >
            {localError || authError}
          </div>
        )}

        {resetSent && (
          <div
            style={{
              backgroundColor: 'rgba(22, 119, 71, 0.15)',
              border: '1px solid rgba(22, 119, 71, 0.35)',
              color: '#34D399',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              marginBottom: '20px',
              fontFamily: 'var(--font-body)',
            }}
          >
            Password recovery email has been dispatched.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '6px',
                fontFamily: 'var(--font-title)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Username or Email
            </label>
            <input
              type="text"
              required
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '12px 14px',
                fontSize: '13.5px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="e.g. Caritas360"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontFamily: 'var(--font-title)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: 0,
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-gold)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-body)',
                }}
              >
                Forgot key?
              </button>
            </div>
            <input
              type="password"
              required
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '12px 14px',
                fontSize: '13.5px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-caritas-gold"
            style={{
              width: '100%',
              padding: '13px',
              marginTop: '6px',
              fontSize: '13.5px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Verifying Authorization...' : 'Authenticate to Portal'}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              color: 'rgba(255, 255, 255, 0.45)',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-gold)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
          >
            ← Return to Caritas Luxury Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
