'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase/client';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, login, resetPassword, error: authError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSetupMode, setIsSetupMode] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isSetupMode) {
        // Initial setup for the authorized owner
        if (email.trim().toLowerCase() !== 'arghyabiswas0792@gmail.com') {
          setLocalError('Initial admin setup is reserved for authorized owner arghyabiswas0792@gmail.com.');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        setSuccessMessage('Administrator account created successfully! Signing you in...');
        const success = await login(email.trim(), password);
        if (success) router.push('/admin');
      } else {
        const success = await login(email.trim(), password);
        if (success) {
          router.push('/admin');
        } else {
          setLocalError('Authentication failed. Check your email and password, or use Initial Setup if creating your first login.');
        }
      }
    } catch (err: any) {
      console.error('Login/Setup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setLocalError('This email already has an account. Please sign in normally using your password.');
        setIsSetupMode(false);
      } else if (err.code === 'auth/weak-password') {
        setLocalError('Password must be at least 6 characters.');
      } else {
        setLocalError(err.message || 'Error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setLocalError('Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email);
      setSuccessMessage('Password reset link sent to your email.');
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
          <div style={{ color: 'var(--admin-gold)', fontWeight: 700, fontSize: '20px', letterSpacing: '1.5px', marginBottom: '6px' }}>
            CARITAS LUXURY
          </div>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '13px' }}>
            {isSetupMode ? 'Initial Super Admin Provisioning' : 'Secure Management Portal'}
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
            <label className="admin-label">Administrator Email</label>
            <input
              type="email"
              required
              className="admin-input"
              placeholder="e.g. arghyabiswas0792@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="admin-label" style={{ margin: 0 }}>Password</label>
              {!isSetupMode && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{ background: 'none', border: 'none', color: 'var(--admin-gold)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              className="admin-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Authenticating...' : isSetupMode ? 'Create Super Admin & Sign In' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Setup toggle */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--admin-border)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setIsSetupMode(!isSetupMode);
              setLocalError(null);
              setSuccessMessage(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isSetupMode ? 'Already created? Switch to Standard Sign In' : 'First time? Initialize Initial Super Admin Account'}
          </button>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
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
