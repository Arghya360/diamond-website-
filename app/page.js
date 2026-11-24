import { Fragment } from 'react';
import { domToReact } from 'html-react-parser';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import LegacyScripts from '../components/LegacyScripts.jsx';
import HomeSections from '../components/sections/HomeSections.jsx';
import { getSiteDocument } from '../lib/source-page.js';

function hasClass(node, className) {
  return node.attribs?.class?.split(/\s+/).includes(className);
}

export const metadata = {
  title: 'Caritas Luxury – Lab-Grown Diamonds in Extraordinary Colour',
  description: 'Discover our signature pink lab-grown diamonds, from delicate blush to vivid rose. Choose a stone you love and let Caritas help you make it your own.'
};

export default function HomePage() {
  const site = getSiteDocument();
  const options = {
    replace(node) {
      if (node.type === 'script') {
        return <Fragment />;
      }

      if (node.name === 'div' && (hasClass(node, 'pt-sidebar') || hasClass(node, 'pt-background-overlay'))) {
        return <Fragment />;
      }

      if (node.name === 'div' && node.attribs?.id === 'pt-loading') {
        return (
          <div id="pt-loading" key="pt-loading">
            <div id="pt-loading-center">
              <img src="/images/caritas-logo-dark-preloader.png" alt="loading" />
            </div>
          </div>
        );
      }

      if (node.name === 'header' && node.attribs?.id === 'pt-header') {
        return <Header key="site-header" node={node} currentPath="/" />;
      }

      if (node.name === 'main' && node.attribs?.id === 'main') {
        return <HomeSections key="site-main" node={node} />;
      }

      if (node.name === 'footer' && node.attribs?.id === 'pt-footer') {
        return <Footer key="site-footer" node={node} />;
      }

      if (node.name === 'div' && hasClass(node, 'pt-breadcrumb-style-1')) {
        return domToReact([node]);
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
