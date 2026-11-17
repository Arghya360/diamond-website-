import React from 'react';

export default function AboutBushSection() {
  const points = [
    'Pink Lab-Grown Diamonds',
    'White Lab-Grown Diamonds',
    'Bespoke Jewellery Design'
  ];

  return (
    <section
      className="about-bush-section"
      style={{
        padding: '110px 0',
        backgroundColor: '#ffffff'
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          {/* Left Column: Content */}
          <div className="col-lg-6 col-md-12 mb-5 mb-lg-0">
            <div style={{ maxWidth: '540px' }}>
              <div
                style={{
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--primary-color, #BFA37C)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                  display: 'inline-block'
                }}
              >
                About Caritas
              </div>

              <h2
                style={{
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  fontSize: '44px',
                  fontWeight: 700,
                  lineHeight: '1.25',
                  color: '#0C1315',
                  marginBottom: '22px'
                }}
              >
                The Art of Making It Yours
              </h2>

              <p
                style={{
                  fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: '#666666',
                  marginBottom: '32px'
                }}
              >
                At Caritas, we create bespoke jewellery with lab-grown diamonds, from classic white to our signature pink. Growing our diamonds in a laboratory avoids the need to mine for them, sparing land and wildlife habitats the direct disturbance of diamond extraction. From choosing your stone to refining the setting, we help you create a piece that is entirely yours.
              </p>

              {/* Numbered List */}
              <div style={{ marginBottom: '36px' }}>
                {points.map((point) => (
                  <div
                    key={point}
                    style={{
                      fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#0C1315',
                      padding: '14px 0',
                      borderBottom: '1px solid #ebebeb',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {point}
                  </div>
                ))}
              </div>

              {/* Caritas Brand Statement */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '24px',
                  paddingTop: '10px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: '#666666',
                    fontStyle: 'italic'
                  }}
                >
                  &ldquo;Lab-grown diamonds. No diamond mining.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Overlapping Images */}
          <div className="col-lg-6 col-md-12">
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                margin: '0 auto',
                minHeight: '440px'
              }}
            >
              {/* Top Image */}
              <div
                style={{
                  width: '74%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}
              >
                <img
                  src="/wp-content/uploads/about page/inner-about-001.jpg"
                  alt="Jewelry crafting"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Bottom Overlapping Image */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '0',
                  width: '72%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '8px solid #ffffff',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.14)'
                }}
              >
                <img
                  src="/wp-content/uploads/about page/inner-about-002.jpg"
                  alt="Diamond inspection"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

