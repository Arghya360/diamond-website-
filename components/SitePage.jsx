/**
 * SitePage – shared layout for all new content pages.
 * Renders the existing header + footer from homepage.html,
 * replacing the navigation active state and injecting custom content.
 */
import { Fragment } from 'react';
import { domToReact } from 'html-react-parser';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import LegacyScripts from './LegacyScripts.jsx';
import { getSiteDocument } from '../lib/source-page.js';

function hasClass(node, className) {
  return node.attribs?.class?.split(/\s+/).includes(className);
}

/**
 * @param {object} props
 * @param {string}  props.currentPath   – used to highlight active nav item
 * @param {string}  props.pageTitle     – h1 shown in the breadcrumb banner
 * @param {string}  props.bgImage       – URL for breadcrumb background (optional)
 * @param {React.ReactNode} props.children – page body content
 */
export default function SitePage({ currentPath, pageTitle, bgImage, children }) {
  const site = getSiteDocument();

  const options = {
    replace(node) {
      if (node.type === 'script') return <Fragment />;

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
        return <Header key="site-header" node={node} currentPath={currentPath} />;
      }

      // Replace the homepage breadcrumb with a simple banner for inner pages
      if (node.name === 'div' && hasClass(node, 'pt-breadcrumb-style-1')) {
        const imageSrc = bgImage || '/wp-content/uploads/2024/03/breadcrumb-1.png';
        return (
          <>
            <style>{`
              .pt-breadcrumb-style-1,
              div.pt-breadcrumb-style-1 {
                display: block !important;
                background-position: center center !important;
                background-size: cover !important;
                background-repeat: no-repeat !important;
                position: relative !important;
                padding: clamp(70px, 12vw, 130px) 0 !important;
              }
            `}</style>
            <div
              key="site-breadcrumb"
              className="pt-breadcrumb-style-1"
              style={{
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                padding: 'clamp(70px, 12vw, 130px) 0',
                backgroundColor: '#0C1315',
                backgroundImage: `url('${imageSrc}')`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <img
                src={imageSrc}
                alt={pageTitle}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(12,19,21,0.5)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
              <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row">
                  <div className="col-12">
                    <div className="pt-breadcrumb-title">
                      <h1
                        style={{
                          fontFamily: 'var(--title-fonts,"Readex Pro",sans-serif)',
                          fontSize: 'clamp(28px, 6vw, 56px)',
                          lineHeight: '1.2',
                          fontWeight: 700,
                          color: '#ffffff',
                          marginBottom: '15px',
                        }}
                      >
                        {pageTitle}
                      </h1>
                    </div>
                    <div className="pt-breadcrumb-container">
                      <ol
                        className="breadcrumb"
                        style={{ display: 'flex', alignItems: 'center', padding: 0, margin: 0, listStyle: 'none' }}
                      >
                        <li className="breadcrumb-item" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>
                            <i className="ion-ios-home" style={{ marginRight: '6px' }} />
                            Home
                          </a>
                        </li>
                        <li style={{ color: '#fff', margin: '0 10px', fontSize: '12px' }}>
                          <i className="ion-ios-arrow-forward" />
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                          style={{ color: 'var(--primary-color,#BFA37C)', fontSize: '15px', fontWeight: 600 }}
                        >
                          {pageTitle}
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }

      // Replace main content area with custom children
      if (node.name === 'main' && node.attribs?.id === 'main') {
        return (
          <main key="site-main" id="main" className="site-main">
            {children}
          </main>
        );
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

