import SitePage from '../../components/SitePage.jsx';
import ContactInquiryCards from '../../components/contact/ContactInquiryCards.jsx';
import ContactFormTabs from '../../components/contact/ContactFormTabs.jsx';

export const metadata = {
  title: 'Contact Caritas Luxury | Lab-Grown Diamonds',
  description: 'Get in touch with Caritas Luxury for personal lab-grown diamond guidance, bespoke jewellery consultations, and custom ring design.',
};

export default function ContactPage() {
  return (
    <SitePage
      currentPath="/contact"
      pageTitle="Contact Us"
      bgImage="/wp-content/uploads/2024/03/breadcrumb-1.png"
    >
      <section style={{ padding: '70px 0 110px', backgroundColor: '#f5f5f5' }}>
        <div className="container" style={{ maxWidth: '1180px' }}>
          <ContactInquiryCards />
          <div id="contact-tabs-section" style={{ paddingTop: '20px' }}>
            <ContactFormTabs />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
