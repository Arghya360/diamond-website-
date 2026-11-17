import SitePage from '../../components/SitePage.jsx';

export const metadata = {
  title: 'Create Your Own Lab-Grown Diamond Ring | Caritas Luxury',
  description: 'Design a bespoke ring with Caritas Luxury. Choose your lab-grown diamond, select a setting, and personalise every detail.',
};

export default function CreateYourOwnPage() {
  return (
    <SitePage
      currentPath="/create-your-own"
      pageTitle="Create Your Own"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color,#BFA37C)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
                Bespoke Ring Design
              </div>
              <h2 style={{ fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)', fontSize: '42px', fontWeight: 700, color: '#0C1315', marginBottom: '22px', lineHeight: 1.2 }}>
                Design a Ring That&apos;s Uniquely Yours
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#666', marginBottom: '20px' }}>
                Create a bespoke ring with Caritas. Choose your lab-grown diamond — from our signature pink to timeless white — select a setting, and personalise every detail to bring your jewellery vision to life.
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', fontSize: '15px', lineHeight: 2 }}>
                <li>Choose your lab-grown diamond (shape, carat, colour)</li>
                <li>Select your setting style and precious metal</li>
                <li>Add personal details or engravings</li>
                <li>Review your design with our bespoke specialists</li>
              </ul>
              <a
                href="/contact"
                style={{
                  display: 'inline-block', marginTop: '30px',
                  padding: '14px 32px',
                  backgroundColor: 'var(--primary-color,#BFA37C)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Request a Consultation
              </a>
            </div>
            <div className="col-lg-6">
              <img
                src="/wp-content/uploads/2024/02/h1-about-003-e1708677916244.jpg"
                alt="Custom lab-grown diamond ring designer"
                style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

