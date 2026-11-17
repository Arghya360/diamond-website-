import React from 'react';

export default function AboutTestimonialSection() {
  return (
    <section
      className="about-testimonial-section"
      style={{
        backgroundColor: '#ffffff',
        padding: '110px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ marginBottom: '50px' }}>
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
            Testimonial
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
            A More Personal Way to Discover Diamonds
          </h2>
        </div>

        {/* Testimonial Content Row */}
        <div className="row align-items-center">
          {/* Left Column: Star Rating & Diamond Sketch */}
          <div className="col-lg-4 col-md-5 mb-5 mb-md-0">
            <div style={{ position: 'relative' }}>
              {/* Star Rating */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  color: '#F8B84E',
                  fontSize: '20px',
                  marginBottom: '14px'
                }}
              >
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0C1315',
                  marginBottom: '6px'
                }}
              >
                Diamond Enquiries Welcome
              </h4>

              <p
                style={{
                  fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                  fontSize: '14px',
                  color: '#777777',
                  marginBottom: '24px'
                }}
              >
                Our team is here to help you discover the perfect stone.
              </p>

              {/* Floating Diamond Outline Sketch */}
              <div
                style={{
                  width: '130px',
                  opacity: 0.8,
                  marginTop: '10px'
                }}
              >
                <img
                  src="/wp-content/uploads/about page/h3-testimonial-img-001.png"
                  alt="Diamond Outline"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Reviewer Card & Quote */}
          <div className="col-lg-8 col-md-7">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '35px',
                flexWrap: 'wrap'
              }}
            >
              {/* Reviewer Image */}
              <div
                style={{
                  width: '190px',
                  flexShrink: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                }}
              >
                <img
                  src="/wp-content/uploads/about page/h3-testimonial-001.jpg"
                  alt="Alan Turner"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Review Text Block */}
              <div style={{ flex: '1 1 300px' }}>
                {/* Quote Circle Icon */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#F9F7F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color, #BFA37C)',
                    fontSize: '24px',
                    fontFamily: 'Georgia, serif',
                    marginBottom: '16px'
                  }}
                >
                  “
                </div>

                <p
                  style={{
                    fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#555555',
                    fontStyle: 'italic',
                    marginBottom: '22px'
                  }}
                >
                  &ldquo;Every stone at Caritas is chosen for its exceptional beauty. Whether you are drawn to the warmth of a classic white diamond or the extraordinary allure of pink, we are here to help you find exactly what you are looking for.&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h5
                    style={{
                      fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#0C1315',
                      margin: 0
                    }}
                  >
                    Alan Turner
                  </h5>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--primary-color, #BFA37C)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    — Diamond Researcher
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

