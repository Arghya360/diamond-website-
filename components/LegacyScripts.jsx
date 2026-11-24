'use client';

import { useEffect, useRef } from 'react';

function appendScript(script) {
  if (script.attribs.type === 'speculationrules') {
    return Promise.resolve();
  }

  const element = document.createElement('script');
  for (const [name, value] of Object.entries(script.attribs)) {
    if (name !== 'src' && name !== 'async' && name !== 'defer') {
      element.setAttribute(name, value);
    }
  }

  if (!script.src) {
    element.textContent = script.code;
    document.body.appendChild(element);
    return Promise.resolve();
  }

  element.async = false;
  const loaded = new Promise((resolve, reject) => {
    element.addEventListener('load', resolve, { once: true });
    element.addEventListener('error', () => {
      reject(new Error(`Failed to load legacy script: ${script.src}`));
    }, { once: true });
  });
  element.src = script.src;
  document.body.appendChild(element);
  return loaded;
}

export default function LegacyScripts({ scripts }) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;

    async function loadScripts() {
      const preloadedIds = new Set(['TweenMax-min-js', 'aat.min-js']);
      const preloadedScripts = scripts.filter((script) => preloadedIds.has(script.id));
      const orderedScripts = scripts.filter((script) => !preloadedIds.has(script.id));
      const themeScriptIndex = orderedScripts.findIndex((script) => script.id === 'gemzie-js');

      if (themeScriptIndex === -1) {
        orderedScripts.push(...preloadedScripts);
      } else {
        orderedScripts.splice(themeScriptIndex, 0, ...preloadedScripts);
      }

      for (const script of orderedScripts) {
        await appendScript(script);
      }

      window.dispatchEvent(new Event('load'));

      // Trigger animation and scroll waypoints to reveal animated elements reliably
      setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('scroll'));
            if (window.jQuery) {
              window.jQuery(window).trigger('resize').trigger('scroll');
              window.jQuery('.elementor-invisible').each(function () {
                const $el = window.jQuery(this);
                const settings = $el.data('settings');
                const anim = (typeof settings === 'object' && settings?._animation) || 'fadeInUp';
                $el.removeClass('elementor-invisible').addClass('animated ' + anim);
              });
            }
          }
        } catch (e) {
          console.warn('Animation trigger fallback:', e);
        }
      }, 500);
    }

    loadScripts().catch((error) => {
      console.error(error);
    });
  }, [scripts]);

  return null;
}
