'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '../../lib/firebase/admin-service';

const DEFAULT_DIAMONDS = [
  {
    img: '/wp-content/uploads/shop page/category-01.png',
    title: 'Round Brilliant',
    href: '/diamonds/white',
  },
  {
    img: '/wp-content/uploads/shop page/category-02.png',
    title: 'Triangle Cut',
    href: '/diamonds/white',
  },
  {
    img: '/wp-content/uploads/shop page/category-03.png',
    title: 'Pink Diamonds',
    href: '/diamonds/pink',
  },
  {
    img: '/wp-content/uploads/shop page/category-04.png',
    title: 'Emerald Cut',
    href: '/diamonds/white',
  },
];

export default function CrystoShopByDiamonds() {
  const gold = '#BFA37C';
  const [shapes, setShapes] = useState(DEFAULT_DIAMONDS);

  useEffect(() => {
    async function loadShapes() {
      try {
        const cats = await getCategories();
        if (cats && cats.length > 0) {
          const shapeCats = cats.filter(c => c.subcategories && c.subcategories.includes('Shapes'));
          if (shapeCats.length >= 4) {
            setShapes(shapeCats.map(c => ({
              img: c.image || '/wp-content/uploads/shop page/category-01.png',
              title: c.name,
              href: c.slug === 'pink-diamonds' ? '/diamonds/pink' : '/diamonds/white'
            })));
          }
        }
      } catch (e) {
        // Fallback to default shapes cleanly
      }
    }
    loadShapes();
  }, []);

  return (
    <section style={{ background: '#f5f1ec', padding: '70px 24px', boxSizing: 'border-box' }}>
      <style>{`
        .diamond-shape-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-decoration: none;
          color: inherit;
          flex: 1;
          min-width: 160px;
        }
        .diamond-shape-img {
          position: relative;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .diamond-shape-card:hover .diamond-shape-img {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.18);
        }
        .diamond-shape-name {
          font-family: var(--title-fonts, 'Readex Pro', sans-serif);
          font-size: 15px;
          font-weight: 600;
          color: #111;
          text-align: center;
        }
        @media (max-width: 640px) {
          .diamonds-row { flex-wrap: wrap !important; }
          .diamond-shape-card { min-width: calc(50% - 16px) !important; }
          .diamond-shape-img { width: 130px !important; height: 130px !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section heading */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: gold, fontFamily: 'var(--body-fonts,"Nunito Sans",sans-serif)' }}>
            — OUR COLLECTION
          </p>
          <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', color: '#111', lineHeight: 1.1 }}>
            Shop by Shape and Carat
          </h2>
          <p style={{ margin: 0, fontSize: '15px', color: '#666', maxWidth: '600px', lineHeight: 1.6, fontFamily: 'var(--body-fonts,"Nunito Sans",sans-serif)' }}>
            Every diamond has its own character. Explore our collection by shape and carat weight to discover a stone that reflects your personal style.
          </p>
        </div>

        {/* Diamond type row */}
        <div
          className="diamonds-row"
          style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'nowrap' }}
        >
          {shapes.map((d) => (
            <Link key={d.title} href={d.href} className="diamond-shape-card">
              <div className="diamond-shape-img">
                <Image
                  src={d.img}
                  alt={d.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="180px"
                />
              </div>
              <span className="diamond-shape-name">{d.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
