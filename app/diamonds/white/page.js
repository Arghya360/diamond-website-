import SitePage from '../../../components/SitePage.jsx';
import DiamondGrid from '../../../components/diamonds/DiamondGrid.jsx';

export const metadata = {
  title: 'White Lab-Grown Diamonds | Caritas Luxury',
  description: 'Explore our white lab-grown diamonds — timeless brilliance, exceptional quality, grown in a laboratory.',
};

export default function WhiteDiamondsPage() {
  return (
    <SitePage
      currentPath="/diamonds/white"
      pageTitle="White Lab-Grown Diamonds"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 0 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '0' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              White Collection
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 700, color: '#0C1315', marginBottom: '18px' }}>
              White Lab-Grown Diamonds
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#666' }}>
              Timeless and radiant, our companion collection of white lab-grown diamonds offers exceptional
              clarity, fire, and durability. Grown in laboratories without diamond mining, each diamond is
              finished with master craftsmanship.
            </p>
          </div>
        </div>
      </section>

      <DiamondGrid prefilterColour="white" />
    </SitePage>
  );
}

