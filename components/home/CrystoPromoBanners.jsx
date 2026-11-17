import Image from 'next/image';
import Link from 'next/link';

export default function CrystoPromoBanners() {
  return (
    <section
      style={{
        background: '#f5f1ec',
        padding: '50px 24px 70px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .promo-banners-row {
          display: flex;
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: stretch;
        }

        .promo-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #ffffff;
        }
        .promo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .promo-card-1 {
          flex: 1.28;
          height: 230px;
          background: #fde8ea;
        }

        .promo-card-2 {
          flex: 1;
          height: 230px;
        }

        .promo-card-3 {
          flex: 1;
          height: 230px;
          background: #000000;
        }

        @media (max-width: 900px) {
          .promo-banners-row {
            flex-direction: column !important;
          }
          .promo-card-1, .promo-card-2, .promo-card-3 {
            flex: none !important;
            width: 100% !important;
            height: 220px !important;
          }
        }
      `}</style>

      <div className="promo-banners-row">
        {/* ── Card 1: 10+1 Advance purchase plan ── */}
        <Link href="/create-your-own" className="promo-card promo-card-1">
          <Image
            src="/wp-content/uploads/shop page/banner-05.jpg"
            alt="10+1 Advance purchase plan"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'right center' }}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
          {/* Subtle overlay to ensure typography contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(253, 232, 234, 0.95) 0%, rgba(253, 232, 234, 0.75) 45%, transparent 80%)',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 28px',
              maxWidth: '300px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  lineHeight: 0.95,
                  color: '#111111',
                  letterSpacing: '-1px',
                }}
              >
                10+1
              </span>
              <div
                style={{
                  borderBottom: '1.5px solid #111111',
                  paddingBottom: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    fontFamily: '"Playfair Display", Georgia, serif',
                    color: '#111111',
                    lineHeight: 1.2,
                  }}
                >
                  Advance
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    fontFamily: '"Playfair Display", Georgia, serif',
                    color: '#111111',
                    lineHeight: 1.2,
                  }}
                >
                  purchase plan
                </span>
              </div>
            </div>

            <p
              style={{
                margin: '14px 0 0',
                fontSize: '11px',
                lineHeight: 1.55,
                color: '#444444',
                fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                letterSpacing: '0.2px',
              }}
            >
              A scheme thoughtfully designed,
              <br />
              just like our jewellery!
            </p>
          </div>
        </Link>

        {/* ── Card 2: NECK CHARM ── */}
        <Link href="/diamonds/white" className="promo-card promo-card-2">
          <Image
            src="/wp-content/uploads/shop page/banner-06.png"
            alt="NECK CHARM"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            sizes="(max-width: 900px) 100vw, 29vw"
          />
          {/* Subtle gradient to highlight the white text at bottom */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.2) 45%, transparent 75%)',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '22px',
              left: '16px',
              right: '16px',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                marginBottom: '5px',
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  maxWidth: '36px',
                }}
              />
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  lineHeight: 1,
                }}
              >
                NECK CHARM
              </span>
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  maxWidth: '36px',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 600,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.82)',
                fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
              }}
            >
              THE WEDDING COLLECTION WITH US
            </span>
          </div>
        </Link>

        {/* ── Card 3: Arema ── */}
        <Link href="/diamonds/pink" className="promo-card promo-card-3">
          <Image
            src="/wp-content/uploads/shop page/banner-07.png"
            alt="Arema"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="(max-width: 900px) 100vw, 29vw"
          />
          {/* Subtle gradient to highlight the white text on the left */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.15) 55%, transparent 100%)',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '22px',
              left: '22px',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                fontSize: '34px',
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: '"Playfair Display", Georgia, serif',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              Arema
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.78)',
                fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                letterSpacing: '0.4px',
              }}
            >
              #trendingJustlaunchedcollection
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
