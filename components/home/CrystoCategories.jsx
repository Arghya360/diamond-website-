'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '../../lib/firebase/admin-service';

const DEFAULT_CATEGORIES = [
  {
    img: '/wp-content/uploads/shop page/banner-01.jpg',
    title: 'Diamond ring',
    items: '7 Items',
    href: '/diamonds',
    textDark: false,   // dark image → white text
  },
  {
    img: '/wp-content/uploads/shop page/banner-02.jpg',
    title: 'Diamond bracelets',
    items: '3 Items',
    href: '/diamonds',
    textDark: true,    // cream/light image → dark text
  },
  {
    img: '/wp-content/uploads/shop page/bannerr-03.jpg',
    title: 'Necklace sets',
    items: '3 Items',
    href: '/diamonds',
    textDark: false,   // dark image → white text
  },
  {
    img: '/wp-content/uploads/shop page/banner-04.jpg',
    title: 'Earrings',
    items: '5 Items',
    href: '/diamonds/white',
    textDark: false,   // stone bg → white text
  },
];

export default function CrystoCategories() {
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function loadCats() {
      try {
        const firestoreCats = await getCategories();
        if (firestoreCats && firestoreCats.length > 0) {
          const published = firestoreCats.filter((c) => c.published !== false);
          if (published.length > 0) {
            const formatted = published.map((c) => ({
              img: c.image || '/wp-content/uploads/shop page/banner-01.jpg',
              title: c.name,
              items: c.itemsCountText || '5 Items',
              href: `/diamonds`,
              textDark: !!c.textDark,
            }));
            setCategoriesList(formatted);
          }
        }
      } catch (err) {
        console.error('Categories fallback to default:', err);
      }
    }
    loadCats();
  }, []);
  return (
    <section
      style={{
        background: '#f5f1ec',
        padding: '28px 24px 56px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .cat-grid {
          display: flex;
          gap: 12px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: stretch;
        }

        .cat-item {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          flex: 1;
          height: 280px;
          display: block;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .cat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.18);
        }

        /* text label sits top-left */
        .cat-text {
          position: absolute;
          top: 16px;
          left: 18px;
          z-index: 3;
        }
        .cat-text-title {
          display: block;
          font-size: 15px;
          font-weight: 700;
          font-family: var(--title-fonts, 'Readex Pro', sans-serif);
          line-height: 1.25;
          margin-bottom: 5px;
        }
        .cat-text-count {
          display: block;
          font-size: 12px;
          font-family: var(--body-fonts, 'Nunito Sans', sans-serif);
        }

        @media (max-width: 680px) {
          .cat-grid { flex-wrap: wrap; }
          .cat-item { flex: none; width: calc(50% - 6px); height: 200px; }
        }
        @media (max-width: 400px) {
          .cat-item { width: 100%; height: 220px; }
        }
      `}</style>

      <div className="cat-grid">
        {categoriesList.map((cat) => {
          const fg = cat.textDark ? '#111111' : '#ffffff';
          // For light-bg cards: subtle top overlay; for dark-bg: stronger shade
          const overlay = cat.textDark
            ? 'linear-gradient(160deg, rgba(255,255,255,0.45) 0%, transparent 50%)'
            : 'linear-gradient(160deg, rgba(0,0,0,0.38) 0%, transparent 55%)';

          return (
            <Link key={cat.title} href={cat.href} className="cat-item">
              {/* photo */}
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 680px) 45vw, 25vw"
              />

              {/* tonal overlay for text legibility */}
              <div style={{ position: 'absolute', inset: 0, background: overlay }} />

              {/* label */}
              <div className="cat-text">
                <span className="cat-text-title" style={{ color: fg }}>{cat.title}</span>
                <span className="cat-text-count" style={{ color: fg, opacity: 0.82 }}>{cat.items}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

