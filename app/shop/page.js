import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import CrystoHomePage from '../../components/home/CrystoHomePage.jsx';
import { getSiteDocument } from '../../lib/source-page.js';
import { Fragment } from 'react';
import { domToReact } from 'html-react-parser';
import LegacyScripts from '../../components/LegacyScripts.jsx';

export const metadata = {
  title: 'Shop Lab-Grown Diamonds | Caritas Luxury',
  description: 'Browse our collection of lab-grown diamonds and bespoke jewellery at Caritas Luxury.',
};

function hasClass(node, className) {
  return node.attribs?.class?.split(/\s+/).includes(className);
}

export default function ShopPage() {
  const site = getSiteDocument();

  // We only need the header and footer from the parsed source; the main content
  // is replaced entirely by our new CrystoHomePage shop layout.
  const options = {
    replace(node) {
      if (node.type === 'script') return <Fragment />;

      if (node.name === 'div' && (hasClass(node, 'pt-sidebar') || hasClass(node, 'pt-background-overlay'))) {
        return <Fragment />;
      }

      if (node.name === 'header' && node.attribs?.id === 'pt-header') {
        return <Header key="site-header" node={node} currentPath="/shop" />;
      }

      // Replace the original main with our new Shop layout
      if (node.name === 'main' && node.attribs?.id === 'main') {
        return <CrystoHomePage key="shop-main" />;
      }

      if (node.name === 'footer' && node.attribs?.id === 'pt-footer') {
        return <Footer key="site-footer" node={node} />;
      }
    },
  };

  return (
    <>
      {domToReact(site.body.children, options)}
      <LegacyScripts scripts={site.scripts} />
    </>
  );
}
