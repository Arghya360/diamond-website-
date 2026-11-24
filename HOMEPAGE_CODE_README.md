# CARITAS LUXURY — All-In-One Homepage Code & Deployment Guide

This directory contains the consolidated, all-in-one homepage code:
- **`HOMEPAGE_STANDALONE.html`**: The complete single-file homepage containing all HTML structure, navigation, hero sliders, Elementor sections, embedded CSS styles, animation safeguards, and JavaScript libraries in one place.

---

## 1. What Is Included in `HOMEPAGE_STANDALONE.html`

| Component | Description | Location in File |
|---|---|---|
| **Document Head & Metadata** | Complete `<head>` with title *"Caritas Luxury – Lab-Grown Diamonds in Extraordinary Colour"*, Google Fonts preconnects, favicon link, and 44 theme stylesheet links. | Lines `1` – `360` |
| **Complete Embedded Styles** | `<style id="caritas-custom-styles">` containing the high-contrast slider overlay, dark typography shadows, mobile responsiveness, fake founder block removal, and the `@keyframes caritasElementorReveal` anti-invisibility animation safeguard. | Inside `<head>` |
| **Interactive Preloader** | `<div id="pt-loading">` with Caritas preloader diamond logo. | Top of `<body>` |
| **Site Header & Navigation** | `<header id="pt-header">` featuring Caritas logo, navigation links (`/about-us`, `/diamonds`, `/create-your-own`, `/why-lab-grown`, `/shop`, `/contact`), search icon, cart drawer, and the *"Get In Touch"* CTA button. | Header section |
| **Hero Carousel (Revolution Slider)** | `#rev_slider_1_1` with all 4 luxury slides: `Golden Desert Oasis`, `Artisan Setting`, `Gritty Jewelrysmith Workbench`, and `Precision Lapidary Machine`. | Main Hero Section |
| **All Homepage Content Sections** | Complete Elementor sections: *About Haute Joaillerie, Atelier Diamond Craftsmanship, Signature Bush Diamond Showcase, 4Cs Diamond Shapes Guide, Workshop Video, Client Testimonials, Global Presence Map*. | Main Content Section |
| **Footer & Disclaimers** | `<footer id="pt-footer">` with quick links (`/delivery`, `/returns`, `/privacy`, `/terms`), newsletter signup, and copyright. | Footer section |
| **Core Animation & Theme Scripts** | All 37 JavaScript libraries: `jQuery`, `rbtools.min.js`, `rs6.min.js` (Revolution Slider engine), `TweenMax.min.js` (GSAP), `aat.min.js`, `amcharts`, `isotope`, `swiper-bundle`, and `elementorFrontend`. | Bottom of `<body>` |

---

## 2. Required Supporting Asset Folders

For all images, fonts, and scripts in `HOMEPAGE_STANDALONE.html` to display properly, ensure the two static directories from `public/` are placed alongside your website's root:

```text
your-website-root/
├── HOMEPAGE_STANDALONE.html  (or index.html)
├── wp-content/               (contains all images, uploads, plugin assets, slider pictures)
│   ├── plugins/
│   ├── themes/
│   └── uploads/
│       ├── home page header picture/
│       ├── diamond/
│       └── ...
└── wp-includes/              (contains core jQuery, SVG helpers, and icons)
```

Both `wp-content/` and `wp-includes/` are already included in this repository under [public/](file:///c:/Users/arghy/OneDrive/Desktop/nextjs-version-dimond%20website/public/) and inside [cpanel_public_html_caritas_luxury.zip](file:///c:/Users/arghy/OneDrive/Desktop/nextjs-version-dimond%20website/cpanel_public_html_caritas_luxury.zip).

---

## 3. How to Copy and Paste into Another Project

### Option A: Standard Static HTML / Any Web Server (Apache, Nginx, cPanel)
1. Copy `HOMEPAGE_STANDALONE.html` and rename it to `index.html`.
2. Copy the `wp-content/` and `wp-includes/` folders to the same directory.
3. Open `index.html` in any browser or upload to your web server document root.

### Option B: PHP / WordPress / Laravel
1. Place `wp-content/` and `wp-includes/` in your public web root (`public/` or `htdocs/`).
2. Paste the `<head>` section into your header template (`header.php` or `head.blade.php`).
3. Paste the `<body>` markup into your home view (`index.php` or `welcome.blade.php`).
4. Paste the `<script>` tags before the closing `</body>` tag (`footer.php` or `footer.blade.php`).

### Option C: Next.js / React
- To embed directly in a Next.js route, keep the current architecture where [lib/source-page.js](file:///c:/Users/arghy/OneDrive/Desktop/nextjs-version-dimond%20website/lib/source-page.js) reads the template and renders it through React via `html-react-parser`.

---

## 4. Key Custom Styles Included

The `<style id="caritas-custom-styles">` tag inside `HOMEPAGE_STANDALONE.html` contains:
```css
/* Animation Safety — reveals delayed elements */
@keyframes caritasElementorReveal {
  0% { opacity: 0; }
  100% { visibility: visible !important; opacity: 1 !important; }
}
.elementor-invisible {
  animation: caritasElementorReveal 0.4s ease-out 1.2s forwards;
}

/* Slider dark shadow overlay for clear text readability */
#rev_slider_1_1 rs-slide::before,
.elementor-element-de7f16b rs-slide::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  background: linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.48) 50%, rgba(0,0,0,0.65) 100%) !important;
  z-index: 5 !important;
  pointer-events: none !important;
}

/* Crisp white header text with drop shadow */
#rev_slider_1_1 rs-layer[id*="layer-1"] {
  color: #ffffff !important;
  text-shadow: 0 2px 18px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9) !important;
}
```
