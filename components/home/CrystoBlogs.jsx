'use client';
import Image from 'next/image';
import Link from 'next/link';

const BLOGS = [
  {
    id: 1,
    img: '/wp-content/uploads/shop page/blog1.png',
    date: 'May 11, 2024',
    categories: 'Cushion , Emerald',
    title: 'The sparkle story by the journey through diamond manufacturing',
    href: '/why-lab-grown',
  },
  {
    id: 2,
    img: '/wp-content/uploads/shop page/blog2.png',
    date: 'May 8, 2024',
    categories: 'Marquise , Pear',
    title: 'Carving perfection by the art and science of diamond manufacture',
    href: '/why-lab-grown',
  },
  {
    id: 3,
    img: '/wp-content/uploads/shop page/blog3.png',
    date: 'May 7, 2024',
    categories: 'Cutting , Diamond',
    title: 'Shaping brilliance by the intricate world of diamond production',
    href: '/why-lab-grown',
  },
];

export default function CrystoBlogs() {
  return (
    <section
      style={{
        background: '#f5f1ec',
        padding: '70px 24px 90px',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .blog-item {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .blog-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 395 / 265;
          border-radius: 18px;
          overflow: hidden;
          background: #e8e3dc;
          border: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 18px;
        }

        .blog-img-container img {
          transition: transform 0.45s ease;
        }

        .blog-item:hover .blog-img-container img {
          transform: scale(1.06);
        }

        .blog-title {
          margin: 10px 0 0;
          font-size: 19px;
          font-weight: 700;
          color: #111111;
          font-family: 'Playfair Display', Georgia, serif;
          line-height: 1.35;
          transition: color 0.25s ease;
        }

        .blog-item:hover .blog-title {
          color: #BFA37C;
        }

        @media (max-width: 900px) {
          .blogs-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .blog-img-container {
            aspect-ratio: 16 / 10 !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* ── Section Header matching screenshot ── */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                width: '46px',
                height: '1.5px',
                background: '#222222',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                color: '#222222',
                fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                fontWeight: 600,
              }}
            >
              LATEST NEWS
            </span>
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(32px, 4.5vw, 50px)',
              fontWeight: 700,
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#111111',
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
            }}
          >
            Explore all our blogs
          </h2>
        </div>

        {/* ── 3 Blog Cards ── */}
        <div className="blogs-grid">
          {BLOGS.map((blog) => (
            <Link key={blog.id} href={blog.href} className="blog-item">
              <div className="blog-img-container">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>

              {/* Date and category tag line */}
              <div
                style={{
                  fontSize: '12.5px',
                  color: '#666666',
                  fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{blog.date}</span>
                <span>•</span>
                <span>{blog.categories}</span>
              </div>

              {/* Article Headline */}
              <h3 className="blog-title">{blog.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
