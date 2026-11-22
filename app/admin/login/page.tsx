'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, login, resetPassword, error: authError } = useAdminAuth();
  const [username, setUsername] = useState('Caritas360');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const success = await login(username.trim(), password);
      if (success) {
        setSuccessMessage('Authenticated successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin');
        }, 300);
      } else {
        setLocalError('Invalid username or password. Please verify your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLocalError(err.message || 'Error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!username) {
      setLocalError('Please enter your username or email address first.');
      return;
    }
    try {
      await resetPassword(username);
      setSuccessMessage('Password reset instructions sent.');
    } catch (err: any) {
      setLocalError('Failed to send reset email. ' + (err.message || ''));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(circle at center, #141c1f 0%, #0c1315 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          borderRadius: '12px',
          padding: '36px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              color: 'var(--admin-gold)',
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '1.5px',
              marginBottom: '6px',
            }}
          >
            CARITAS LUXURY
          </div>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '13px' }}>
            Administrative Control Panel
          </p>
        </div>

        {/* Alerts */}
        {(localError || authError) && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '12px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {localError || authError}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '12px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="admin-label">Username or Email</label>
            <input
              type="text"
              required
              className="admin-input"
              placeholder="e.g. Caritas360"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              <label className="admin-label" style={{ margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-gold)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              className="admin-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '11px',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a
            href="/"
            style={{ color: '#6b7280', fontSize: '12px', textDecoration: 'none' }}
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
