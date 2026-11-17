import React from 'react';

export default function AboutBreadcrumb() {
  return (
    <>
      <style>{`
        .pt-breadcrumb-style-1,
        div.pt-breadcrumb-style-1,
        .about-header-breadcrumb {
          display: block !important;
          background-image: url("/wp-content/uploads/2024/03/breadcrumb-1.png") !important;
          background-position: center center !important;
          background-size: cover !important;
          background-repeat: no-repeat !important;
          position: relative !important;
          padding: 130px 0 !important;
        }
      `}</style>
      <div
        className="pt-breadcrumb-style-1 about-header-breadcrumb"
        style={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          padding: '130px 0',
          backgroundColor: '#0C1315',
          backgroundImage: "url('/wp-content/uploads/2024/03/breadcrumb-1.png')",
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background image element to ensure visibility in all browsers */}
        <img
          src="/wp-content/uploads/2024/03/breadcrumb-1.png"
          alt="About Us Banner Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        {/* Subtle Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(12, 19, 21, 0.45)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row">
            <div className="col-12">
              <div className="pt-breadcrumb-title">
                <h1
                  className="title"
                  style={{
                    fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                    fontSize: '56px',
                    lineHeight: '64px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '15px'
                  }}
                >
                  About Caritas
                </h1>
              </div>
              <div className="pt-breadcrumb-container">
                <ol
                  className="breadcrumb"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                    margin: 0,
                    listStyle: 'none'
                  }}
                >
                  <li className="breadcrumb-item" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <a
                      href="/"
                      style={{
                        color: '#ffffff',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '15px',
                        fontWeight: 600
                      }}
                    >
                      <i className="ion-ios-home" style={{ fontSize: '16px' }}></i>
                      <span>Home</span>
                    </a>
                  </li>
                  <li
                    style={{
                      color: '#ffffff',
                      margin: '0 10px',
                      fontSize: '12px'
                    }}
                  >
                    <i className="ion-ios-arrow-forward"></i>
                  </li>
                  <li
                    className="breadcrumb-item active"
                    aria-current="page"
                    style={{
                      color: 'var(--primary-color, #BFA37C)',
                      fontSize: '15px',
                      fontWeight: 600
                    }}
                  >
                    About Caritas
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
