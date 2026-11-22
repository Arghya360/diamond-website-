'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '../../lib/firebase/admin-service';

const DEFAULT_TRENDING = [
  {
    id: 1,
    img: '/wp-content/uploads/shop page/pro-21-300x300.png',
    title: 'Pink Morganite Butterfly Ring',
    price: 'From $4,200',
    badge: 'NEW',
    rating: 4.9,
  },
  {
    id: 2,
    img: '/wp-content/uploads/shop page/pro-03-300x300.jpg',
    title: 'Purple Diamond Hoop Earrings',
    price: 'From $2,100',
    badge: 'HOT',
    rating: 4.8,
  },
  {
    id: 3,
    img: '/wp-content/uploads/shop page/pro-05-300x300.jpg',
    title: 'Teal Drop Halo Ring',
    price: 'From $77.00',
    badge: 'NEW',
    rating: 5.0,
  },
  {
    id: 4,
    img: '/wp-content/uploads/shop page/pro-04-300x300.jpg',
    title: 'Pink Cluster Necklace',
    price: 'From $600',
    badge: null,
    rating: 4.7,
  },
  {
    id: 5,
    img: '/wp-content/uploads/shop page/banner-02.jpg',
    title: 'Diamond Pavé Band',
    price: 'From $900',
    badge: null,
    rating: 4.9,
  },
  {
    id: 6,
    img: '/wp-content/uploads/shop page/pro-07-300x300.jpg',
    title: 'Emerald Serpentine Ring',
    price: 'From $1,742',
    badge: 'TRENDING',
    rating: 5.0,
  },
  {
    id: 7,
    img: '/wp-content/uploads/shop page/banner-01.jpg',
    title: 'Emerald Eternity Band',
    price: 'From $2,800',
    badge: null,
    rating: 4.8,
  },
  {
    id: 8,
    img: '/wp-content/uploads/shop page/banner-04.jpg',
    title: 'Rainbow Gemstone Huggies',
    price: 'From $1,250',
    badge: 'BESTSELLER',
    rating: 4.9,
  },
  {
    id: 9,
    img: '/wp-content/uploads/shop page/bannerr-03.jpg',
    title: 'Sapphire Collar Necklace Set',
    price: 'From $3,400',
    badge: null,
    rating: 5.0,
  },
];

export default function CrystoTrendingProducts() {
  const [trendingList, setTrendingList] = useState(DEFAULT_TRENDING);
  const gold = '#BFA37C';

  useEffect(() => {
    async function loadTrending() {
      try {
        const firestoreProducts = await getProducts({ publishedOnly: true });
        if (firestoreProducts && firestoreProducts.length > 0) {
          const trending = firestoreProducts.filter((p) => p.isTrending || p.isFeatured);
          const sourceList = trending.length > 0 ? trending : firestoreProducts;
          const formatted = sourceList.map((p) => ({
            id: p.id,
            img: p.images?.[0]?.url || '/wp-content/uploads/shop page/pro-21-300x300.png',
            title: p.name,
            price: `From $${(p.price || 0).toLocaleString()}`,
            badge: p.badge || (p.isNewArrival ? 'NEW' : null),
            rating: p.rating || 5.0,
          }));
          if (formatted.length > 0) {
            setTrendingList(formatted);
          }
        }
      } catch (err) {
        console.error('Trending products fallback to default:', err);
      }
    }
    loadTrending();
  }, []);

  // Duplicate items for seamless continuous infinite marquee
  const items = [...trendingList, ...trendingList];

  return (
    <section
      style={{
        background: '#ffffff',
        padding: '70px 0 80px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes marqueeInfinite {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .infinite-marquee-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 10px 0 20px;
        }

        .infinite-marquee-track {
          display: flex;
          gap: 22px;
          width: max-content;
          animation: marqueeInfinite 38s linear infinite;
          will-change: transform;
        }

        .infinite-marquee-container:hover .infinite-marquee-track {
          animation-play-state: paused;
        }

        .trending-card {
          flex: 0 0 250px;
          width: 250px;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .trending-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12);
        }

        .trending-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #faf8f5;
          overflow: hidden;
        }

        .trending-card-img-wrap img {
          transition: transform 0.45s ease;
        }

        .trending-card:hover .trending-card-img-wrap img {
          transform: scale(1.08);
        }

        .edge-fade-left {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 80px;
          background: linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          z-index: 5;
          pointer-events: none;
        }

        .edge-fade-right {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 80px;
          background: linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          z-index: 5;
          pointer-events: none;
        }

        @media (max-width: 600px) {
          .trending-card {
            flex: 0 0 200px;
            width: 200px;
          }
          .edge-fade-left, .edge-fade-right {
            width: 30px;
          }
        }
      `}</style>

      {/* ── Section Header ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 36px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: gold,
                fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                fontWeight: 600,
              }}
            >
              — TRENDING NOW
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                color: '#111111',
                lineHeight: 1.1,
              }}
            >
              Featured Products
            </h2>
          </div>
          <Link
            href="/diamonds"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#111111',
              textDecoration: 'none',
              fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: '1px solid #111111',
              paddingBottom: '2px',
            }}
          >
            View all →
          </Link>
        </div>
      </div>

      {/* ── Infinite Marquee Carousel ── */}
      <div className="infinite-marquee-container">
        <div className="edge-fade-left" />
        <div className="edge-fade-right" />

        <div className="infinite-marquee-track">
          {items.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href="/diamonds"
              className="trending-card"
            >
              <div className="trending-card-img-wrap">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="250px"
                />
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: item.badge === 'HOT' ? '#e53935' : item.badge === 'BESTSELLER' ? '#111111' : '#ff5722',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                      zIndex: 2,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ color: gold, fontSize: '11px' }}>★</span>
                  <span style={{ fontSize: '11px', color: '#777777', fontWeight: 600, fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)' }}>
                    {item.rating}
                  </span>
                </div>
                <h4
                  style={{
                    margin: '0 0 6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111111',
                    fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                    lineHeight: 1.35,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.title}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#222222',
                    fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                  }}
                >
                  {item.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
