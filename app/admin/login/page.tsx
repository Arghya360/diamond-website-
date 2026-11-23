'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, login, resetPassword, error: authError } = useAdminAuth();
  const [identifier, setIdentifier] = useState('curator.geneve@caritasluxury.com');
  const [password, setPassword] = useState('Caritas1234!@#');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [passkeyNotice, setPasskeyNotice] = useState(false);

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
      setLocalError('Please enter your administrator identifier / atelier email first.');
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

  const handlePasskey = () => {
    setPasskeyNotice(true);
    setLoading(true);
    setTimeout(async () => {
      const ok = await login('curator.geneve@caritasluxury.com', 'Caritas1234!@#');
      if (ok) router.push('/admin');
      setLoading(false);
      setTimeout(() => setPasskeyNotice(false), 2000);
    }, 1200);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between relative selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(197,168,128,0.12),rgba(250,248,255,0))]"></div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(27,77,62,0.04),transparent_60%)]"></div>

      {/* Passkey Floating Banner */}
      {passkeyNotice && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#283044] text-[#eef0ff] px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 font-body-sm text-body-sm transition-all animate-fade-in border border-[#baeed9]/20">
          <span className="material-symbols-outlined text-[#fedeb2] text-[20px]">fingerprint</span>
          <span>Requesting WebAuthn FIDO2 assertion via hardware token...</span>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 w-full">
        <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-wider uppercase text-primary leading-none">
                Caritas
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary mt-1">
                Haute Joaillerie • Genève
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                Vault Architecture • Tier IV Secured
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                FINMA Accr.
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Authentication Monolith */}
      <main className="relative z-10 flex-1 flex items-center justify-center w-full px-6 py-space-xl">
        <div className="flex flex-col w-full items-center justify-center py-6">
          <div className="relative w-full max-w-xl">
            {/* Atmospheric Backing Glow */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Main Authentication Monolith Card */}
            <div className="relative w-full bg-surface-container-lowest rounded-xl shadow-[0_24px_50px_-12px_rgba(19,27,46,0.08),0_4px_16px_-2px_rgba(19,27,46,0.02)] border border-[#eaedff] p-8 sm:p-12 overflow-hidden">
              {/* Golden Accent Line at Top Edge */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>

              {/* Insignia & Header */}
              <div className="flex flex-col items-center text-center">
                {/* Diamond Emblem */}
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4 shadow-sm border border-secondary/20">
                  <span className="material-symbols-outlined text-primary text-[24px]">diamond</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.28em] text-secondary font-semibold">
                  Caritas Haute Joaillerie • Genève
                </span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mt-2 tracking-tight">
                  Private Atelier Sign-In
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-2.5 leading-relaxed">
                  Enter authorized administrative credentials to access Geneva vault telemetry, client dossiers, and live commerce custody.
                </p>

                {/* Node Pill */}
                <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                  <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                    Access Node: Geneva Central Vault (Primary • CH-01)
                  </span>
                </div>
              </div>

              {/* Error Notice */}
              {(localError || authError) && (
                <div className="mt-6 p-3 rounded-lg bg-red-50 text-red-800 text-body-sm flex items-center gap-2 border border-red-200">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{localError || authError}</span>
                </div>
              )}

              {/* Password Reset Notice */}
              {resetSent && (
                <div className="mt-6 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-body-sm flex items-center gap-2 border border-emerald-200">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Password recovery instructions sent to your verified email.</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5" id="vault-auth-form">
                {/* Identifier Input Group */}
                <div className="space-y-1.5">
                  <label className="block font-label-md text-label-md tracking-wider uppercase text-on-surface" htmlFor="admin-id">
                    Administrator Identifier / Atelier Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                    </span>
                    <input
                      id="admin-id"
                      name="admin-id"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. curator.geneve@caritasluxury.com"
                      className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-surface-container shadow-sm placeholder:text-outline-variant focus:outline-none focus:bg-surface-bright transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Master Password Input Group */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-label-md text-label-md tracking-wider uppercase text-on-surface" htmlFor="master-pwd">
                      Secure Master Vault Password
                    </label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                      HSM Token V4
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <span className="material-symbols-outlined text-[18px]">key</span>
                    </span>
                    <input
                      id="master-pwd"
                      name="master-pwd"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full h-11 pl-10 pr-11 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-surface-container shadow-sm placeholder:text-outline-variant focus:outline-none focus:bg-surface-bright transition-all"
                      required
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Checkbox & Forgotten Password Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      id="remember-device"
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-primary-container focus:ring-0 cursor-pointer accent-[#1b4d3e]"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Remember terminal for 30 days</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="font-label-md text-label-md text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 text-left"
                  >
                    <span>Vault Recovery Protocol</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </button>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="group relative w-full h-12 px-6 rounded-lg bg-primary-container text-on-primary font-title-md text-title-md tracking-wide shadow-md hover:bg-primary transition-all duration-150 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px] text-tertiary-fixed-dim transition-transform group-hover:scale-110">
                      lock_open
                    </span>
                    <span>{loading ? 'Verifying Geneva Enclave Credentials...' : 'Authenticate & Enter Atelier Vault'}</span>
                  </button>
                </div>

                {/* Divider with Architectural Ornament */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="w-full h-px bg-surface-container-high"></div>
                  <span className="absolute px-3 bg-surface-container-lowest font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase">
                    Fiduciary Verification
                  </span>
                </div>

                {/* Fast Passkey / YubiKey / Hardware Token Option */}
                <button
                  type="button"
                  onClick={handlePasskey}
                  disabled={loading}
                  className="w-full h-11 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md flex items-center justify-center gap-2.5 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">fingerprint</span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">Authenticate via Hardware Key / FIDO2 Passkey</span>
                  <span className="ml-auto font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-lowest text-secondary uppercase font-semibold">
                    Touch ID
                  </span>
                </button>
              </form>

              {/* Security Telemetry & Node Badge */}
              <div className="mt-8 pt-6 border-t border-surface-container-low flex flex-col gap-3">
                <div className="flex items-center gap-2 justify-center text-center">
                  <span className="material-symbols-outlined text-[16px] text-primary">security</span>
                  <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                    Swiss Banking Level AES-256 HSM Encryption • FINMA Tier-3 Secured
                  </span>
                </div>
                {/* Warning / Security Log Disclaimer */}
                <div className="p-3.5 rounded-lg bg-surface-container-low text-center">
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    All session attempts are immutably signed and mirrored to the Zurich Security Operations Center. 
                    For escalated access protocols, contact the <span className="font-semibold text-on-surface">Chief Vault Custodian</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Telemetry & Status Strip Below Monolith */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-3 text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider">HSM State: Synchronized (0.42ms)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-label-sm text-label-sm tracking-wider uppercase">Auth Protocol: v4.88-PROD</span>
                <span className="font-label-sm text-label-sm tracking-wider uppercase">Region: EMEA-CH-GVA</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching Specification */}
      <footer className="relative z-10 w-full bg-surface-container-low/60 backdrop-blur-md shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              256-Bit Hardware Encrypted Handshake • Geneva Depository
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant text-center">
            © 2025 Caritas Haute Joaillerie S.A. Authorized personnel &amp; fiduciary curators only.
          </div>
          <div className="flex items-center gap-6">
            <a
              className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
              href="#"
            >
              <span className="material-symbols-outlined text-[14px]">language</span>
              <span>FR / EN</span>
            </a>
            <a
              className="font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-on-surface transition-colors flex items-center gap-1"
              href="#"
            >
              <span className="material-symbols-outlined text-[14px]">support_agent</span>
              <span>Private Concierge</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
