'use client';
import { createElement, Fragment, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ─────────────────────────────────────────────────────────────────
// Menu structure – edit labels / hrefs here only
// ─────────────────────────────────────────────────────────────────
const MENU = [
  { id: 'mi-home',     label: 'Home',             href: '/',                   hasChildren: false, children: null },
  {
    id: 'mi-diamonds', label: 'Diamonds',          href: '/diamonds',           hasChildren: true,
    children: [
      { id: 'mi-all-diamonds',   label: 'All Diamonds',     href: '/diamonds' },
      { id: 'mi-pink-diamonds',  label: 'Pink Diamonds',    href: '/diamonds/pink' },
      { id: 'mi-white-diamonds', label: 'White Diamonds',   href: '/diamonds/white' },
      { id: 'mi-cyo',            label: 'Create Your Own',  href: '/create-your-own' },
    ],
  },
  { id: 'mi-shop',     label: 'Shop',             href: '/shop',               hasChildren: false, children: null },
  {
    id: 'mi-wlg',      label: 'Why Lab Grown',     href: '/why-lab-grown',      hasChildren: true,
    children: [
      { id: 'mi-wlg-overview', label: 'Why Lab Grown',  href: '/why-lab-grown' },
      { id: 'mi-wlg-guide',    label: 'Diamond Guide',  href: '/diamond-guide' },
      { id: 'mi-wlg-sourcing', label: 'Sourcing',       href: '/sourcing' },
    ],
  },
  { id: 'mi-about',    label: 'About Caritas',    href: '/about-us',           hasChildren: false, children: null },
  { id: 'mi-contact',  label: 'Contact',           href: '/contact',            hasChildren: false, children: null },
];

function isActive(item, currentPath) {
  if (item.href === currentPath) return true;
  if (item.children) {
    return item.children.some((c) => c.href === currentPath);
  }
  if (item.href !== '/' && item.href !== '#' && currentPath.startsWith(item.href)) {
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────
// Desktop sub-menu
// ─────────────────────────────────────────────────────────────────
function SubMenu({ items, parentId, currentPath }) {
  return (
    <ul
      className="mega-sub-menu"
      id={`mega-sub-menu-${parentId}`}
    >
      {items.map((item) => {
        const isCurrent = item.href === currentPath;
        return (
          <li
            key={item.id}
            id={item.id}
            className={`mega-menu-item mega-menu-item-type-post_type mega-menu-item-object-page${
              isCurrent ? ' mega-current-menu-item mega-current_page_item' : ''
            }`}
          >
            <a
              className="mega-menu-link"
              href={item.href}
              style={{
                color: '#ffffff',
                backgroundColor: isCurrent ? 'var(--primary-color, #BFA37C)' : 'transparent',
                fontWeight: isCurrent ? 700 : 500,
                borderRadius: '4px',
              }}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────────
// Desktop / full navigation (ul#mega-menu-primary)
// ─────────────────────────────────────────────────────────────────
function DesktopMenu({ currentPath }) {
  return (
    <ul
      id="mega-menu-primary"
      className="mega-menu max-mega-menu mega-menu-horizontal mega-no-js"
      data-event="hover_intent"
      data-effect="fade_up"
      data-effect-speed="200"
      data-effect-mobile="disabled"
      data-effect-speed-mobile="0"
      data-mobile-force-width="false"
      data-second-click="go"
      data-document-click="collapse"
      data-vertical-behaviour="standard"
      data-breakpoint="1024"
      data-unbind="true"
    >
      {MENU.map((item) => {
        const active = isActive(item, currentPath);

        let liClass = 'mega-menu-item mega-menu-item-type-custom mega-menu-item-object-custom';
        if (item.hasChildren) liClass += ' mega-menu-item-has-children mega-align-bottom-left mega-menu-flyout mega-dropdown';
        if (active && !item.hasChildren) liClass += ' mega-current-menu-item mega-current_page_item';
        if (active && item.hasChildren) liClass += ' mega-current-menu-ancestor mega-current-menu-parent';

        return (
          <li key={item.id} id={item.id} className={liClass}>
            <a
              className="mega-menu-link"
              href={item.href}
              style={{
                color: '#ffffff',
                backgroundColor: 'transparent',
                fontWeight: active ? 700 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative',
                zIndex: 2,
                padding: '0 15px',
              }}
              {...(item.hasChildren ? {
                'aria-haspopup': 'true',
                'aria-expanded': 'false',
                'aria-controls': `mega-sub-menu-${item.id}`,
              } : {})}
            >
              <span style={{ color: '#ffffff', position: 'relative', zIndex: 3 }}>
                {item.label}
                {item.id === 'mi-about' && <span style={{ display: 'none' }}>About Us</span>}
              </span>
              {item.hasChildren && (
                <span className="mega-indicator" aria-hidden="true" style={{ color: '#ffffff', position: 'relative', zIndex: 3 }} />
              )}
            </a>
            {item.hasChildren && (
              <SubMenu items={item.children} parentId={item.id} currentPath={currentPath} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────────
// Mobile accordion sub-list
// ─────────────────────────────────────────────────────────────────
function MobileSubList({ items, open, currentPath, onNavigate }) {
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: '0 0 0 16px',
        margin: '4px 0 8px 16px',
        display: open ? 'block' : 'none',
        borderLeft: '2px solid var(--primary-color, #BFA37C)',
      }}
    >
      {items.map((item) => {
        const isChildActive = item.href === currentPath;
        return (
          <li key={item.id}>
            <a
              href={item.href}
              onClick={onNavigate}
              style={{
                display: 'block',
                padding: '10px 16px',
                margin: '4px 0',
                backgroundColor: isChildActive ? 'var(--primary-color, #BFA37C)' : 'transparent',
                color: '#ffffff',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isChildActive ? 700 : 500,
              }}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────────
// Mobile off-canvas drawer (portaled to document.body)
// ─────────────────────────────────────────────────────────────────
function MobileMenu({ open, onClose, currentPath }) {
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      id="custom-mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        height: '100dvh',
        zIndex: 2147483647,
        backgroundColor: '#0C1315',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingTop: 'max(20px, env(safe-area-inset-top, 20px))',
        paddingBottom: 'max(28px, env(safe-area-inset-bottom, 28px))',
        paddingLeft: 'max(16px, env(safe-area-inset-left, 16px))',
        paddingRight: 'max(16px, env(safe-area-inset-right, 16px))',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header Bar inside Drawer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0,
        }}
      >
        <a href="/" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img
            src="/wp-content/uploads/2024/03/logo-white.png"
            alt="Caritas Luxury"
            style={{ height: '34px', width: 'auto' }}
          />
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '22px',
            lineHeight: 1,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>

      {/* Menu items list */}
      <ul style={{ listStyle: 'none', padding: '16px 0', margin: 0, flex: '1 0 auto' }}>
        {MENU.map((item) => {
          const active = isActive(item, currentPath);
          const isOpen = openDropdown === item.id;

          return (
            <li key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.hasChildren) {
                      e.preventDefault();
                      setOpenDropdown(isOpen ? null : item.id);
                    } else {
                      onClose();
                    }
                  }}
                  style={{
                    flex: 1,
                    display: 'block',
                    padding: '12px 14px',
                    backgroundColor: active ? 'var(--primary-color, #BFA37C)' : 'transparent',
                    color: '#ffffff',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '17px',
                    fontWeight: active ? 700 : 500,
                    fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  }}
                >
                  {item.label}
                  {item.id === 'mi-about' && (
                    <span style={{ display: 'none' }}>About Us</span>
                  )}
                </a>
                {item.hasChildren && (
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${item.label} sub-menu`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '24px',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isOpen ? '−' : '+'}
                  </button>
                )}
              </div>
              {item.hasChildren && (
                <MobileSubList
                  items={item.children}
                  open={isOpen}
                  currentPath={currentPath}
                  onNavigate={onClose}
                />
              )}
            </li>
          );
        })}
      </ul>

      {/* Get In Touch CTA at bottom */}
      <div style={{ padding: '20px 8px 16px', marginTop: 'auto', flexShrink: 0 }}>
        <a
          href="/contact"
          onClick={onClose}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '14px 20px',
            backgroundColor: 'var(--primary-color, #BFA37C)',
            color: '#ffffff',
            borderRadius: '8px',
            fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textDecoration: 'none',
          }}
        >
          Get In Touch
        </a>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Navigation component
// ─────────────────────────────────────────────────────────────────
export default function Navigation({ currentPath = '/' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleToggleClick = (e) => {
      const toggle = e.target.closest('.menu-toggle, .pt-toggle-btn');
      if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        setMobileOpen(true);
      }
    };
    document.addEventListener('click', handleToggleClick);
    return () => document.removeEventListener('click', handleToggleClick);
  }, []);

  return (
    <div id="mega-menu-wrap-primary" className="mega-menu-wrap">
      <style>{`
        /* Desktop dropdown styling and animation */
        @media (min-width: 1024px) {
          #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item-has-children {
            position: relative;
          }
          #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item-has-children > ul.mega-sub-menu {
            display: none !important;
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            min-width: 220px !important;
            background-color: #0C1315 !important;
            padding: 12px 8px !important;
            margin: 0 !important;
            border-radius: 6px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35) !important;
            z-index: 99999 !important;
            list-style: none !important;
          }
          #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item-has-children:hover > ul.mega-sub-menu,
          #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item-has-children:focus-within > ul.mega-sub-menu {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          #mega-menu-wrap-primary #mega-menu-primary ul.mega-sub-menu > li.mega-menu-item {
            display: block !important;
            width: 100% !important;
            margin-bottom: 4px !important;
          }
          #mega-menu-wrap-primary #mega-menu-primary ul.mega-sub-menu > li.mega-menu-item > a.mega-menu-link {
            display: block !important;
            padding: 10px 18px !important;
            color: #ffffff !important;
            font-size: 14px !important;
            text-decoration: none !important;
            white-space: nowrap !important;
            border-radius: 4px !important;
            transition: all 0.2s ease !important;
          }
          #mega-menu-wrap-primary #mega-menu-primary ul.mega-sub-menu > li.mega-menu-item > a.mega-menu-link:hover,
          #mega-menu-wrap-primary #mega-menu-primary ul.mega-sub-menu > li.mega-current-menu-item > a.mega-menu-link {
            background-color: var(--primary-color, #BFA37C) !important;
            color: #ffffff !important;
            font-weight: 700 !important;
          }
        }

        /* Top-level menu links – always white text so it is 100% visible inside the #BEA37C box */
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:hover,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:focus,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:active,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item.mega-current-menu-item > a.mega-menu-link,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item.mega-current-menu-ancestor > a.mega-menu-link,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item.mega-current-page-ancestor > a.mega-menu-link {
          color: #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
          text-decoration: none !important;
          position: relative !important;
          z-index: 2 !important;
        }

        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link *,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:hover *,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:focus *,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:active *,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item.mega-current-menu-item > a.mega-menu-link *,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item.mega-current-menu-ancestor > a.mega-menu-link * {
          color: #ffffff !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Ensure top-level a.mega-menu-link has transparent background so ONLY the 40px :before pill is visible */
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:hover,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:focus,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:active,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-current-menu-item > a.mega-menu-link,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-current-menu-ancestor > a.mega-menu-link,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-current-page-ancestor > a.mega-menu-link {
          background: transparent !important;
          background-color: transparent !important;
          border-radius: 0 !important;
        }

        /* The #BEA37C pill box is strictly rendered by :before so its size is 100% identical on hover and selected page */
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:before {
          content: "" !important;
          position: absolute !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          height: 40px !important;
          border-radius: 6px !important;
          background: var(--primary-color, #BFA37C) !important;
          z-index: 1 !important;
          transition: width 0.25s ease, left 0.25s ease, opacity 0.25s ease !important;
        }

        /* Inactive items: box collapsed */
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item:not(.mega-current-menu-item):not(.mega-current-menu-ancestor):not(.mega-current-page-ancestor) > a.mega-menu-link:not(:hover):before {
          width: 0 !important;
          left: 50% !important;
          opacity: 0 !important;
        }

        /* Hovered or selected/active: exact same 40px pill size */
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-menu-item > a.mega-menu-link:hover:before,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-current-menu-item > a.mega-menu-link:before,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-current-menu-ancestor > a.mega-menu-link:before,
        #mega-menu-wrap-primary #mega-menu-primary > li.mega-current-page-ancestor > a.mega-menu-link:before {
          width: 100% !important;
          left: 0 !important;
          height: 40px !important;
          opacity: 1 !important;
        }

        /* Mobile vs Desktop Display Rules */
        @media (max-width: 1023px) {
          /* Strictly hide desktop horizontal menu on mobile so it cannot conflict with mobile drawer */
          #mega-menu-wrap-primary #mega-menu-primary {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            background: transparent !important;
          }
          #mega-menu-wrap-primary .mega-menu-toggle {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            background: transparent !important;
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 8px !important;
            z-index: 100 !important;
          }
          #mega-menu-wrap-primary .mega-menu-toggle:after,
          #mega-menu-wrap-primary .mega-menu-toggle.mega-menu-open:after {
            display: none !important;
            content: none !important;
          }
          #mega-menu-wrap-primary .mega-menu-toggle .mega-toggle-animated-box {
            width: 30px !important;
            height: 22px !important;
            display: inline-block !important;
            position: relative !important;
          }
          #mega-menu-wrap-primary .mega-menu-toggle .mega-toggle-animated-inner,
          #mega-menu-wrap-primary .mega-menu-toggle .mega-toggle-animated-inner::before,
          #mega-menu-wrap-primary .mega-menu-toggle .mega-toggle-animated-inner::after {
            display: block !important;
            width: 30px !important;
            height: 3px !important;
            background-color: #ffffff !important;
            border-radius: 2px !important;
            position: absolute !important;
            left: 0 !important;
          }
          #mega-menu-wrap-primary .mega-menu-toggle .mega-toggle-animated-inner {
            top: 50% !important;
            transform: translateY(-50%) !important;
          }
          #mega-menu-wrap-primary .mega-menu-toggle .mega-toggle-animated-inner::before {
            content: "" !important;
            top: -8px !important;
          }
          #mega-menu-wrap-primary .mega-menu-toggle .mega-toggle-animated-inner::after {
            content: "" !important;
            top: 8px !important;
          }
        }
        @media (min-width: 1024px) {
          #mega-menu-wrap-primary .mega-menu-toggle {
            display: none !important;
          }
          #mega-menu-wrap-primary #mega-menu-primary {
            display: flex !important;
          }
        }
      `}</style>

      {/* Mobile toggle bar (shown via CSS at <1024 px) */}
      <div
        className="mega-menu-toggle"
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMobileOpen(true);
        }}
      >
        <div className="mega-toggle-blocks-left" />
        <div className="mega-toggle-blocks-center" />
        <div className="mega-toggle-blocks-right">
          <div
            className="mega-toggle-block mega-menu-toggle-animated-block mega-toggle-block-0"
            id="mega-toggle-block-0"
          >
            <button
              className="mega-toggle-animated mega-toggle-animated-slider"
              type="button"
              aria-controls="mega-menu-primary"
              aria-expanded={mobileOpen}
              aria-haspopup="true"
              aria-label="Toggle Menu"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileOpen(true);
              }}
            >
              <span className="mega-toggle-animated-box">
                <span className="mega-toggle-animated-inner" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop horizontal menu */}
      <DesktopMenu currentPath={currentPath} />

      {/* Mobile drawer portaled to body */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} currentPath={currentPath} />
    </div>
  );
}
