import SitePage from '../../components/SitePage.jsx';
import DiamondGrid from '../../components/diamonds/DiamondGrid.jsx';

export const metadata = {
  title: 'Lab-Grown Diamonds | Caritas Luxury',
  description: 'Explore our collection of pink and white lab-grown diamonds at Caritas Luxury.',
};

export default function DiamondsPage() {
  return (
    <SitePage
      currentPath="/diamonds"
      pageTitle="All Lab-Grown Diamonds"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      {/* Intro */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 0 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '0' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Our Collection
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 700, color: '#0C1315', marginBottom: '18px' }}>
              Pink &amp; White Lab-Grown Diamonds
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#666' }}>
              Every stone in our collection is grown in a laboratory, offering the same captivating brilliance
              and hardness as mined diamonds. Explore our signature pink and companion white collections below
              to find your perfect stone.
            </p>
          </div>
        </div>
      </section>

      <DiamondGrid />
    </SitePage>
  );
}

