import React from 'react';

function WorkerIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FactoryIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M6 20V10l6 4V10l6 4V4h4v16" />
      <path d="M6 14h.01M6 17h.01M18 8h.01M18 12h.01M18 16h.01" />
    </svg>
  );
}

function GlobeClientsIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
    </svg>
  );
}

function MinesIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 10l-4.5 4.5" />
      <path d="M3 21l6-6" />
      <path d="M14 6l4 4" />
      <path d="M16 4l4 4" />
      <path d="M17 3l4 4" />
      <path d="M10 10l-5-5a2 2 0 0 1 0-2.83l.17-.17a2 2 0 0 1 2.83 0l5 5" />
    </svg>
  );
}

function AwardsIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function ExperienceIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CaratIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20" />
    </svg>
  );
}

function RangeIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, #BFA37C)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function AboutServicesSection() {
  const topStats = [
    { icon: <WorkerIcon />, count: 'Pink Diamonds', label: 'Our Signature Collection' },
    { icon: <FactoryIcon />, count: 'White Diamonds', label: 'Timeless Brilliance' },
    { icon: <GlobeClientsIcon />, count: 'Create Your Own', label: 'Bespoke Ring Design' },
    { icon: <MinesIcon />, count: 'Loose Diamonds', label: 'Select Your Own Stone' },
    { icon: <AwardsIcon />, count: 'Consultations', label: 'Personal Guidance' }
  ];

  const bottomStats = [
    { icon: <ExperienceIcon />, count: 'Bespoke', label: 'Custom Jewellery Crafting' },
    { icon: <CaratIcon />, count: 'Lab-Grown', label: 'No Diamond Mining' },
    { icon: <RangeIcon />, count: 'Pink & White', label: 'Complete Collections' }
  ];

  return (
    <section
      className="about-services-section"
      style={{
        backgroundColor: '#ffffff',
        padding: '110px 0 90px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Diamond Watermark on bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-20px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <img
          src="/wp-content/uploads/about page/h3-testimonial-img-001.png"
          alt="Watermark Diamond"
          style={{ width: '220px', height: 'auto' }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Heading */}
        <div style={{ marginBottom: '45px' }}>
          <div
            style={{
              fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--primary-color, #BFA37C)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          >
            Our Collections
          </div>
          <h2
            style={{
              fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              fontSize: '44px',
              fontWeight: 700,
              color: '#0C1315',
              margin: 0
            }}
          >
            What Caritas Offers
          </h2>
        </div>

        {/* Top 5 Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}
        >
          {topStats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#F9F7F4',
                borderRadius: '12px',
                padding: '34px 18px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#0C1315',
                  marginBottom: '6px'
                }}
              >
                {stat.count}
              </div>
              <div
                style={{
                  fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                  fontSize: '13px',
                  color: '#666666'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Middle Banner: The HK Pillars Of Strength */}
        <div
          style={{
            backgroundColor: 'var(--primary-color, #BFA37C)',
            borderRadius: '6px',
            padding: '12px 24px',
            textAlign: 'center',
            margin: '22px 0 24px',
            boxShadow: '0 4px 15px rgba(191, 163, 124, 0.25)'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              fontSize: '17px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.5px'
            }}
          >
            The Caritas Promise
          </span>
        </div>

        {/* Bottom 3 Stat Cards (Centered) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          {bottomStats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#F9F7F4',
                borderRadius: '12px',
                padding: '34px 24px',
                textAlign: 'center',
                flex: '1 1 200px',
                maxWidth: '240px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#0C1315',
                  marginBottom: '6px'
                }}
              >
                {stat.count}
              </div>
              <div
                style={{
                  fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                  fontSize: '13px',
                  color: '#666666'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

