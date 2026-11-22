'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '../../lib/firebase/admin-service';

const TABS = ['All', 'Rings', 'Earrings', 'Diamonds', 'Necklaces', 'Bracelets'];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    img: '/wp-content/uploads/shop page/pro-21-300x300.png',
    title: 'Pink Morganite Butterfly Ring',
    price: '$4,200',
    originalPrice: '$5,190',
    discount: '-19%',
    rating: 4.8,
    tab: 'Rings',
  },
  {
    id: 2,
    img: '/wp-content/uploads/shop page/pro-03-300x300.jpg',
    title: 'Fancy Pink Drop Earrings',
    price: '$2,100',
    originalPrice: '$2,599',
    discount: '-19%',
    rating: 4.6,
    tab: 'Earrings',
  },
  {
    id: 3,
    img: '/wp-content/uploads/shop page/pro-05-300x300.jpg',
    title: 'Teal Drop Ring & Earring Set',
    price: '$3,600',
    originalPrice: null,
    discount: null,
    rating: 4.9,
    tab: 'Rings',
  },
  {
    id: 4,
    img: '/wp-content/uploads/shop page/pro-04-300x300.jpg',
    title: 'Pink Cluster Necklace',
    price: '$600',
    originalPrice: null,
    discount: null,
    rating: 4.5,
    tab: 'Necklaces',
  },
  {
    id: 5,
    img: '/wp-content/uploads/shop page/pro-07-300x300.jpg',
    title: 'Emerald Serpentine Ring',
    price: '$4,800',
    originalPrice: null,
    discount: null,
    rating: 5.0,
    tab: 'Rings',
  },
  {
    id: 6,
    img: '/wp-content/uploads/shop page/banner-01.jpg',
    title: 'Emerald Eternity Band',
    price: '$2,800',
    originalPrice: null,
    discount: null,
    rating: 4.7,
    tab: 'Rings',
  },
];

function StarRating({ rating }) {
  const gold = '#BFA37C';
  return (
    <span style={{ color: gold, fontSize: '12px' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#888', marginLeft: '4px', fontSize: '11px' }}>({rating})</span>
    </span>
  );
}

export default function CrystoNewArrivals() {
  const [activeTab, setActiveTab] = useState('All');
  const [productsList, setProductsList] = useState(DEFAULT_PRODUCTS);
  const gold = '#BFA37C';

  useEffect(() => {
    async function loadFromFirebase() {
      try {
        const firestoreProducts = await getProducts({ publishedOnly: true });
        if (firestoreProducts && firestoreProducts.length > 0) {
          // Format Firestore products to match component shape
          const formatted = firestoreProducts
            .filter((p) => p.isNewArrival !== false)
            .map((p) => {
              const orig = p.salePrice ? `$${p.salePrice.toLocaleString()}` : null;
              const disc = p.salePrice && p.price < p.salePrice
                ? `-${Math.round(((p.salePrice - p.price) / p.salePrice) * 100)}%`
                : null;
              return {
                id: p.id,
                img: p.images?.[0]?.url || '/wp-content/uploads/shop page/pro-21-300x300.png',
                title: p.name,
                price: `$${(p.price || 0).toLocaleString()}`,
                originalPrice: orig,
                discount: disc,
                rating: p.rating || 5.0,
                tab: p.category || 'Rings',
              };
            });
          if (formatted.length > 0) {
            setProductsList(formatted);
          }
        }
      } catch (err) {
        console.error('Using default products fallback:', err);
      }
    }
    loadFromFirebase();
  }, []);

  const visible = activeTab === 'All' ? productsList : productsList.filter((p) => p.tab === activeTab);

  return (
    <section style={{ background: '#f5f1ec', padding: '70px 0 80px', boxSizing: 'border-box' }}>
      <style>{`
        .arrivals-tab {
          background: transparent;
          border: none;
          font-family: var(--body-fonts, 'Nunito Sans', sans-serif);
          font-size: 13px;
          cursor: pointer;
          padding: 6px 0;
          position: relative;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .arrivals-tab.active { color: #111 !important; }
        .arrivals-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #111;
        }
        .product-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s;
        }
        .product-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
        .product-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
        }
        .arrivals-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .arrivals-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .arrivals-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Heading row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: gold, fontFamily: 'var(--body-fonts,"Nunito Sans",sans-serif)' }}>
              — EXPLORE NOW
            </p>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', color: '#111', lineHeight: 1.1 }}>
              New Arrivals
            </h2>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`arrivals-tab${activeTab === tab ? ' active' : ''}`}
                style={{ color: activeTab === tab ? '#111' : '#888' }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="arrivals-grid">
          {visible.map((product) => (
            <Link key={product.id} href="/diamonds" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card">
                <div className="product-card-img-wrap">
                  <Image
                    src={product.img}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
                    sizes="(max-width: 540px) 90vw, (max-width: 900px) 45vw, 30vw"
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  {product.discount && (
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#ff5722', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--body-fonts,"Nunito Sans",sans-serif)' }}>
                      {product.discount}
                    </span>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <StarRating rating={product.rating} />
                  <h4 style={{ margin: '8px 0 6px', fontSize: '14px', fontWeight: 600, color: '#111', fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', lineHeight: 1.3 }}>
                    {product.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>{product.price}</span>
                    {product.originalPrice && (
                      <span style={{ fontSize: '13px', color: '#aaa', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link
            href="/diamonds"
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              background: '#111111',
              color: '#fff',
              fontFamily: 'var(--body-fonts,"Nunito Sans",sans-serif)',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'background 0.2s',
            }}
          >
            LOAD MORE PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}
