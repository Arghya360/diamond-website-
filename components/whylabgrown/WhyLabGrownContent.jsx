'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TIMELINE_STEPS = [
  {
    year: '2018',
    label: 'Recognition',
    subtitle: '01 / HISTORIC LANDMARK',
    title: 'Official Recognition as Genuine Diamonds',
    description:
      'In 2018, the US Federal Trade Commission (FTC) officially updated its jewellery standards to recognize lab-grown diamonds as real diamonds, acknowledging they possess the exact same crystalline carbon structure, optical properties, and physical hardness as mined stones.',
    img: '/wp-content/uploads/Lab-Grown Diamond/Lab-Grown Diamond 3.webp',
  },
  {
    year: '2020',
    label: 'Plasma Synthesis',
    subtitle: '02 / ADVANCED CVD & HPHT',
    title: 'Breakthrough in Plasma Synthesis & Type IIa Purity',
    description:
      'Pioneering plasma reactors and high-pressure chambers achieved unprecedented atomic synthesis. By replicating Earth’s mantle pressure and 1,000°C+ thermal energy in clean laboratory environments, synthesis unlocked Type IIa chemical purity — a level reached by only 1–2% of natural diamonds.',
    img: '/wp-content/uploads/Lab-Grown Diamond/Lab-Grown Diamond.webp',
  },
  {
    year: '2022',
    label: 'Fancy Diamonds',
    subtitle: '03 / FANCY COLORS & CARAT FREEDOM',
    title: 'Mastering Rare Pink Diamonds & Large Carat Scaling',
    description:
      'Scientific mastery over atomic lattice growth unlocked the creation of rare fancy pink, canary yellow, and blue diamonds alongside flawless multi-carat solitaires — creating extraordinary collector gems grown in controlled laboratory environments.',
    img: '/wp-content/uploads/Lab-Grown Diamond/Lab-Grown Diamond 4.jpg',
  },
  {
    year: '2024',
    label: 'Master Cut',
    subtitle: '04 / ARTISAN POLISHING & 3D LASER',
    title: 'Precision 3D Laser Cutting & Master Faceting',
    description:
      'Every rough diamond is scanned using state-of-the-art 3D tomography to calculate the optimal cut geometry. Skilled diamond artisans then cut and hand-polish each facet to exact mathematical angles, unlocking maximum light reflection, optical fire, and scintillation.',
    img: '/wp-content/uploads/Lab-Grown Diamond/Lab-Grown Diamond 2.webp',
  },
  {
    year: 'Present',
    label: 'Certified Luxury',
    subtitle: '05 / INDEPENDENT GEMOLOGICAL CERTIFICATION',
    title: 'Independently Certified by IGI and GIA',
    description:
      'Today, lab-grown diamonds represent a modern approach to timeless luxury. Grown in laboratories without diamond mining, each stone provides uncompromising quality, brilliance, and enduring beauty.',
    img: '/wp-content/uploads/Lab-Grown Diamond/Lab-Grown Diamond 3.webp',
  },
];

const WHY_CHOOSE_ITEMS = [
  {
    number: '01',
    title: 'Exceptional Beauty',
    description:
      'Enjoy the timeless brilliance, fire, and sparkle of genuine diamonds. Lab-grown diamonds offer the same optical beauty and refraction as their mined counterparts.',
  },
  {
    number: '02',
    title: 'Outstanding Quality',
    description:
      'With a hardness of 10 on the Mohs scale, lab-grown diamonds offer supreme durability and scratch-resistance for everyday fine jewellery and heirloom milestones.',
  },
  {
    number: '03',
    title: 'More Accessible Luxury',
    description:
      'Lab-grown diamonds generally cost less than comparable mined diamonds, allowing you to explore larger stones and beautiful custom settings within your budget.',
  },
  {
    number: '04',
    title: 'Modern Innovation',
    description:
      'Created through pioneering clean technology, every lab-grown diamond represents the remarkable combination of advanced science, precision engineering, and master craftsmanship.',
  },
  {
    number: '05',
    title: 'A Thoughtful Alternative',
    description:
      'Our diamonds are grown in laboratories, avoiding the need to excavate a diamond mine. Bypassing diamond extraction avoids the direct land disturbance associated with traditional mining.',
  },
  {
    number: '06',
    title: 'Endless Possibilities',
    description:
      'From classic solitaires and pink diamond pavé to contemporary statement pieces, lab-grown diamonds give you complete freedom to express your personal style.',
  },
];

const COMPARISON_ROWS = [
  { feature: 'Origin', lab: 'Created in high-tech laboratories', natural: 'Formed naturally underground' },
  { feature: 'Composition', lab: 'Pure crystalline carbon (C)', natural: 'Pure crystalline carbon (C)' },
  { feature: 'Hardness', lab: '10 on the Mohs scale', natural: '10 on the Mohs scale' },
  { feature: 'Brilliance & Fire', lab: 'Same refractive index (2.42)', natural: 'Same refractive index (2.42)' },
  { feature: 'Formation Time', lab: 'Weeks to months', natural: 'Billions of years' },
  { feature: 'Value & Price', lab: 'Generally 50–70% more affordable', natural: 'Generally more expensive' },
];

export default function WhyLabGrownContent() {
  const [activeIdx, setActiveIdx] = useState(3); // default to 2024 (Master Cut & Artisan Polishing)

  const currentStep = TIMELINE_STEPS[activeIdx];
  const gold = 'var(--primary-color, #BFA37C)';

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : TIMELINE_STEPS.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < TIMELINE_STEPS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div style={{ fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)', color: '#333333' }}>
      <style>{`
        /* Checklist items */
        .wlg-check-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 14.5px;
          line-height: 1.6;
          color: #444444;
        }
        .wlg-check-icon {
          color: var(--primary-color, #BFA37C);
          font-weight: 800;
          font-size: 16px;
          line-height: 1.4;
          flex-shrink: 0;
        }

        /* Stats block */
        .wlg-stat-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wlg-stat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--primary-color, #BFA37C);
        }
        .wlg-stat-val {
          font-size: 40px;
          font-weight: 800;
          font-family: var(--title-fonts, "Readex Pro", sans-serif);
          color: #111111;
          line-height: 1;
        }

        /* Interactive Timeline line */
        .timeline-track-wrap {
          position: relative;
          padding: 30px 10px;
          margin-bottom: 36px;
        }
        .timeline-track-line {
          position: absolute;
          top: 50%;
          left: 4%;
          right: 4%;
          height: 2px;
          background: #d8d2c9;
          transform: translateY(-50%);
          z-index: 1;
        }
        .timeline-points-row {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .timeline-point-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 4px;
          transition: transform 0.2s ease;
        }
        .timeline-point-btn:hover {
          transform: translateY(-2px);
        }
        .timeline-point-year {
          font-size: 13px;
          font-weight: 700;
          font-family: var(--title-fonts, "Readex Pro", sans-serif);
          color: #111111;
          transition: color 0.2s ease;
        }
        .timeline-point-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #111111;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 1px #d8d2c9;
          transition: all 0.2s ease;
        }
        .timeline-point-btn.active .timeline-point-year {
          color: var(--primary-color, #BFA37C);
        }
        .timeline-point-btn.active .timeline-point-dot {
          background: var(--primary-color, #BFA37C);
          width: 18px;
          height: 18px;
          box-shadow: 0 0 0 3px rgba(191, 163, 124, 0.28);
        }

        /* Arrows */
        .timeline-nav-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: #BFA37C;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .timeline-nav-btn:hover {
          opacity: 0.9;
          transform: scale(1.05);
        }

        /* 6 Reason Cards */
        .reason-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 36px 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .reason-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.09);
        }
        .reason-num {
          font-size: 14px;
          font-weight: 800;
          color: var(--primary-color, #BFA37C);
          letter-spacing: 1.5px;
          font-family: var(--title-fonts, "Readex Pro", sans-serif);
        }
        .reason-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          color: #111111;
          font-family: var(--title-fonts, "Readex Pro", sans-serif);
        }
        .reason-desc {
          margin: 0;
          font-size: 14px;
          line-height: 1.7;
          color: #666666;
        }

        /* Comparison Table */
        .comp-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .comp-table th {
          background: #111111;
          color: #ffffff;
          padding: 18px 24px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: var(--title-fonts, "Readex Pro", sans-serif);
          text-align: left;
        }
        .comp-table th:first-child {
          background: #1e1e1e;
        }
        .comp-table td {
          padding: 18px 24px;
          font-size: 14.5px;
          border-bottom: 1px solid #f0ede8;
          color: #444444;
        }
        .comp-table tr:last-child td {
          border-bottom: none;
        }
        .comp-table tr:nth-child(even) td {
          background: #faf8f5;
        }
        .comp-table td strong {
          color: #111111;
        }

        @media (max-width: 900px) {
          .wlg-split-row {
            flex-direction: column !important;
          }
          .wlg-images-grid {
            width: 100% !important;
          }
          .timeline-card-split {
            flex-direction: column !important;
          }
          .reasons-grid-3col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: THE BEAUTY OF DIAMONDS, REDEFINED
          (Matches top split-section of reference screenshot)
          ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', padding: '90px 24px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            className="wlg-split-row"
            style={{
              display: 'flex',
              gap: '50px',
              alignItems: 'center',
            }}
          >
            {/* Left Content Column */}
            <div style={{ flex: '1.1', minWidth: 0 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: gold,
                  marginBottom: '10px',
                }}
              >
                ABOUT LAB GROWN
              </div>

              <h2
                style={{
                  margin: '0 0 20px',
                  fontSize: 'clamp(32px, 3.8vw, 46px)',
                  fontWeight: 700,
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  color: '#0C1315',
                  lineHeight: 1.2,
                }}
              >
                The Beauty of Diamonds, Redefined
              </h2>

              <p style={{ fontSize: '15.5px', lineHeight: 1.75, color: '#555555', margin: '0 0 16px' }}>
                At <strong style={{ color: '#111111' }}>Caritas Luxury</strong>, we believe that true luxury is about more than brilliance — it’s about making thoughtful choices without compromising on beauty, quality, or elegance.
              </p>

              <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#666666', margin: '0 0 28px' }}>
                Lab-grown diamonds offer the same captivating sparkle, exceptional hardness, and chemical and optical properties as mined diamonds. Created using advanced technology that replicates the natural diamond-growing process, they represent a modern approach to timeless luxury. Discover a diamond that reflects your style, your values, and your individuality.
              </p>

              {/* Checklist from reference screenshot */}
              <div style={{ marginBottom: '36px' }}>
                <div className="wlg-check-item">
                  <span className="wlg-check-icon">✓</span>
                  <span>100% genuine carbon diamond, chemically & optically identical to mined diamonds.</span>
                </div>
                <div className="wlg-check-item">
                  <span className="wlg-check-icon">✓</span>
                  <span>Same refractive brilliance, fire, and hardness (10 on the Mohs scale).</span>
                </div>
                <div className="wlg-check-item">
                  <span className="wlg-check-icon">✓</span>
                  <span>Grown in controlled laboratory environments — no diamond mining.</span>
                </div>
                <div className="wlg-check-item">
                  <span className="wlg-check-icon">✓</span>
                  <span>Independently certified by world-leading gem labs including IGI & GIA.</span>
                </div>
              </div>

              {/* Metric stats row from reference screenshot */}
              <div style={{ display: 'flex', gap: '48px', paddingTop: '10px', borderTop: '1px solid #f0ede8' }}>
                <div className="wlg-stat-col">
                  <span className="wlg-stat-label">01. MOHS HARDNESS</span>
                  <span className="wlg-stat-val">10 / 10</span>
                </div>
                <div className="wlg-stat-col">
                  <span className="wlg-stat-label">02. CARBON PURITY</span>
                  <span className="wlg-stat-val">100%</span>
                </div>
                <div className="wlg-stat-col">
                  <span className="wlg-stat-label">03. ETHICAL ORIGIN</span>
                  <span className="wlg-stat-val">100%</span>
                </div>
              </div>
            </div>

            {/* Right Images Column (2 side-by-side vertical rounded cards as in reference) */}
            <div
              className="wlg-images-grid"
              style={{
                flex: '0.9',
                display: 'flex',
                gap: '16px',
                height: '480px',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src="/wp-content/uploads/Lab-Grown Diamond/Lab-Grown Diamond.webp"
                  alt="Diamond cutting and lapidary polishing machine"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 50vw, 25vw"
                />
              </div>

              <div
                style={{
                  position: 'relative',
                  flex: 1,
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src="/wp-content/uploads/Lab-Grown Diamond/Lab-Grown Diamond 2.webp"
                  alt="Gemologist inspecting brilliant cut lab-grown diamond"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: INTERACTIVE TIMELINE / CRAFTING PROCESS
          (Matches bottom section of reference screenshot)
          ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#f6f4f0', padding: '90px 24px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header row with Title and Arrow Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: gold,
                  marginBottom: '8px',
                }}
              >
                TIMELINE &amp; INNOVATION
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 'clamp(28px, 3.8vw, 42px)',
                  fontWeight: 700,
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  color: '#0C1315',
                  lineHeight: 1.2,
                }}
              >
                Created with Science. Finished with Elegance.
              </h2>
            </div>

            {/* Nav Arrows */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="timeline-nav-btn"
                onClick={handlePrev}
                aria-label="Previous step"
              >
                ‹
              </button>
              <button
                type="button"
                className="timeline-nav-btn"
                onClick={handleNext}
                aria-label="Next step"
              >
                ›
              </button>
            </div>
          </div>

          {/* Interactive Timeline Bar */}
          <div className="timeline-track-wrap">
            <div className="timeline-track-line" />
            <div className="timeline-points-row">
              {TIMELINE_STEPS.map((step, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={step.year}
                    type="button"
                    className={`timeline-point-btn${isActive ? ' active' : ''}`}
                    onClick={() => setActiveIdx(idx)}
                  >
                    <span className="timeline-point-year">{step.year}</span>
                    <span className="timeline-point-dot" />
                    <span
                      style={{
                        fontSize: '11px',
                        color: isActive ? '#111111' : '#888888',
                        fontWeight: isActive ? 700 : 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: '2px',
                      }}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Card Row (Image on left, content on right like screenshot) */}
          <div
            className="timeline-card-split"
            style={{
              display: 'flex',
              gap: '44px',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            }}
          >
            {/* Left: Big Rounded Photo */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                minHeight: '340px',
                borderRadius: '18px',
                overflow: 'hidden',
              }}
            >
              <Image
                src={currentStep.img}
                alt={currentStep.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>

            {/* Right: Year, Title, Description */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '38px',
                  fontWeight: 800,
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  color: gold,
                  lineHeight: 1,
                  marginBottom: '10px',
                }}
              >
                {currentStep.year}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#777777',
                  marginBottom: '10px',
                }}
              >
                {currentStep.subtitle}
              </div>

              <h3
                style={{
                  margin: '0 0 16px',
                  fontSize: '24px',
                  fontWeight: 700,
                  fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                  color: '#0C1315',
                  lineHeight: 1.3,
                }}
              >
                {currentStep.title}
              </h3>

              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555555', margin: '0 0 24px' }}>
                {currentStep.description}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link
                  href="/diamonds"
                  style={{
                    display: 'inline-block',
                    padding: '12px 28px',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: '6px',
                  }}
                >
                  Explore Diamonds
                </Link>
                <Link
                  href="/create-your-own"
                  style={{
                    display: 'inline-block',
                    padding: '12px 28px',
                    border: '1.5px solid #111111',
                    color: '#111111',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: '6px',
                  }}
                >
                  Create Your Own
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: WHAT ARE LAB-GROWN DIAMONDS? (EXPLANATION CALLOUT)
          ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', padding: '90px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: gold,
              marginBottom: '12px',
            }}
          >
            REAL DIAMONDS, REAL SCIENCE
          </div>
          <h2
            style={{
              margin: '0 0 24px',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              color: '#0C1315',
            }}
          >
            What Are Lab-Grown Diamonds?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.85, color: '#555555', margin: '0 0 16px' }}>
            Lab-grown diamonds are <strong style={{ color: '#111111' }}>real diamonds</strong> created in highly controlled laboratory environments using advanced technological processes that replicate natural mantle pressure and heat.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.85, color: '#666666', margin: '0 0 32px' }}>
            Unlike diamond simulants such as cubic zirconia or moissanite, lab-grown diamonds have the exact same fundamental chemical composition, crystal structure, and physical properties as natural diamonds. They are available in a beautiful range of shapes, sizes, and colours, making them an excellent choice for engagement rings, necklaces, earrings, and other fine jewellery.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: WHY CHOOSE LAB-GROWN DIAMONDS? (6 GRID CARDS)
          ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#f6f4f0', padding: '90px 24px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '10px',
              }}
            >
              KEY BENEFITS
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 3.8vw, 42px)',
                fontWeight: 700,
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                color: '#0C1315',
              }}
            >
              Why Choose Lab-Grown Diamonds?
            </h2>
          </div>

          <div
            className="reasons-grid-3col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            {WHY_CHOOSE_ITEMS.map((item) => (
              <div key={item.number} className="reason-card">
                <span className="reason-num">{item.number}.</span>
                <h3 className="reason-title">{item.title}</h3>
                <p className="reason-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: LAB-GROWN VS. NATURAL COMPARISON TABLE
          ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', padding: '90px 24px 100px' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '10px',
              }}
            >
              SIDE BY SIDE
            </div>
            <h2
              style={{
                margin: '0 0 16px',
                fontSize: 'clamp(28px, 3.8vw, 42px)',
                fontWeight: 700,
                fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
                color: '#0C1315',
              }}
            >
              Lab-Grown Diamonds vs. Natural Diamonds
            </h2>
            <p style={{ fontSize: '15px', color: '#666666', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
              Both are real diamonds, sharing the same essential physical, chemical, and optical properties. The primary difference is their origin.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Feature</th>
                  <th style={{ width: '36%', color: gold }}>Lab-Grown Diamonds</th>
                  <th style={{ width: '36%' }}>Natural Diamonds</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td>
                      <strong>{row.feature}</strong>
                    </td>
                    <td style={{ color: '#111111', fontWeight: 600 }}>{row.lab}</td>
                    <td>{row.natural}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: A MORE BEAUTIFUL WAY TO CELEBRATE (CTA HERO)
          ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          padding: '100px 24px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Ambient subtle glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(191,163,124,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px', margin: '0 auto' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: gold,
              marginBottom: '16px',
            }}
          >
            THE CARITAS PROMISE
          </div>

          <h2
            style={{
              margin: '0 0 20px',
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 700,
              fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            A More Beautiful Way to Celebrate
          </h2>

          <p style={{ fontSize: '16.5px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', margin: '0 auto 16px', maxWidth: '720px' }}>
            Whether you are choosing an engagement ring, celebrating an anniversary, or simply treating yourself to something special, Caritas Luxury brings you a world of extraordinary diamond jewellery.
          </p>

          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', margin: '0 auto 36px', maxWidth: '640px' }}>
            Because luxury should feel beautiful in every way.
          </p>

          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#ffffff',
              marginBottom: '36px',
              fontFamily: 'var(--title-fonts, "Readex Pro", sans-serif)',
            }}
          >
            Discover the brilliance. Experience the difference. Choose Caritas.
          </div>

          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              padding: '16px 44px',
              backgroundColor: gold,
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '6px',
              boxShadow: '0 8px 24px rgba(191,163,124,0.3)',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
            }}
          >
            EXPLORE OUR COLLECTION
          </Link>
        </div>
      </section>
    </div>
  );
}
