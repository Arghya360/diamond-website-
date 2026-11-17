import { Fragment } from 'react';
import { domToReact } from 'html-react-parser';
import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';
import LegacyScripts from '../../components/LegacyScripts.jsx';
import AboutBreadcrumb from '../../components/about/AboutBreadcrumb.jsx';
import AboutBushSection from '../../components/about/AboutBushSection.jsx';
import AboutProcessSection from '../../components/about/AboutProcessSection.jsx';
import AboutServicesSection from '../../components/about/AboutServicesSection.jsx';
import AboutBannerSection from '../../components/about/AboutBannerSection.jsx';
import AboutTestimonialSection from '../../components/about/AboutTestimonialSection.jsx';
import AboutClientsSection from '../../components/about/AboutClientsSection.jsx';
import { getSiteDocument } from '../../lib/source-page.js';

function hasClass(node, className) {
  return node.attribs?.class?.split(/\s+/).includes(className);
}

export const metadata = {
  title: 'About Caritas – Lab-Grown Diamonds | Caritas Luxury',
  description: 'Learn about Caritas Luxury — a premium lab-grown diamond brand specialising in pink and white lab-grown diamonds and bespoke jewellery.'
};

export default function AboutPage() {
  const site = getSiteDocument();
  const options = {
    replace(node) {
      if (node.type === 'script') {
        return <Fragment />;
      }

      if (node.name === 'header' && node.attribs?.id === 'pt-header') {
        return <Header key="site-header" node={node} currentPath="/about-us" />;
      }

      if (node.name === 'div' && hasClass(node, 'pt-breadcrumb-style-1')) {
        return <AboutBreadcrumb key="site-breadcrumb" />;
      }

      if (node.name === 'main' && node.attribs?.id === 'main') {
        return (
          <main key="site-main" id="main" className="site-main">
            <AboutBushSection />
            <AboutProcessSection />
            <AboutServicesSection />
            <AboutBannerSection />
            <AboutTestimonialSection />
            <AboutClientsSection />
          </main>
        );
      }

      if (node.name === 'footer' && node.attribs?.id === 'pt-footer') {
        return <Footer key="site-footer" node={node} />;
      }
    }
  };

  return (
    <>
      {domToReact(site.body.children, options)}
      <LegacyScripts scripts={site.scripts} />
    </>
  );
}
