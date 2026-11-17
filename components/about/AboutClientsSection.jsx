import React from 'react';

export default function AboutClientsSection() {
  const clients = [
    {
      normal: '/wp-content/uploads/2024/02/h1-client-logo-001.png',
      hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-001.png',
      alt: 'Client 1'
    },
    {
      normal: '/wp-content/uploads/2024/02/h1-client-logo-002.png',
      hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-002.png',
      alt: 'Client 2'
    },
    {
      normal: '/wp-content/uploads/2024/02/h1-client-logo-003.png',
      hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-003.png',
      alt: 'Client 3'
    },
    {
      normal: '/wp-content/uploads/2024/02/h1-client-logo-004.png',
      hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-004.png',
      alt: 'Client 4'
    },
    {
      normal: '/wp-content/uploads/2024/02/h1-client-logo-005.png',
      hover: '/wp-content/uploads/2024/02/h1-client-hover-logo-005.png',
      alt: 'Client 5'
    }
  ];

  return (
    <section
      className="about-clients-section"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #eeeeee',
        padding: '50px 0'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '30px'
          }}
        >
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="client-logo-item"
              style={{
                flex: '1 1 140px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.85,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            >
              <img
                src={client.normal}
                alt={client.alt}
                style={{
                  maxHeight: '48px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

