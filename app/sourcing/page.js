import SitePage from '../../components/SitePage.jsx';

export const metadata = {
  title: 'Lab-Grown Diamond Sourcing | Caritas Luxury',
  description: 'Learn about Caritas Luxury lab-grown diamond sourcing — created in laboratories without diamond mining.',
};

const pillars = [
  {
    title: 'No Diamond Mining',
    desc: 'Our diamonds are grown in laboratories, so there is no need to excavate a diamond mine to recover them. Avoiding that step also avoids the direct land disturbance and disruption to wildlife habitats associated with extracting those stones.',
  },
  {
    title: 'Laboratory Grown',
    desc: 'Created in advanced, highly controlled laboratory environments using precise technological processes, each diamond develops with the exact physical, optical, and chemical properties of mined stones.',
  },
  {
    title: 'Specialist Selection',
    desc: 'From our signature pink diamonds to classic white stones, every rough diamond is carefully evaluated and cut by master artisans to unlock optimal fire, scintillation, and brilliance.',
  },
  {
    title: 'Independent Certification',
    desc: 'Our diamonds can be independently certified with comprehensive 4Cs documentation by world-recognized gemological laboratories such as IGI or GIA.',
  },
];

export default function SourcingPage() {
  return (
    <SitePage
      currentPath="/sourcing"
      pageTitle="Sourcing & Sustainability"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '90px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto 60px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Our Supply Chain
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '40px', fontWeight: 700, color: '#0C1315', marginBottom: '20px' }}>
              Responsible Diamond Sourcing
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#666' }}>
              Caritas Luxury offers diamonds grown in laboratories, bypassing the need for diamond mining.
              Discover how our lab-grown diamonds combine extraordinary beauty with modern innovation.
            </p>
          </div>

          <div className="row">
            {pillars.map((item) => (
              <div key={item.title} className="col-md-6 mb-4">
                <div style={{ padding: '36px 32px', backgroundColor: '#F9F7F4', borderRadius: '14px', height: '100%' }}>
                  <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--primary-color,#BFA37C)', borderRadius: '2px', marginBottom: '18px' }} />
                  <h3 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '12px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#666', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a
              href="/diamonds"
              style={{
                display: 'inline-block',
                padding: '14px 34px',
                backgroundColor: 'var(--primary-color,#BFA37C)',
                color: '#fff',
                borderRadius: '8px',
                fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Explore Lab-Grown Diamonds
            </a>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
