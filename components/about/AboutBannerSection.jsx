import React from 'react';

export default function AboutBannerSection() {
  return (
    <section
      className="about-banner-image-section"
      style={{
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0
      }}
    >
      <img
        src="/wp-content/uploads/about page/inner-about-image-001-1536x542.jpg"
        alt="Jeweler inspecting diamond"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '540px',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </section>
  );
}

