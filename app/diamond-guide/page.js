import SitePage from '../../components/SitePage.jsx';

export const metadata = {
  title: 'Your Guide to Lab-Grown Diamonds | Caritas Luxury',
  description: 'Everything you need to know about lab-grown diamonds — from the 4Cs to choosing the right cut and carat for your jewellery.',
};

const sections = [
  { heading: 'The 4Cs of Lab-Grown Diamonds', body: 'Cut, Colour, Clarity, and Carat weight apply to lab-grown diamonds exactly as they do to mined stones. The grading reports from IGI and GIA are identical in format and rigour.' },
  { heading: 'Choosing a Shape',              body: 'Round brilliant maximises sparkle. Princess and cushion cuts offer a modern look. Oval and pear shapes create the illusion of a larger stone. Emerald and asscher cuts highlight clarity.' },
  { heading: 'Colour Grades Explained',       body: 'Colourless (D–F) diamonds show no colour at all. Near-colourless (G–J) grades are indistinguishable in a setting. Fancy colours — such as pink — are graded on a separate intensity scale.' },
  { heading: 'What Certification Means',      body: 'An independent grading report from IGI or GIA confirms all 4C measurements. Never purchase a lab-grown diamond without a valid third-party certificate.' },
  { heading: 'Pink vs White Lab-Grown',       body: 'White lab-grown diamonds are created with the same process used for natural colourless stones. Pink lab-grown diamonds achieve their hue through controlled post-growth treatment — a process that mirrors how natural pink diamonds form.' },
];

export default function DiamondGuidePage() {
  return (
    <SitePage
      currentPath="/diamond-guide"
      pageTitle="Diamond Guide"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '50px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Buyer's Guide
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '40px', fontWeight: 700, color: '#0C1315', marginBottom: '18px' }}>
              Your Complete Lab-Grown Diamond Guide
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#666' }}>
              Whether you're buying your first diamond or upgrading to a larger lab-grown stone,
              this guide covers everything you need to make a confident, informed decision.
            </p>
          </div>

          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: '48px', borderLeft: '4px solid var(--primary-color,#BFA37C)', paddingLeft: '28px' }}>
              <h3 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '22px', fontWeight: 700, color: '#0C1315', marginBottom: '12px' }}>
                {s.heading}
              </h3>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#555', margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <a href="/diamonds" style={{ padding: '14px 32px', backgroundColor: 'var(--primary-color,#BFA37C)', color: '#fff', borderRadius: '8px', fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '15px', fontWeight: 700, textDecoration: 'none', marginRight: '16px' }}>
              Explore Diamonds
            </a>
            <a href="/contact" style={{ padding: '14px 32px', border: '2px solid var(--primary-color,#BFA37C)', color: 'var(--primary-color,#BFA37C)', borderRadius: '8px', fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
              Request a Consultation
            </a>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

