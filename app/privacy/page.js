import SitePage from '../../components/SitePage.jsx';

export const metadata = {
  title: 'Privacy Policy – Lab-Grown Diamonds | Caritas Luxury',
  description: 'Privacy policy for Caritas Luxury lab-grown diamond clients.',
};

export default function PrivacyPage() {
  return (
    <SitePage
      currentPath="/privacy"
      pageTitle="Privacy Policy"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '90px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Your Data &amp; Security
            </div>
            <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '38px', fontWeight: 700, color: '#0C1315', marginBottom: '20px' }}>
              Privacy Commitment For Lab-Grown Diamonds
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#666' }}>
              At Caritas Luxury, we respect your privacy and are committed to safeguarding personal information
              collected when browsing, inquiring, or purchasing lab-grown diamonds.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Information We Collect
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              We collect details you provide when contacting our gemologists, requesting custom lab-grown diamond
              design previews, or completing orders (such as name, email, delivery address, and payment information).
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Payment &amp; Encryption Standards
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              All financial transactions involving lab-grown diamonds are processed through encrypted, PCI-DSS compliant
              payment gateways. We do not store complete cardholder numbers on our servers.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '20px', fontWeight: 700, color: '#0C1315', marginBottom: '10px' }}>
              Your Rights
            </h4>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>
              You may request access to, correction of, or deletion of your personal data at any time by
              contacting privacy@caritas-luxury.com.
            </p>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
