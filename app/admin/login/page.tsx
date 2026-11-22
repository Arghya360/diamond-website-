'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, login, error: authError } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) router.push('/admin');
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);
    try {
      const ok = await login(username.trim(), password);
      if (ok) {
        router.push('/admin');
      } else {
        setLocalError('Invalid username or password. Please try again.');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <svg width="44" height="34" viewBox="0 0 64 48" fill="none" stroke="#bd914d" strokeWidth="2" style={{ marginBottom: 8 }}>
            <path d="M12 5h40l9 13-29 25L3 18 12 5Z" />
            <path d="m3 18 58 0M12 5l9 13 11 25 11-25 9-13M21 18l11-13 11 13" />
          </svg>
          <div style={{ font: '600 20px Playfair Display, Georgia, serif', letterSpacing: '1px', color: '#191817' }}>
            CARITAS LUXURY
          </div>
          <p style={{ margin: '4px 0 0', color: '#777b82', fontSize: 12 }}>Administrative Control Panel</p>
        </div>

        {/* Error */}
        {(localError || authError) && (
          <div style={{
            background: 'rgba(213,46,56,0.08)',
            border: '1px solid rgba(213,46,56,0.25)',
            color: '#c0323a',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 18,
          }}>
            {localError || authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="admin-label">Username</label>
            <input
              type="text"
              required
              className="admin-input"
              placeholder="e.g. Caritas360"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>
          <div>
            <label className="admin-label">Password</label>
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
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating…' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <a href="/" style={{ color: '#aaa', fontSize: 12, textDecoration: 'none' }}>← Back to Website</a>
        </div>
      </div>
    </div>
  );
}
