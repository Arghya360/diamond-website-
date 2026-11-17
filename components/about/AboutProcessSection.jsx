import React from 'react';

function DiamondTitleIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--primary-color, #BFA37C)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '12px' }}
    >
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20" />
      <path d="M10 3l-3 6 5 12 5-12-3-6" />
    </svg>
  );
}

function CertifiedIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--primary-color, #BFA37C)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.4 13.8L18 21l-6-3-6 3 2.6-7.2" />
      <path d="M9 8l2 2 4-4" />
    </svg>
  );
}

function HandcraftedIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--primary-color, #BFA37C)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function SpecialCutIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--primary-color, #BFA37C)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 8.5 12 15 22 8.5 12 2" />
      <polygon points="2 15.5 12 22 22 15.5 12 9 2 15.5" />
    </svg>
  );
}

function RestorationIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--primary-color, #BFA37C)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function AboutProcessSection() {
  return (
    <section
      className="about-process-section"
      style={{
        backgroundColor: '#0C1315',
        padding: '110px 0',
        color: '#ffffff'
      }}
    >
      <div className="container">
        {/* Section Headers */}
        <div className="row mb-5 pb-3">
          <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
            <h3
              style={{
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                margin: 0
              }}
            >
              <DiamondTitleIcon />
              <span>Diamond Selection</span>
            </h3>
          </div>
          <div className="col-lg-6 col-md-12">
            <h3
              style={{
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                margin: 0
              }}
            >
              <DiamondTitleIcon />
              <span>Bespoke Creation</span>
            </h3>
          </div>
        </div>

        {/* 3-Column Content */}
        <div className="row align-items-center">
          {/* Left Column Features */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            {/* Feature 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '50px'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '4px' }}>
                <CertifiedIcon />
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '10px'
                  }}
                >
                  Diamond Brilliance and Durability
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: 'rgba(255, 255, 255, 0.65)',
                    margin: 0
                  }}
                >
                  Lab-grown diamonds share the same hardness, optical fire, and chemical composition as mined diamonds. A 10 on the Mohs scale — the same brilliant durability you expect from fine jewellery.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '4px' }}>
                <HandcraftedIcon />
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '10px'
                  }}
                >
                  More Flexibility in Your Budget
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: 'rgba(255, 255, 255, 0.65)',
                    margin: 0
                  }}
                >
                  Lab-grown diamonds are generally available at a more accessible price point than mined diamonds of comparable quality, giving you greater flexibility to choose the stone you truly love.
                </p>
              </div>
            </div>
          </div>

          {/* Center Column: White Diamond Card */}
          <div className="col-lg-4 col-md-12 mb-4 mb-lg-0 text-center">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '40px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '340px',
                margin: '0 auto',
                minHeight: '360px',
                boxShadow: '0 20px 45px rgba(0,0,0,0.4)'
              }}
            >
              <img
                src="/wp-content/uploads/about page/diamond.png"
                alt="Cut Diamond"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>

          {/* Right Column Features */}
          <div className="col-lg-4 col-md-6">
            {/* Feature 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '50px'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '4px' }}>
                <SpecialCutIcon />
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '10px'
                  }}
                >
                  Specialist in Pink Diamonds
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: 'rgba(255, 255, 255, 0.65)',
                    margin: 0
                  }}
                >
                  Caritas specialises in pink lab-grown diamonds — our signature collection. From delicate blush to vivid rose, each stone is selected for its exceptional colour and brilliance.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '4px' }}>
                <RestorationIcon />
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '10px'
                  }}
                >
                  Personal Consultation Service
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: 'rgba(255, 255, 255, 0.65)',
                    margin: 0
                  }}
                >
                  Every piece begins with a conversation. Our team guides you through diamond selection, setting design, and personalisation — ensuring the final creation is entirely yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

