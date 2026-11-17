import SitePage from '../../components/SitePage.jsx';

export const metadata = {
  title: 'Returns & Exchanges – Lab-Grown Diamonds | Caritas Luxury',
  description: 'Returns and exchange information for Caritas Luxury lab-grown diamonds.',
};

export default function ReturnsPage() {
  return (
    <SitePage
      currentPath="/returns"
      pageTitle="Returns & Exchanges"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '90px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Peace Of Mind
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '38px', fontWeight: 700, color: '#0C1315', marginBottom: '20px' }}>
              30-Day Returns On Lab-Grown Diamonds
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#666' }}>
              We want you to be completely captivated by your purchase. If for any reason
              you are not completely satisfied with your certified lab-grown diamonds, we offer a
              straightforward 30-day return and exchange policy.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Return Eligibility
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              Loose lab-grown diamonds and standard settings may be returned within 30 days of receipt in
              unworn, pristine condition with all original laboratory grading certificates and packaging intact.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Complimentary Return Shipping
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              Contact our concierge team to receive a pre-paid, fully insured return shipping label and
              simple packaging instructions for your lab-grown diamonds.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Lifetime Craftsmanship Warranty
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              All Caritas Luxury fine jewellery featuring lab-grown diamonds is crafted to the highest standards of quality and excellence. Contact our team for assistance with care and servicing.
            </p>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
