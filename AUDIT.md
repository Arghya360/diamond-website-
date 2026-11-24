# Complete WordPress & PHP Audit Report

**Project:** CARITAS LUXURY — Haute Joaillerie & Diamond Atelier  
**Framework:** Next.js (App Router, Static Export Compatible)  
**Date:** November 2026  
**Auditor:** Senior Next.js Architect  

---

## 1. Executive Summary

A comprehensive scan of the repository was conducted to identify all WordPress and PHP leftovers, including directory structures, legacy filenames, code references, asset paths, and API references.

- **PHP Files:** 0 (No server-side `.php` files exist; all backend functionality is handled via Next.js and Firebase).
- **WordPress Directories in `public/`:** 
  - `public/wp-content/` (Contains legacy theme stylesheets, plugins, uploads, and media assets).
  - `public/wp-includes/` (Contains legacy helper scripts and SVG definitions).
- **Files with WordPress/PHP References:**
  - `app/layout.js`: Favicon referencing `/wp-content/uploads/2024/02/favicon.png`.
  - `app/page.js`: Preloader image referencing `/wp-content/uploads/caritas-logo-dark perloader.png`.
  - `app/admin/*`: 5 admin routes referencing placeholder image URLs in `/wp-content/uploads/`.
  - `components/*`: Header, Footer, Navigation, and DiamondGrid referencing `/wp-content/uploads/`.
  - `lib/source-page.js`: Legacy host `gemzie.peacefulqode.in` normalizer and Elementor DOM parser.
  - `lib/firebase/seed-data.ts`: Mock and seed product catalogue images using `/wp-content/uploads/` paths.
  - `package.json`: Legacy project name `"gemzie-nextjs"`.
  - `app/globals.css`: Legacy comment referencing WordPress stylesheets.

---

## 2. Detailed Findings by Category

### A. Folder & File Names
| Path | Type | Status | Action Plan |
|---|---|---|---|
| `public/wp-content/uploads/` | Media Assets | Active | Migrate all product, diamond, and hero images to clean `public/images/` structure with lowercase, hyphenated filenames. Retain rewrite aliases in `.htaccess`. |
| `public/wp-content/themes/` | Styles & CSS | Active | Retain core CSS stylesheets to preserve pixel-perfect UI. |
| `public/wp-content/plugins/` | Scripts & Libs | Active | Retain RevSlider and GSAP assets needed for hero carousel and element animations. |
| `public/wp-includes/js/wp-emoji-release.min.js` | Legacy Script | Obsolete | Remove emoji script dependency. |

### B. Code References & Legacy URLs
| File | Found Reference | Remediation |
|---|---|---|
| `package.json` | `"name": "gemzie-nextjs"` | Rename to `"name": "caritas-luxury"`. |
| `app/layout.js` | `/wp-content/uploads/2024/02/favicon.png` | Update to `/images/favicon.png`. |
| `app/page.js` | `/wp-content/uploads/caritas-logo-dark perloader.png` | Update to `/images/caritas-logo-dark-preloader.png`. |
| `components/Header.jsx` | `/wp-content/uploads/...` | Update logo path to `/images/logo.png`. |
| `components/Footer.jsx` | `/wp-content/uploads/...` | Update logo path to `/images/logo.png`. |
| `components/Navigation.jsx` | `/wp-content/uploads/...` | Update logo and icon paths to `/images/`. |
| `components/diamonds/DiamondGrid.jsx` | `/wp-content/uploads/diamond/...` | Update to `/images/diamonds/...`. |
| `lib/firebase/seed-data.ts` | `/wp-content/uploads/...` (32 instances) | Update all seed product, hero, and category paths to `/images/...`. |
| `lib/source-page.js` | `gemzie.peacefulqode.in` | Remove external host dependency and normalize directly to local paths. |
| `app/globals.css` | Comment referencing WordPress | Remove and replace with pure Next.js documentation. |

### C. Admin Panel & API References
- **API Endpoints:** No calls to `/wp-json/` or `admin-ajax.php` exist in the admin panel. All administration logic utilizes direct Firebase Firestore SDK (`lib/firebase/admin-service.ts`) and client auth (`lib/firebase/auth-context.tsx`).
- **Styling:** Admin panel styling is completely self-contained in `app/admin/admin.css` with zero reliance on Tailwind CDN or external WordPress CSS.

---

## 3. Preservation & Safety Protocol
- Pixel-perfect visual fidelity must be maintained across all 35 pages and routes.
- Backward compatibility: `.htaccess` will include rewrite rules from `/wp-content/uploads/*` to `/images/*` so any external bookmarks or cached references resolve without HTTP 404 errors.
