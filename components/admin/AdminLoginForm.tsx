'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../lib/firebase/auth-context';

export default function AdminLoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const { login, resetPassword, error: authError } = useAdminAuth();

  const [email, setEmail] = useState('Caritas360');
  const [password, setPassword] = useState('Caritas1234!@#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('caritas_admin_saved_login');
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch (_) {}
  }, []);

  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 500);
  };

  const validate = () => {
    let ok = true;
    setEmailError(null);
    setPassError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Enter your email or administrator username.');
      ok = false;
    }

    if (!password) {
      setPassError('Enter your password.');
      ok = false;
    } else if (password.length < 6) {
      setPassError('Password must be at least 6 characters.');
      ok = false;
    }

    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) {
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        if (rememberMe) {
          try {
            localStorage.setItem('caritas_admin_saved_login', email.trim());
          } catch (_) {}
        } else {
          try {
            localStorage.removeItem('caritas_admin_saved_login');
          } catch (_) {}
        }
        setIsDone(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/admin/');
          }
        }, 900);
      } else {
        setFormError('Incorrect email or password. Please verify your administrator credentials.');
        triggerShake();
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication failed. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('Caritas360');
    setPassword('Caritas1234!@#');
    setEmailError(null);
    setPassError(null);
    setFormError(null);
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setFormError('Please enter your email address first.');
      triggerShake();
      return;
    }
    try {
      await resetPassword(email.trim());
      setForgotSent(true);
      setTimeout(() => setForgotSent(false), 6000);
    } catch (err: any) {
      setFormError('Password reset failed: ' + (err.message || 'Unknown error'));
      triggerShake();
    }
  };

  return (
    <div className="login-wrapper">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
        rel="stylesheet"
      />

      <main className="shell">
        {/* Brand Left Panel */}
        <section className="brand" aria-hidden="true">
          <div className="brand-inner">
            <div className="logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 3 6v6c0 5 3.8 9.3 9 10 5.2-.7 9-5 9-10V6l-9-4Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Caritas Luxury Admin</span>
            </div>
            <h1>Run your platform from one dashboard.</h1>
            <p className="lead">
              Track orders, manage users and review activity in real time, with role-based access for every team member.
            </p>

            <div className="preview">
              <div className="preview-head">
                <span>Today, all regions</span>
                <span className="live">Live</span>
              </div>
              <div className="stats">
                <div className="stat">
                  <div className="label">Active users</div>
                  <div className="value">1,284</div>
                  <div className="delta">+8.2%</div>
                </div>
                <div className="stat">
                  <div className="label">Orders</div>
                  <div className="value">342</div>
                  <div className="delta">+3.1%</div>
                </div>
                <div className="stat">
                  <div className="label">Refunds</div>
                  <div className="value">9</div>
                  <div className="delta down">-1.4%</div>
                </div>
              </div>
              <svg className="spark" viewBox="0 0 400 72" preserveAspectRatio="none" role="img" aria-label="Orders per hour">
                <line className="grid" x1="0" y1="18" x2="400" y2="18" />
                <line className="grid" x1="0" y1="36" x2="400" y2="36" />
                <line className="grid" x1="0" y1="54" x2="400" y2="54" />
                <path
                  className="area"
                  d="M0 58 L40 50 L80 54 L120 38 L160 44 L200 28 L240 34 L280 20 L320 26 L360 12 L392 16 L392 72 L0 72 Z"
                />
                <path
                  className="line"
                  d="M0 58 L40 50 L80 54 L120 38 L160 44 L200 28 L240 34 L280 20 L320 26 L360 12 L392 16"
                />
                <circle className="dot" cx="392" cy="16" r="4" />
              </svg>
            </div>
          </div>
        </section>

        {/* Form Right Side */}
        <section className="form-side">
          <div className={`card ${shake ? 'shake' : ''}`} id="card">
            {!isDone ? (
              <form id="loginForm" onSubmit={handleSubmit} noValidate>
                <h2>Welcome back</h2>
                <p className="sub">Sign in to your admin account.</p>

                {formError && (
                  <div className="alert" role="alert">
                    {formError}
                  </div>
                )}

                {forgotSent && (
                  <div className="alert success" role="alert">
                    Password reset instructions sent if account exists.
                  </div>
                )}

                <div className={`field ${emailError ? 'invalid' : ''}`}>
                  <label htmlFor="email">Email address or username</label>
                  <div className="input">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(null);
                        setFormError(null);
                      }}
                      placeholder="Caritas360"
                      autoComplete="username"
                    />
                  </div>
                  {emailError && <small className="msg">{emailError}</small>}
                </div>

                <div className={`field ${passError ? 'invalid' : ''}`}>
                  <label htmlFor="password">Password</label>
                  <div className="input">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPassError(null);
                        setFormError(null);
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      id="togglePw"
                      className="eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.9 17.9A10.1 10.1 0 0 1 12 19c-6.4 0-10-7-10-7a18 18 0 0 1 4.1-5.1M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2" />
                          <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" />
                          <path d="m2 2 20 20" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passError && <small className="msg">{passError}</small>}
                </div>

                <div className="row">
                  <label className="check" htmlFor="remember">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="box">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    </span>
                    Remember me
                  </label>
                  <a href="#forgot" onClick={handleForgotPassword} className="link">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" id="submitBtn" className={`btn ${loading ? 'loading' : ''}`} disabled={loading}>
                  <span className="btn-text">{loading ? 'Signing in...' : 'Sign in'}</span>
                  <span className="spinner" aria-hidden="true"></span>
                </button>

                <p className="foot">Protected area. Authorized personnel only.</p>
              </form>
            ) : (
              <div className="done" id="done">
                <div className="tick">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </div>
                <h2>You're signed in</h2>
                <p id="doneText">Redirecting to your dashboard...</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .login-wrapper {
          --font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
          --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

          --bg: #f3f5f9;
          --surface: #ffffff;
          --field: #ffffff;
          --fg: #101828;
          --muted: #5b6578;
          --line: #dde2ec;
          --accent: #2750e0;
          --accent-hover: #1e3fb8;
          --accent-ink: #ffffff;
          --ring: rgba(39, 80, 224, 0.18);
          --danger: #c62a2a;
          --danger-bg: #fdecec;
          --danger-line: #f5c2c2;
          --ok: #17803d;
          --ok-bg: #e9f7ee;
          --ok-line: #bfe3cb;

          --brand-bg: #0f1b3d;
          --brand-fg: #f2f5ff;
          --brand-muted: #aab6d8;
          --brand-line: rgba(255, 255, 255, 0.12);
          --brand-card: rgba(255, 255, 255, 0.07);
          --brand-accent: #8fb0ff;
          --brand-good: #6fe0a0;

          font-family: var(--font-body);
          font-size: 15px;
          background: var(--bg);
          color: var(--fg);
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          width: 100%;
        }

        .shell {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          min-height: 100vh;
        }

        /* ---------- Brand panel ---------- */
        .brand {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding-block: 56px;
          padding-left: max(48px, env(safe-area-inset-left, 0px));
          padding-right: 48px;
          background: var(--brand-bg);
          color: var(--brand-fg);
        }
        .brand::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--brand-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--brand-line) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(ellipse at 30% 40%, #000 0%, transparent 75%);
          mask-image: radial-gradient(ellipse at 30% 40%, #000 0%, transparent 75%);
          opacity: 0.55;
        }
        .brand-inner {
          position: relative;
          width: 100%;
          max-width: 480px;
          min-width: 0;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 19px;
          margin-bottom: 48px;
        }
        .logo svg {
          width: 26px;
          height: 26px;
          color: var(--brand-accent);
        }
        .brand h1 {
          font-family: var(--font-display);
          font-size: clamp(30px, 3.4vw, 40px);
          line-height: 1.12;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-wrap: balance;
          margin-bottom: 14px;
          color: #ffffff !important;
        }
        .brand .lead {
          color: var(--brand-muted);
          line-height: 1.6;
          max-width: 44ch;
          margin-bottom: 32px;
        }

        .preview {
          background: var(--brand-card);
          border: 1px solid var(--brand-line);
          border-radius: 14px;
          padding: 18px;
          display: grid;
          gap: 16px;
        }
        .preview-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 12.5px;
          color: var(--brand-muted);
        }
        .live {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--brand-good);
          font-weight: 500;
        }
        .live::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--brand-good);
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .stat .label {
          font-size: 12px;
          color: var(--brand-muted);
          margin-bottom: 4px;
        }
        .stat .value {
          font-family: var(--font-display);
          font-size: 21px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .stat .delta {
          font-size: 12px;
          color: var(--brand-good);
          font-variant-numeric: tabular-nums;
        }
        .stat .delta.down {
          color: #ffb4a0;
        }
        .spark {
          width: 100%;
          height: 72px;
          display: block;
        }
        .spark .grid {
          stroke: var(--brand-line);
          stroke-width: 1;
        }
        .spark .line {
          fill: none;
          stroke: var(--brand-accent);
          stroke-width: 2;
          stroke-linejoin: round;
          stroke-linecap: round;
        }
        .spark .area {
          fill: var(--brand-accent);
          opacity: 0.16;
        }
        .spark .dot {
          fill: var(--brand-bg);
          stroke: var(--brand-accent);
          stroke-width: 2;
        }

        /* ---------- Form side ---------- */
        .form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-block: 32px;
          padding-left: max(16px, env(safe-area-inset-left, 0px));
          padding-right: max(16px, env(safe-area-inset-right, 0px));
        }
        .card {
          width: 100%;
          max-width: 420px;
          min-width: 0;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 36px 34px;
          box-shadow: 0 12px 40px rgba(16, 24, 40, 0.06);
        }
        .card h2 {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .sub {
          color: var(--muted);
          margin-top: 6px;
          font-size: 14.5px;
          margin-bottom: 24px;
        }

        .alert {
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 18px;
          background: var(--danger-bg);
          color: var(--danger);
          border: 1px solid var(--danger-line);
        }
        .alert.success {
          background: var(--ok-bg);
          color: var(--ok);
          border-color: var(--ok-line);
        }

        .field {
          margin-bottom: 16px;
        }
        .field label {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          margin-bottom: 7px;
        }
        .input {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--line);
          border-radius: 10px;
          background: var(--field);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--ring);
        }
        .input > svg {
          width: 18px;
          height: 18px;
          margin-left: 13px;
          color: var(--muted);
          flex: none;
        }
        .input input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          padding: 12px 13px;
          font: inherit;
          font-size: 14.5px;
          color: var(--fg);
        }
        .input input::placeholder {
          color: var(--muted);
          opacity: 0.7;
        }
        .eye {
          border: 0;
          background: none;
          cursor: pointer;
          padding: 8px 13px;
          color: var(--muted);
          display: flex;
          border-radius: 8px;
        }
        .eye svg {
          width: 18px;
          height: 18px;
        }
        .eye:hover {
          color: var(--fg);
        }
        .eye:focus-visible,
        .btn:focus-visible,
        .link:focus-visible,
        .ghost:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .msg {
          display: block;
          margin-top: 6px;
          font-size: 12.5px;
          color: var(--danger);
        }
        .field.invalid .input {
          border-color: var(--danger);
          box-shadow: 0 0 0 4px var(--danger-bg);
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin: 4px 0 22px;
        }
        .check {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 14px;
          color: var(--muted);
          cursor: pointer;
          user-select: none;
          position: relative;
        }
        .check input {
          position: absolute;
          opacity: 0;
          width: 18px;
          height: 18px;
        }
        .check .box {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid var(--line);
          background: var(--field);
          display: grid;
          place-items: center;
          transition: 0.15s;
        }
        .check .box svg {
          width: 12px;
          height: 12px;
          stroke: var(--accent-ink);
          opacity: 0;
        }
        .check input:checked + .box {
          background: var(--accent);
          border-color: var(--accent);
        }
        .check input:checked + .box svg {
          opacity: 1;
        }
        .check input:focus-visible + .box {
          box-shadow: 0 0 0 4px var(--ring);
        }
        .link {
          color: var(--accent);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .link:hover {
          text-decoration: underline;
        }

        .btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px;
          border: 0;
          border-radius: 10px;
          background: var(--accent);
          color: var(--accent-ink);
          font: inherit;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.15s, transform 0.05s;
        }
        .btn:hover {
          background: var(--accent-hover);
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .spinner {
          display: none;
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .btn.loading .spinner {
          display: block;
        }

        .demo {
          margin-top: 20px;
          padding: 12px 14px;
          border: 1px dashed var(--line);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 13px;
          color: var(--muted);
        }
        .demo code {
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          font-size: 12.5px;
          color: var(--fg);
          overflow-wrap: anywhere;
        }
        .ghost {
          border: 1px solid var(--line);
          background: transparent;
          color: var(--fg);
          font: inherit;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .ghost:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .foot {
          text-align: center;
          color: var(--muted);
          font-size: 12.5px;
          margin-top: 20px;
        }

        .done {
          text-align: center;
          padding: 12px 0;
        }
        .done .tick {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--ok-bg);
          color: var(--ok);
          display: grid;
          place-items: center;
          margin: 0 auto 16px;
        }
        .done .tick svg {
          width: 26px;
          height: 26px;
        }
        .done h2 {
          font-size: 22px;
          margin-bottom: 6px;
        }
        .done p {
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .card.shake {
          animation: shake 0.4s;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-8px);
          }
          40%,
          80% {
            transform: translateX(8px);
          }
        }

        @media (max-width: 900px) {
          .shell {
            grid-template-columns: 1fr;
          }
          .brand {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .card {
            padding: 28px 20px;
          }
        }
      `}</style>
    </div>
  );
}
