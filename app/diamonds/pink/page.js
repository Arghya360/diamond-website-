import SitePage from '../../../components/SitePage.jsx';
import DiamondGrid from '../../../components/diamonds/DiamondGrid.jsx';

export const metadata = {
  title: 'Pink Lab-Grown Diamonds | Caritas Luxury',
  description: 'Discover our signature pink lab-grown diamonds. From delicate blush to vivid rose — extraordinary colour, extraordinary beauty.',
};

export default function PinkDiamondsPage() {
  return (
    <SitePage
      currentPath="/diamonds/pink"
      pageTitle="Pink Lab-Grown Diamonds"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 0 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '0' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Pink Collection
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 700, color: '#0C1315', marginBottom: '18px' }}>
              Pink Lab-Grown Diamonds
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#666' }}>
              Discover our signature collection of pink lab-grown diamonds, from delicate blush to vivid rose.
              Grown in laboratories without diamond mining, each stone is chosen for its extraordinary colour,
              brilliance, and individuality.
            </p>
          </div>
        </div>
      </section>

      <DiamondGrid prefilterColour="pink" />
    </SitePage>
  );
}

