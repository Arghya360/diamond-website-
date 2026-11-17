import SitePage from '../../components/SitePage.jsx';

export const metadata = {
  title: 'Delivery Information – Lab-Grown Diamonds | Caritas Luxury',
  description: 'Delivery and dispatch information for Caritas Luxury lab-grown diamond orders.',
};

export default function DeliveryPage() {
  return (
    <SitePage
      currentPath="/delivery"
      pageTitle="Delivery & Shipping"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '90px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Shipping Policy
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '38px', fontWeight: 700, color: '#0C1315', marginBottom: '20px' }}>
              Insured Delivery For Lab-Grown Diamonds
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#666' }}>
              We understand the value and emotional significance of your jewellery.
              Every lab-grown diamond order is fully insured and delivered with discreet,
              tamper-proof luxury packaging.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Complimentary Insured Shipping
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              All domestic and international orders containing lab-grown diamonds receive complimentary
              expedited, fully insured courier shipping with signature confirmation upon delivery.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Delivery &amp; Lead Times
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              We aim to dispatch orders promptly once confirmed. For bespoke pieces and custom ring settings, lead times vary depending on design complexity — please contact us for specific timing.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Discreet &amp; Secure Packaging
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              To ensure complete security and surprise, the outer parcel contains no indication of jewellery
              or diamonds. Inside, your lab-grown diamonds arrive securely housed in a premium presentation box
              alongside their official grading certificates.
            </p>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
