'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../lib/firebase/auth-context';

export default function AdminLoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const { login, error: authError } = useAdminAuth();

  const [email, setEmail] = useState('Caritas360');
  const [password, setPassword] = useState('Caritas1234!@#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('caritas_admin_saved_login');
      if (saved) { setEmail(saved); setRememberMe(true); }
    } catch (_) {}
  }, []);

  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) {
      setFormError('Please enter your administrator identifier and password.');
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        if (rememberMe) {
          try { localStorage.setItem('caritas_admin_saved_login', email.trim()); } catch (_) {}
        } else {
          try { localStorage.removeItem('caritas_admin_saved_login'); } catch (_) {}
        }
        setIsDone(true);
        setTimeout(() => { if (onSuccess) { onSuccess(); } else { router.push('/admin/'); } }, 900);
      } else {
        setFormError('Incorrect credentials. Please verify your administrator identifier and vault password.');
        triggerShake();
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication failed. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F3F0F8', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top Bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', background: 'transparent',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontSize: 22, fontWeight: 700, letterSpacing: '0.12em', color: '#1a1a2e', textTransform: 'uppercase' }}>
            CARITAS
          </span>
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', color: '#1a1a2e', textTransform: 'uppercase', marginTop: -2 }}>
            HAUTE JOAILLERIE • GENÈVE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.08em', color: '#444', textTransform: 'uppercase' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2d6a4f', display: 'inline-block' }} />
            VAULT ARCHITECTURE • TIER IV SECURED
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, letterSpacing: '0.08em', color: '#444', textTransform: 'uppercase' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            FINMA ACCR.
          </div>
        </div>
      </header>

      {/* Main centered card */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div
          className={shake ? 'caritas-login-card caritas-shake' : 'caritas-login-card'}
          style={{
            background: '#FFFFFF',
            borderRadius: 18,
            padding: '52px 56px',
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
          }}
        >
          {isDone ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#e8f5e9', display: 'grid', placeItems: 'center', margin: '0 auto 20px',
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: 26, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
                Access Granted
              </div>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Entering the Atelier Vault…</p>
            </div>
          ) : (
            <>
              {/* Diamond gem icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#F0EDFA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6B4EFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3h12l4 6-10 13L2 9z" />
                    <path d="M11 3L8 9l4 13 4-13-3-6" />
                    <path d="M2 9h20" />
                  </svg>
                </div>
              </div>

              {/* Brand caption */}
              <div style={{ textAlign: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: '#888', textTransform: 'uppercase' }}>
                  CARITAS HAUTE JOAILLERIE • GENÈVE
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond','Georgia',serif",
                fontSize: 32, fontWeight: 700, textAlign: 'center',
                color: '#1a1a2e', margin: '0 0 12px', lineHeight: 1.2,
              }}>
                Private Atelier Sign-In
              </h1>

              {/* Subtitle */}
              <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13.5, lineHeight: 1.6, margin: '0 0 20px' }}>
                Enter authorized administrative credentials to access Geneva vault telemetry,
                client dossiers, and live commerce custody.
              </p>

              {/* Access node badge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 20, border: '1px solid #e0e0e0',
                  fontSize: 10.5, letterSpacing: '0.07em', color: '#444',
                  background: 'transparent',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2d6a4f', display: 'inline-block' }} />
                  ACCESS NODE: GENEVA CENTRAL VAULT (PRIMARY • CH-01)
                </div>
              </div>

              {/* Error banner */}
              {(formError || authError) && (
                <div style={{
                  padding: '10px 14px', background: '#fdf2f2', border: '1px solid #f5c2c2',
                  borderRadius: 10, fontSize: 13, color: '#c62a2a', marginBottom: 18,
                }}>
                  {formError || authError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email / Identifier */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#374151', marginBottom: 7 }}>
                    Administrator Identifier / Atelier Email
                  </label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', border: '1.5px solid #E5E7EB',
                    borderRadius: 10, background: '#FAFAFA',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <input
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="curator.geneve@caritasluxury.com"
                      autoComplete="username"
                      style={{
                        flex: 1, border: 'none', outline: 'none', background: 'transparent',
                        fontSize: 14, color: '#1a1a2e', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#374151' }}>
                      Secure Master Vault Password
                    </label>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', color: '#888', textTransform: 'uppercase' }}>
                      HSM TOKEN V4
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', border: '1.5px solid #E5E7EB',
                    borderRadius: 10, background: '#FAFAFA',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="11" r="3" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="3" y="11" width="18" height="11" rx="2" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      style={{
                        flex: 1, border: 'none', outline: 'none', background: 'transparent',
                        fontSize: 14, color: '#1a1a2e', fontFamily: 'inherit',
                        letterSpacing: showPassword ? 'normal' : '0.18em',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me + Vault Recovery */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', userSelect: 'none' }}>
                    <div
                      onClick={() => setRememberMe(v => !v)}
                      style={{
                        width: 18, height: 18, borderRadius: 5,
                        border: rememberMe ? '1.5px solid #2d6a4f' : '1.5px solid #d1d5db',
                        background: rememberMe ? '#2d6a4f' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                      }}
                    >
                      {rememberMe && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1.5 6 4.5 9 10.5 3" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 13.5, color: '#374151' }}>Remember terminal for 30 days</span>
                  </label>
                  <span style={{ fontSize: 13.5, color: '#2d6a4f', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                    Vault Recovery Protocol
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '14px', border: 'none', borderRadius: 10,
                    background: '#1a3c34', color: '#fff',
                    fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.75 : 1,
                    transition: 'background 0.15s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {loading ? 'Authenticating…' : 'Authenticate & Enter Atelier Vault'}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
                  <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                  <span style={{ fontSize: 11, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    FIDUCIARY VERIFICATION
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                </div>

                {/* Hardware key button */}
                <button
                  type="button"
                  onClick={() => alert('Hardware key / FIDO2 Passkey authentication is not configured for this installation.')}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: 10,
                    background: '#FAFAFA', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>Authenticate via Hardware Key / FIDO2 Passkey</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', border: '1px solid #E5E7EB', padding: '3px 8px', borderRadius: 5 }}>
                    TOUCH ID
                  </span>
                </button>
              </form>

              {/* Security info */}
              <div style={{ marginTop: 24, padding: '14px 16px', background: '#F9F9FB', border: '1px solid #EBEBF0', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>
                    SWISS BANKING LEVEL AES-256 HSM ENCRYPTION • FINMA TIER-3 SECURED
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  All session attempts are immutably signed and mirrored to the Zurich Security Operations Center. For escalated access protocols, contact the{' '}
                  <span style={{ color: '#1a3c34', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Chief Vault Custodian</span>.
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Status Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32,
        padding: '10px 40px', borderTop: '1px solid rgba(0,0,0,0.06)',
        background: 'transparent', flexWrap: 'wrap',
      }}>
        <StatusItem dot="#2d6a4f" label="HSM STATE: SYNCHRONIZED (0.42MS)" />
        <StatusItem dot={undefined} label="AUTH PROTOCOL: V4.88-PROD" />
        <StatusItem dot={undefined} label="REGION: EMEA-CH-GVA" />
      </div>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px', flexWrap: 'wrap', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: '#6b7280' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          256-Bit Hardware Encrypted Handshake • Geneva Depository
        </div>
        <span style={{ fontSize: 11.5, color: '#6b7280', textAlign: 'center' }}>
          © 2025 Caritas Haute Joaillerie S.A. Authorized personnel &amp; fiduciary curators only.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11.5, color: '#6b7280' }}>
          <span style={{ cursor: 'pointer' }}>🌐 FR / EN</span>
          <span style={{ cursor: 'pointer' }}>💎 PRIVATE CONCIERGE</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        .caritas-login-card { transition: transform 0.05s; }

        @keyframes caritas-shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .caritas-shake { animation: caritas-shake 0.4s; }

        input::placeholder { color: #9ca3af; }
        input:focus { outline: none; }

        button[type="submit"]:hover:not(:disabled) { background: #244f43 !important; }

        @media (max-width: 540px) {
          .caritas-login-card { padding: 36px 22px !important; }
        }
      `}</style>
    </div>
  );
}

function StatusItem({ dot, label }: { dot?: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.07em', color: '#888', textTransform: 'uppercase' }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block' }} />}
      {label}
    </div>
  );
}
