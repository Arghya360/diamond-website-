// Server-safe component for the 3 Inquiries Cards section
export default function ContactInquiryCards() {
  function ChatWatermark({ color = 'currentColor', opacity = 0.12 }) {
    return (
      <svg
        width="110"
        height="100"
        viewBox="0 0 120 110"
        fill="none"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          right: '8px',
          bottom: '6px',
          pointerEvents: 'none',
          opacity,
        }}
      >
        {/* Back bubble with ? */}
        <path d="M72 12 C90 12 102 24 102 38 C102 52 90 62 76 64 L76 76 L64 65 C60 65 56 64 52 62" />
        <path d="M75 26 C79 23 85 25 85 30 C85 34 81 36 81 41" />
        <circle cx="81" cy="48" r="1.5" fill={color} />
        {/* Front bubble */}
        <rect x="12" y="34" width="68" height="52" rx="12" />
        <path d="M26 86 L18 99 L36 86" />
        {/* Lines inside front bubble */}
        <line x1="26" y1="52" x2="66" y2="52" />
        <line x1="26" y1="64" x2="52" y2="64" />
      </svg>
    );
  }

  return (
    <div style={{ marginBottom: '60px' }}>
      <style>{`
        .inquiry-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 28px;
        }
        @media (max-width: 991px) {
          .inquiry-cards-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>

      {/* ── Section Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '38px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <span style={{ width: '42px', height: '1.5px', backgroundColor: '#111111', display: 'inline-block' }} />
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#111111',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
            }}
          >
            PRIVATE CONSULTATIONS
          </span>
        </div>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: 'clamp(36px, 4.5vw, 54px)',
            fontWeight: 700,
            color: '#000000',
            letterSpacing: '-0.5px',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Let&apos;s Create Something Extraordinary
        </h2>
      </div>

      {/* ── 3 Inquiries Cards ──────────────────────────────────────── */}
      <div className="inquiry-cards-grid">
        {/* Card 1: General inquiries (White) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dcdcdc',
            borderRadius: '16px',
            padding: '34px 30px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '290px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#000000',
                margin: 0,
              }}
            >
              Diamond Enquiries
            </h3>
            <div style={{ borderBottom: '1px solid #e8e8e8', margin: '18px 0 22px' }} />
            <div style={{ fontSize: '15px', lineHeight: 1.65, color: '#555555' }}>
              <div style={{ marginBottom: '6px' }}>Whether you are exploring our signature pink diamonds or searching for a classic white stone, our team is here to help.</div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#000000',
                textDecoration: 'underline',
                textUnderlineOffset: '5px',
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              }}
            >
              VIEW LIVE LOCATION
            </a>
          </div>

          <ChatWatermark color="#000000" opacity={0.07} />
        </div>

        {/* Card 2: Product inquiries (Black) */}
        <div
          style={{
            backgroundColor: '#000000',
            border: 'none',
            borderRadius: '16px',
            padding: '34px 30px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '290px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Bespoke Ring Design
            </h3>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.16)', margin: '18px 0 22px' }} />
            <div style={{ fontSize: '15px', lineHeight: 1.65, color: 'rgba(255, 255, 255, 0.9)' }}>
              <div style={{ marginBottom: '6px' }}>Create a bespoke ring with your choice of lab-grown diamond and setting. We guide you through every step from stone selection to final design.</div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <a
              href="#contact-tabs-section"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#ffffff',
                textDecoration: 'underline',
                textUnderlineOffset: '5px',
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              }}
            >
              SEND INQUIRIES
            </a>
          </div>

          <ChatWatermark color="#ffffff" opacity={0.09} />
        </div>

        {/* Card 3: Supplier inquiries (Orange) */}
        <div
          style={{
            backgroundColor: '#ff5400',
            border: 'none',
            borderRadius: '16px',
            padding: '34px 30px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '290px',
            boxShadow: '0 8px 30px rgba(255, 84, 0, 0.25)',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Pink Diamond Enquiries
            </h3>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.28)', margin: '18px 0 22px' }} />
            <div style={{ fontSize: '15px', lineHeight: 1.65, color: '#ffffff' }}>
              <div style={{ marginBottom: '6px', opacity: 0.95 }}>Interested in our signature pink lab-grown diamonds? Contact us to explore our collection from delicate blush to vivid rose.</div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <a
              href="#contact-tabs-section"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#ffffff',
                textDecoration: 'underline',
                textUnderlineOffset: '5px',
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              }}
            >
              SEND INQUIRIES
            </a>
          </div>

          <ChatWatermark color="#000000" opacity={0.08} />
        </div>
      </div>
    </div>
  );
}
