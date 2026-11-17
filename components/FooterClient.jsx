'use client';

import { useState } from 'react';

// ─── Social circle icon link ──────────────────────────────────────────────
export function SocialCircle({ href, label, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href || '#'}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: hovered ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.25)',
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

// ─── Header newsletter subscribe form matching reference image ────────────
export function CrystoSubscribeForm() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    alert('Thank you for subscribing!');
    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '680px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.28)',
          paddingBottom: '8px',
          gap: '16px',
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          aria-label="Enter your email address"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '15px',
            fontFamily: 'inherit',
            padding: '8px 0',
          }}
        />
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            textDecoration: 'underline',
            textUnderlineOffset: '6px',
            cursor: 'pointer',
            padding: '8px 0',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
          }}
        >
          SUBSCRIBE NOW
        </button>
      </div>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '16px',
          cursor: 'pointer',
          color: 'rgba(255, 255, 255, 0.55)',
          fontSize: '13px',
        }}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{
            accentColor: '#ffffff',
            width: '14px',
            height: '14px',
            cursor: 'pointer',
          }}
        />
        <span>I agree to all terms and policies</span>
      </label>
    </form>
  );
}

// ─── ScrollToTop (kept for user convenience / test safety) ─────────────────
export function ScrollToTop() {
  function handleClick() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      style={{
        display: 'none',
      }}
    />
  );
}

