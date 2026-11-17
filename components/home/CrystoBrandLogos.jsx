import Image from 'next/image';
import { Fragment } from 'react';

const LOGOS = [
  { src: '/wp-content/uploads/2024/02/h1-client-logo-001.png', hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-001.png', alt: 'Brand 1' },
  { src: '/wp-content/uploads/2024/02/h1-client-logo-002.png', hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-002.png', alt: 'Brand 2' },
  { src: '/wp-content/uploads/2024/02/h1-client-logo-003.png', hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-003.png', alt: 'Brand 3' },
  { src: '/wp-content/uploads/2024/02/h1-client-logo-004.png', hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-004.png', alt: 'Brand 4' },
  { src: '/wp-content/uploads/2024/02/h1-client-logo-005.png', hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-005.png', alt: 'Brand 5' },
  { src: '/wp-content/uploads/2024/02/h1-client-logo-006.png', hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-006.png', alt: 'Brand 6' },
];

export default function CrystoBrandLogos() {
  return (
    <section style={{ background: '#ffffff', padding: '48px 24px', boxSizing: 'border-box' }}>
      <style>{`
        .brand-logo-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-width: 100px;
          height: 56px;
          opacity: 0.6;
          filter: grayscale(1);
          transition: opacity 0.3s, filter 0.3s;
        }
        .brand-logo-item:hover { opacity: 1; filter: grayscale(0); }
        .brand-sep {
          width: 1px;
          height: 36px;
          background: rgba(0,0,0,0.12);
          flex-shrink: 0;
        }
        @media (max-width: 540px) {
          .brand-row { flex-wrap: wrap !important; gap: 24px !important; }
          .brand-sep { display: none !important; }
          .brand-logo-item { min-width: calc(33% - 16px) !important; }
        }
      `}</style>
      <div
        className="brand-row"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
        }}
      >
        {LOGOS.map((logo, i) => (
          <Fragment key={logo.alt}>
            <div className="brand-logo-item">
              <Image src={logo.src} alt={logo.alt} width={120} height={50} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '44px' }} />
            </div>
            {i < LOGOS.length - 1 && <div className="brand-sep" />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
