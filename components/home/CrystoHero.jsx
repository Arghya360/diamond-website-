'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function CrystoHero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .hero-shine-btn {
          display: inline-block;
          padding: 12px 32px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.5);
          color: #ffffff;
          font-family: var(--body-fonts, 'Nunito Sans', sans-serif);
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.3s, border-color 0.3s;
          cursor: pointer;
        }
        .hero-shine-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: #ffffff;
        }
        .hero-shine-word {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(40px, 6.5vw, 92px);
          font-weight: 700;
          line-height: 0.9;
          color: #ffffff;
          letter-spacing: -2px;
          text-transform: uppercase;
        }
        @media (max-width: 900px) {
          .hero-inner { flex-direction: column !important; padding-top: 120px !important; }
          .hero-left-text  { align-items: center !important; text-align: center !important; }
          .hero-right-text { align-items: center !important; text-align: center !important; }
          .hero-img-col { width: 70vw !important; height: 260px !important; }
        }
        @media (max-width: 540px) {
          .hero-img-col { width: 90vw !important; height: 200px !important; }
        }
      `}</style>

      {/* ── Thin left & right edge fades to blend with the section bg ── */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #080808 0%, transparent 18%, transparent 82%, #080808 100%)', zIndex: 1, pointerEvents: 'none' }} />
      {/* Top & bottom fades */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #080808 0%, transparent 15%, transparent 85%, #080808 100%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* ── Three-column content row ─────────────────────────────────── */}
      <div
        className="hero-inner"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '120px 40px 90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Left text ── */}
        <div
          className="hero-left-text"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '18px', flex: '1', minWidth: 0 }}
        >
          <span className="hero-shine-word">SHINE</span>
          <span className="hero-shine-word">BRIGHT</span>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.8, maxWidth: '210px', fontFamily: 'var(--body-fonts,"Nunito Sans",sans-serif)', margin: '6px 0' }}>
            Lab-grown diamonds in extraordinary colour. Discover our signature pink and white collection.
          </p>
          <Link href="/diamonds/pink" className="hero-shine-btn">
            EXPLORE
          </Link>
        </div>

        {/* ── Centre: diamond image, contained & smaller ── */}
        <div
          className="hero-img-col"
          style={{
            position: 'relative',
            width: '38%',
            height: '340px',
            flexShrink: 0,
          }}
        >
          <Image
            src="/wp-content/uploads/shop page/header picture.png"
            alt="Brilliant cut diamond"
            fill
            priority
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            sizes="(max-width: 900px) 70vw, 38vw"
          />
        </div>

        {/* ── Right text ── */}
        <div
          className="hero-right-text"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '18px', flex: '1', minWidth: 0 }}
        >
          <span className="hero-shine-word" style={{ textAlign: 'right' }}>DAY AND</span>
          <span className="hero-shine-word" style={{ textAlign: 'right' }}>NIGHT</span>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.8, maxWidth: '210px', textAlign: 'right', fontFamily: 'var(--body-fonts,"Nunito Sans",sans-serif)', margin: '6px 0' }}>
            Lab-grown diamonds. No diamond mining. Crafted for every moment.
          </p>
        </div>
      </div>
    </section>
  );
}
