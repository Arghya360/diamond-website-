import SitePage from '../../components/SitePage.jsx';

export const metadata = {
  title: 'Terms & Conditions – Lab-Grown Diamonds | Caritas Luxury',
  description: 'Terms and conditions for Caritas Luxury lab-grown diamonds.',
};

export default function TermsPage() {
  return (
    <SitePage
      currentPath="/terms"
      pageTitle="Terms & Conditions"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '90px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Legal Terms
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '38px', fontWeight: 700, color: '#0C1315', marginBottom: '20px' }}>
              Terms Of Service For Lab-Grown Diamonds
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#666' }}>
              These Terms and Conditions apply to all consultations, orders, custom designs, and purchases
              of certified lab-grown diamonds made through Caritas Luxury.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Diamond Certification &amp; Accuracy
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              All lab-grown diamonds sold by Caritas Luxury are accompanied by an independent grading report from accredited
              gemological laboratories. All weights, grades, and measurements are stated with gemological accuracy.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Bespoke &amp; Custom Orders
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              For custom lab-grown diamond jewellery, digital 3D renders and stone specifications must be approved
              prior to casting. Production begins immediately upon written confirmation.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Pricing &amp; Availability
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              Prices for loose lab-grown diamonds and precious metals are subject to market adjustments.
              Once an order is confirmed and deposit received, pricing is locked.
            </p>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
