import { createElement, Fragment } from 'react';
import { attributesToProps, domToReact } from 'html-react-parser';

function preserveSection(name) {
  const SourceSection = ({ children, ...attributes }) => (
    <div {...attributes}>{children}</div>
  );

  SourceSection.displayName = name;
  return SourceSection;
}

const HeroSection = preserveSection('HeroSection');
const AboutSection = preserveSection('AboutSection');
const ServicesSection = preserveSection('ServicesSection');
const DiamondProcessSection = preserveSection('DiamondProcessSection');
const MissionVisionSection = preserveSection('MissionVisionSection');
const DiamondShapesSection = preserveSection('DiamondShapesSection');
const VideoSection = preserveSection('VideoSection');
const TestimonialsSection = preserveSection('TestimonialsSection');
const GlobalMapSection = preserveSection('GlobalMapSection');
const ExportSection = preserveSection('ExportSection');

const sectionsById = {
  de7f16b: HeroSection,
  '7a7ef852': AboutSection,
  '20a4eb5b': ServicesSection,
  '50439bab': DiamondProcessSection,
  '4905cdaa': MissionVisionSection,
  '52811002': DiamondShapesSection,
  '0eab0b1': VideoSection,
  '45a4f24f': TestimonialsSection,
  '163161b3': GlobalMapSection,
  '20ffff34': ExportSection
};

function isElementorSection(node) {
  return node.type === 'tag'
    && node.name === 'div'
    && node.attribs?.class?.split(/\s+/).includes('elementor-top-section');
}

export default function HomeSections({ node }) {
  const options = {
    replace(child) {
      if (child.type === 'script') {
        return createElement(Fragment);
      }

      // Remove fake founder / CEO block ("Alex Jhon Martin, Chair Man CEO") from home page
      if (child.attribs?.['data-id'] === 'd60f2d0') {
        return createElement(Fragment);
      }

      if (child.type === 'tag' && child.name === 'img' && child.attribs?.fetchpriority) {
        const props = attributesToProps(child.attribs);
        props.fetchPriority = props.fetchpriority;
        delete props.fetchpriority;
        return createElement('img', props);
      }

      // Ensure all anchor links stay within the website and never link out to gemzie.peacefulqode.in
      if (child.type === 'tag' && child.name === 'a' && child.attribs?.href) {
        const href = child.attribs.href;
        if (href.includes('gemzie.peacefulqode.in') || href.includes('peacefulqode')) {
          let newHref = '/diamonds';
          try {
            const parsed = new URL(href, 'https://gemzie.peacefulqode.in');
            const path = parsed.pathname.replace(/^\/+|\/+$/g, '');
            if (!path || path.startsWith('home')) {
              newHref = '/';
            } else if (path.includes('about') || path.includes('story') || path.includes('team')) {
              newHref = '/about-us';
            } else if (path.includes('contact')) {
              newHref = '/contact';
            } else if (path.includes('process') || path.includes('sourcing')) {
              newHref = '/why-lab-grown/sourcing';
            } else if (path.includes('guide') || path.includes('faq')) {
              newHref = '/why-lab-grown/diamond-guide';
            } else if (path.includes('why-lab-grown')) {
              newHref = '/why-lab-grown';
            } else if (path.includes('create-your-own')) {
              newHref = '/create-your-own';
            } else {
              newHref = '/diamonds';
            }
          } catch {
            newHref = '/diamonds';
          }
          const props = attributesToProps(child.attribs);
          props.href = newHref;
          return createElement('a', props, domToReact(child.children ?? [], options));
        }
      }

      if (!isElementorSection(child)) {
        return;
      }

      const Section = sectionsById[child.attribs?.['data-id']];
      if (!Section) {
        return createElement(
          child.name,
          { ...attributesToProps(child.attribs ?? {}) },
          domToReact(child.children ?? [], options)
        );
      }

      return createElement(
        Section,
        { ...attributesToProps(child.attribs ?? {}) },
        domToReact(child.children ?? [], options)
      );
    }
  };

  return (
    <>
      <style>{`
        /* Hero slider subtle black shadow overlay & text visibility */
        #rev_slider_1_1 rs-slide::before,
        .elementor-element-de7f16b rs-slide::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0.48) 50%, rgba(0, 0, 0, 0.65) 100%) !important;
          z-index: 5 !important;
          pointer-events: none !important;
        }

        #rev_slider_1_1 .rev-slidebg,
        #rev_slider_1_1 rs-sbg,
        #rev_slider_1_1 rs-sbg-wrap,
        #rev_slider_1_1 rs-sbg-wrap img {
          filter: brightness(0.82) contrast(1.05) !important;
        }

        #rev_slider_1_1 rs-layer#slider-1-slide-1-layer-1,
        #rev_slider_1_1 rs-layer#slider-1-slide-20-layer-1,
        #rev_slider_1_1 rs-layer#slider-1-slide-21-layer-1,
        .elementor-element-de7f16b rs-layer[id*="layer-1"] {
          color: #ffffff !important;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0, 0, 0, 0.9) !important;
        }

        #rev_slider_1_1 rs-layer#slider-1-slide-1-layer-0,
        #rev_slider_1_1 rs-layer#slider-1-slide-20-layer-0,
        #rev_slider_1_1 rs-layer#slider-1-slide-21-layer-0,
        .elementor-element-de7f16b rs-layer[id*="layer-0"] {
          color: #d4b88f !important;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8) !important;
        }

        #rev_slider_1_1 a.rev-btn,
        .elementor-element-de7f16b a.rev-btn {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45) !important;
        }
      `}</style>
      {createElement(
        node.name,
        attributesToProps(node.attribs ?? {}),
        domToReact(node.children ?? [], options)
      )}
    </>
  );
}
