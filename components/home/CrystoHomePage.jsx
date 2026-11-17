// Server Component — no 'use client' needed here; children are individually client
import CrystoHero from './CrystoHero.jsx';
import CrystoCategories from './CrystoCategories.jsx';
import CrystoNewArrivals from './CrystoNewArrivals.jsx';
import CrystoBrandLogos from './CrystoBrandLogos.jsx';
import CrystoShopByDiamonds from './CrystoShopByDiamonds.jsx';
import CrystoTrendingProducts from './CrystoTrendingProducts.jsx';
import CrystoPromoBanners from './CrystoPromoBanners.jsx';
import CrystoBlogs from './CrystoBlogs.jsx';

export default function CrystoHomePage() {
  return (
    <main
      id="main"
      style={{
        fontFamily: 'var(--body-fonts, "Nunito Sans", sans-serif)',
        // Reset any WordPress float interference
        overflow: 'visible',
      }}
    >
      {/* 1 — Hero */}
      <CrystoHero />

      {/* 2 — Diamond Category Cards (overlapping hero) */}
      <CrystoCategories />

      {/* 3 — New Arrivals Product Grid */}
      <CrystoNewArrivals />

      {/* 4 — Brand Logos Strip */}
      <CrystoBrandLogos />

      {/* 5 — Shop by Diamonds */}
      <CrystoShopByDiamonds />

      {/* 6 — Trending / Featured Products Horizontal Scroll */}
      <CrystoTrendingProducts />

      {/* 7 — 3-column Promotional Banners */}
      <CrystoPromoBanners />

      {/* 8 — Latest Blog Posts */}
      <CrystoBlogs />
    </main>
  );
}
