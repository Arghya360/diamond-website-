import { createElement, Fragment } from 'react';
import { attributesToProps, domToReact } from 'html-react-parser';
import Navigation from './Navigation.jsx';

export default function Header({ node, currentPath = '/' }) {
  const options = {
    replace(child) {
      if (child.type === 'script') {
        return createElement(Fragment);
      }

      // Replace the mega-menu div with our new Navigation
      if (child.attribs?.id === 'mega-menu-wrap-primary') {
        return <Navigation currentPath={currentPath} />;
      }

      // Insert "Get In Touch" button right before the hamburger menu toggle button
      if (child.name === 'li' && child.attribs?.class?.includes('pt-toggle-btn')) {
        return (
          <>
            <li
              className="pt-header-btn-item"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginRight: '15px',
                listStyle: 'none',
              }}
            >
              <a
                href="/contact"
                className="pt-btn pt-btn-style-1"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '9px 20px',
                  backgroundColor: 'var(--primary-color, #BFA37C)',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Get In Touch
              </a>
            </li>
            {createElement(
              child.name,
              attributesToProps(child.attribs ?? {}),
              domToReact(child.children ?? [], options)
            )}
          </>
        );
      }

      // Update logo image to caritas-logo-white.png
      if (child.name === 'img' && (child.attribs?.class?.includes('logo') || child.attribs?.src?.includes('logo'))) {
        return (
          <img
            {...attributesToProps(child.attribs ?? {})}
            src="/wp-content/uploads/caritas-logo-white.png"
            alt="Caritas"
            style={{
              maxHeight: '48px',
              width: 'auto',
              objectFit: 'contain',
              display: 'inline-block',
            }}
          />
        );
      }

      // Rewrite brand/logo link
      if (child.name === 'a' && child.attribs?.class?.includes('navbar-brand')) {
        child.attribs.href = '/';
      }
    }
  };

  return createElement(
    node.name,
    attributesToProps(node.attribs ?? {}),
    domToReact(node.children ?? [], options)
  );
}
