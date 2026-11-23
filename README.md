# Caritas Luxury — High-End Lab-Grown Diamonds & Fine Jewellery

> A luxury e-commerce platform crafted with **Next.js 16 (App Router)**, **TypeScript**, **Cloud Firestore Database**, **Firebase Storage**, and a dedicated, professional **Administrative Control Panel**.

---

## 📑 Table of Contents
1. [Website Architecture & Technology Stack](#-website-architecture--technology-stack)
2. [Frontend Structure & Admin Panel Design Guide](#frontend-structure--admin-panel-design-guide)
3. [Complete Website URL Directory & Sitemap](#-complete-website-url-directory--sitemap)
   - [Public Storefront Routes](#1-public-storefront-routes)
   - [Admin Control Panel Routes](#2-admin-control-panel-routes-admin)
4. [Admin Portal Access & Credentials](#-admin-portal-access--credentials)
5. [Multi-Website Database Isolation Protection](#-multi-website-database-isolation-protection)
6. [Connecting Your Firebase Account](#-connecting-your-firebase-account)
7. [Local Development & Testing](#-local-development--testing)
8. [Production Build & Hosting Deployment](#-production-build--hosting-deployment)
   - [cPanel / Apache Shared Hosting](#a-cpanel--apache-shared-hosting)
   - [Firebase Hosting](#b-firebase-hosting)
   - [Vercel / Node.js Server](#c-vercel--nodejs-server)

---

## 🏛 Website Architecture & Technology Stack

- **Framework**: Next.js 16.4.6 with React 19 (App Router Architecture)
- **Language**: TypeScript & Modern ES Modules
- **Design System**: Bespoke Luxury Dark/Gold Theme with dynamic CSS variables
- **Backend Infrastructure**: Firebase v13
  - **Database**: Cloud Firestore (NoSQL Document Store)
  - **File & Media Storage**: Firebase Cloud Storage
  - **Authentication**: Firebase Auth with Role-Based Access Control (RBAC)
- **Deployment Targets**: Static Export HTML5 (`out/`) or Node.js Serverless SSR

---

## Frontend Structure & Admin Panel Design Guide

This section describes the public website from an administrator's perspective. Use it as the specification for building or expanding the admin panel.

### 1. Global Layout Used by Every Page

The storefront is not a collection of independent pages. Every public page shares the same website shell:

| Global area | Frontend component | What an admin should control |
| :--- | :--- | :--- |
| Top header | `components/Header.jsx` | Store logo, utility links, primary navigation, active menu state, CTA button |
| Primary navigation | `components/Navigation.jsx` | Menu labels, URLs, order, visibility, dropdown labels and dropdown URLs |
| Page breadcrumb/banner | `components/SitePage.jsx` | Page title, banner image, breadcrumb label and route |
| Main content | Individual route and section components | Page headings, text, images, cards, links, section visibility and display order |
| Footer | `components/Footer.jsx` | Newsletter copy, social links, link groups, contact details and copyright text |
| Loading/preloader | `components/SitePage.jsx` and homepage source renderer | Logo and preloader image |
| Mobile navigation | `components/Navigation.jsx` | Menu visibility and responsive dropdown behavior |

The global shell comes from the saved original homepage HTML, while React components replace selected areas. Do not redesign or replace the shell when creating an admin page.

### 2. Public Route Map

| Route | Page purpose | Main frontend components | Administrator module |
| :--- | :--- | :--- | :--- |
| `/` | Main brand homepage | `components/sections/HomeSections.jsx` | Website Content and Homepage Sections |
| `/shop` | Fine-jewellery shopping page | `components/home/CrystoHomePage.jsx` and its child components | Shop Management |
| `/diamonds` | Complete diamond catalogue | `components/diamonds/DiamondGrid.jsx` | Diamond Management |
| `/diamonds/white` | White diamond catalogue with a white prefilter | `DiamondGrid` with `prefilterColour="white"` | Diamond Management, White collection filter |
| `/diamonds/pink` | Pink diamond catalogue with a pink prefilter | `DiamondGrid` with `prefilterColour="pink"` | Diamond Management, Pink collection filter |
| `/create-your-own` | Bespoke ring introduction and consultation CTA | `app/create-your-own/page.js` | Website Content / Bespoke Services |
| `/why-lab-grown` | Lab-grown diamond benefits and interactive timeline | `components/whylabgrown/WhyLabGrownContent.jsx` | Website Content |
| `/diamond-guide` | Educational guide to diamond 4Cs and shapes | `app/diamond-guide/page.js` | Website Content / Knowledge Pages |
| `/sourcing` | Ethical sourcing and sustainability information | `app/sourcing/page.js` | Website Content / Sourcing |
| `/about-us` | Brand story and company information | `components/about/*.jsx` | Website Content / About Page |
| `/contact` | Enquiries, consultation requests and bespoke design requests | `ContactInquiryCards` and `ContactFormTabs` | Customers, Messages and Inquiries |
| `/delivery` | Shipping and delivery policy | `app/delivery/page.js` | Footer / Policy Content |
| `/returns` | Returns, exchanges and warranty policy | `app/returns/page.js` | Footer / Policy Content |
| `/privacy` | Privacy and personal-data policy | `app/privacy/page.js` | Footer / Policy Content |
| `/terms` | Sales and bespoke-order terms | `app/terms/page.js` | Footer / Policy Content |

### 3. Homepage Structure

The homepage is rendered by `components/sections/HomeSections.jsx`, which preserves the original Elementor section structure. Its major managed areas should be represented as separate records or sections in the admin panel.

| Homepage area | Frontend behavior | Recommended admin fields |
| :--- | :--- | :--- |
| Revolution hero slider | Displays multiple full-width slides with text and calls to action | Slide title, subtitle, image, button text, button URL, order, active status |
| Intro/About section | Describes the Caritas brand | Eyebrow, heading, body, image, button and link |
| Services section | Presents core service or brand pillars | Repeatable title, description, icon/image and link |
| Diamond process | Explains lab-grown diamond creation | Section heading, process steps, step images and text |
| Mission/Vision | Shows brand mission and vision messaging | Heading, body copy, image and optional CTA |
| Diamond shapes | Highlights popular diamond shapes | Shape name, shape image, destination URL and order |
| Video section | Shows brand or production video | Video URL, poster image, heading and text |
| Testimonials | Displays client quotes | Quote, customer name, role/location, image and order |
| Global map | Shows brand reach or sourcing footprint | Map image, heading, locations and supporting text |
| Export/closing section | Closing brand or commerce message | Heading, body, image and CTA |

The homepage UI should remain visually unchanged. An admin update should change content or data only, not replace or restyle these components.

### 4. Shop Page Structure

The `/shop` route replaces the original main content with `components/home/CrystoHomePage.jsx`. Its section order must remain stable:

| Order | Shop section | Frontend behavior | Recommended admin controls |
| :---: | :--- | :--- | :--- |
| 1 | Hero | Dark full-width luxury banner with “SHINE BRIGHT / DAY AND NIGHT” and product messaging | Badge, left heading, right heading, subtitle, CTA label/link, hero image |
| 2 | Diamond category cards | Four visual category cards | Title, item count, image, destination URL, text theme, order, published |
| 3 | New Arrivals | Tabbed jewellery product grid | Product selection, category tabs, publish state and display order |
| 4 | Brand logos | Partner or press logo strip | Logo image, alternate image for hover, alt text, order |
| 5 | Shop by Shape and Carat | Four circular diamond-shape/category cards | Title, image, destination URL, order and visibility |
| 6 | Trending products | Continuous horizontal marquee | Product featured/trending status, badge, order and published state |
| 7 | Promotional banners | Three wide promotional cards | Title, subtitle, badge, image, button text/link, order and active state |
| 8 | Journal/Blog | Three editorial cards | Image, title, date, categories, destination and published state |

When a shop product is published or unpublished, the change must affect every published storefront block that uses that product.

### 5. Diamond Catalogue Structure

The diamond catalogue is managed through `components/diamonds/DiamondGrid.jsx`.

| Diamond field | UI/function | Required behavior |
| :--- | :--- | :--- |
| Name/title | Product identification | Required for a clear admin and catalogue label |
| Shape | Shape filter and card | Round, Oval, Emerald, Asscher, Marquise, Cushion, Pear, Radiant, Princess, Heart, Old Mine and Elongated Cushion |
| Carat | Carat range filter and card | Numeric value with two-decimal support |
| Cut | Cut filter and card | Fair, Good, Very Good, Ideal, Super Ideal |
| Color | Colour-grade filter and card | D–M white grades or “Pink” for fancy pink diamonds |
| Clarity | Clarity filter and card | SI2 through FL, including VVS grades |
| Price | Price sorting/filter and card | Stored in AED; display formatting must remain consistent |
| Origin | Origin filter | Natural or Lab Grown |
| Collection | `/diamonds/white` or `/diamonds/pink` | `white` or `pink` |
| Image | Visual or list view | Firebase Storage URL or existing local asset |
| Availability | Stock/sale state | Available, Reserved or Sold |
| QuickShip | Special filter/toggle | Boolean |
| BestValue | Promotional badge | Boolean |
| Published | Public visibility | Drafts are excluded from every public catalogue |
| Popular rank | Default sort | Lower or configured rank appears earlier |

Catalogue functionality the admin must preserve:

- Shape selection
- Origin filtering
- Carat range
- Price range
- Cut, colour and clarity grade sliders
- “Looking for” presets
- QuickShip-only filter
- Popular, price and carat sorting
- Visual and list views
- Compare mode
- Wishlist state
- `/diamonds/white` white collection prefilter
- `/diamonds/pink` pink collection prefilter

### 6. Jewellery Product Structure

The reusable jewellery product data belongs in the `caritas_products` collection. A product can appear in:

- `/shop` New Arrivals
- `/shop` Trending Products
- The general storefront catalogue
- Future jewellery or diamond category pages

| Product field | Purpose | Admin control |
| :--- | :--- | :--- |
| Name | Card title and product title | Required text |
| Slug | Route and document identity | Auto-generated, editable and unique |
| Category | Primary collection | Rings, Earrings, Necklaces, Bracelets or custom category |
| Subcategory | Secondary grouping | Engagement rings, hoops, pendants, bands, etc. |
| Description | Full product copy | Rich or plain text |
| Short description | Compact card copy | Text |
| Price | Selling price | Numeric AED value |
| Sale price | Comparison/discount price | Numeric optional value |
| SKU | Inventory reference | Text |
| Stock | Available units | Numeric |
| Availability | Purchase state | In stock, out of stock or preorder |
| Weight | Jewellery specification | Text or grams |
| Images | Main image and gallery | Multiple Firebase Storage uploads |
| Specifications | Material/spec rows | Repeatable name/value pairs |
| Featured | Featured collection state | Boolean |
| New arrival | New Arrivals state | Boolean |
| Trending | Trending marquee state | Boolean |
| Badge | Promotional label | NEW, HOT, TRENDING or BESTSELLER |
| Rating/review count | Visual product rating | Numeric optional values |
| Published | Frontend visibility | Boolean |
| SEO title/description | Search metadata | Text fields |

### 7. Category and Collection Structure

Categories use the `caritas_categories` collection and can control shop category cards.

| Category field | Purpose |
| :--- | :--- |
| Name | Card title |
| Slug | Stable identity |
| Description | Optional category copy |
| Image | Category card/banner |
| Item count text | Public label such as “7 Items” |
| Text theme | Dark or light text for the selected image |
| Display order | Card sorting |
| Published | Hide/show the category |
| Subcategories | Repeatable category tags |

Categories must be separate from individual diamond records. Category names should not be used as a replacement for diamond collection values.

### 8. Shared Header and Footer

The header is loaded by `Header.jsx` and receives the current route. It dynamically loads navigation from `caritas_settings/navigation`.

Recommended navigation record fields:

- Menu item ID
- Label
- Destination URL
- Display order
- Active/published state
- Has dropdown
- Repeatable child label
- Repeatable child URL
- Repeatable child active state

The footer should be treated as a separate settings module. Manageable areas include:

- Newsletter heading and subtitle
- Contact email and phone
- Social URLs
- Customer-service/legal links
- Collection links
- Footer description
- Copyright text

### 9. Supporting Public Pages

#### Create Your Own

The page explains the bespoke ring process and links to Contact. Admin controls should cover:

- Page breadcrumb/title
- Eyebrow and heading
- Introductory copy
- Repeatable process bullets
- Consultation CTA label and URL
- Supporting image

#### Contact

The contact page contains:

- Enquiry cards
- Diamond enquiry form
- Consultation-request form
- Bespoke-design form

At minimum, an admin module should store contact details, service cards and form success/error messages. Submitted inquiry records should be stored in `caritas_customers` or a dedicated inquiry collection.

#### Why Lab-Grown

This page includes an educational introduction, benefits, statistics, production steps and an interactive timeline. Manage as repeatable section records:

- Timeline year/order
- Timeline title
- Timeline description
- Timeline image
- Benefits
- Stats
- Optional active/default year

#### Diamond Guide

Manage:

- Page introduction
- Repeatable guide sections
- Heading
- Paragraph
- CTA label
- CTA URL

#### Sourcing

Manage:

- Page introduction
- Repeatable sourcing pillars
- Pillar title
- Pillar description
- CTA label
- CTA URL

#### About Us

Manage each of the existing sections:

- Breadcrumb
- Brand story
- Process
- Services
- Banner
- Testimonials
- Partner/client logos

#### Delivery and Returns

Manage:

- Page title
- Eyebrow
- Introduction
- Repeatable policy headings and paragraphs
- Optional CTA

#### Privacy and Terms

Manage:

- Page title
- Introduction
- Repeatable legal sections
- Contact/privacy email
- Effective date

### 10. Recommended Admin Module Map

| Admin module | Frontend responsibility |
| :--- | :--- |
| Overview | Overall status and operational counts |
| Diamonds | Diamond catalogue, 4Cs, collection, publication and visibility |
| Products / Jewellery | `/shop` jewellery products and merchandising flags |
| Categories | Shop category cards and subcategories |
| Shop Page Settings | Shop hero and global shop settings |
| Homepage Content | Homepage slides and brand sections |
| Navigation | Header menu and dropdown links |
| Footer | Footer, social links and legal/customer links |
| Orders | Customer orders and fulfillment |
| Customers | Customers and contact/consultation inquiries |
| Settings | Admin roles, Firebase status and baseline synchronization |

### 11. Firestore Collection Reference

| Collection/document | Intended records |
| :--- | :--- |
| `caritas_diamonds` | Managed loose diamonds |
| `caritas_products` | Jewellery products |
| `caritas_categories` | Jewellery and shop categories |
| `caritas_orders` | Customer orders |
| `caritas_customers` | Registered customer and inquiry records |
| `caritas_adminUsers` | Authorized administrator records |
| `caritas_media` | Media-library references |
| `caritas_settings/shop` | Shop hero and shop display settings |
| `caritas_settings/websiteContent` | Homepage and website content |
| `caritas_settings/navigation` | Header navigation items |
| `caritas_settings/footer` | Footer configuration |

The collection prefix is configured through `NEXT_PUBLIC_COLLECTION_PREFIX`. Keep `caritas_` unless the database isolation requirement is intentionally changed.

### 12. Publishing and Synchronization Rules

Every public-facing record should follow these rules:

1. Store a clear `published` or `active` boolean.
2. Filter unpublished records before rendering public pages.
3. Preserve existing static content as fallback data when Firestore is unavailable.
4. Do not overwrite the existing frontend layout or component structure.
5. Upload images to Firebase Storage, save the download URL in Firestore, and reference that URL in the frontend.
6. Use stable IDs and slugs for routes, links and comparisons.
7. Use display order values for menus, cards and repeatable sections.
8. Validate required fields before publishing.
9. Keep product and diamond management separate.
10. Update image, content and publication changes without requiring a frontend code deployment.

---

## 🌐 Complete Website URL Directory & Sitemap

### 1. Public Storefront Routes

| URL Route | Page Title / Description | Key Features |
| :--- | :--- | :--- |
| **`/`** | **Home — Caritas Luxury** | Revolution Hero Slider (4 slides), New Arrivals tabbed gallery, Trending collections, Category grid, Press logos, Client testimonials, and Concierge booking. |
| **`/shop`** | **Shop All Fine Jewellery** | Dynamic product catalog, category filters (Rings, Bracelets, Necklaces, Earrings), price sorting, availability badges, and pagination. |
| **`/diamonds`** | **Certified Diamonds Hub** | Sourcing overview, custom diamond inquiry, certification standards (IGI, GIA). |
| **`/diamonds/pink`** | **Fancy Pink Diamonds** | Rare pink lab-grown diamond showcase, ring settings, and bespoke ordering. |
| **`/diamonds/white`** | **Brilliant White Diamonds** | D-F color, VVS clarity lab-grown diamond curation and solitaire rings. |
| **`/create-your-own`** | **Create Your Own Ring** | 3-Step ring builder: Select diamond stone, choose precious metal setting, and customize engraving. |
| **`/why-lab-grown`** | **Why Choose Lab-Grown** | Ethical diamond creation process, environmental impact comparisons, and conflict-free guarantees. |
| **`/diamond-guide`** | **The 4Cs Diamond Education** | Comprehensive guide covering Cut, Color, Clarity, and Carat weight. |
| **`/sourcing`** | **Ethical Sourcing & Heritage** | Lab-grown provenance, foundry transparency, and master craftsmen profiles. |
| **`/about-us`** | **About Caritas Luxury** | The brand vision, artisanal traditions, London Mayfair concierge story. |
| **`/contact`** | **Contact & Concierge** | Private consultation booking form, VIP concierge phone/email, and studio location. |
| **`/delivery`** | **Insured Delivery Policy** | Fully insured worldwide shipping policies, courier partners, and transit timelines. |
| **`/returns`** | **Complimentary Returns** | 30-day hassle-free return policy, grading certificate return requirements, and refunds. |
| **`/privacy`** | **Privacy Policy** | Data protection, GDPR compliance, cookie policies, and security practices. |
| **`/terms`** | **Terms & Conditions** | E-commerce purchase terms, pricing benchmarks, and service guarantees. |

---

### 2. Admin Control Panel Routes (`/admin`)

The entire website is dynamically manageable without editing source code:

| Admin URL Route | Section | Capabilities & Controls |
| :--- | :--- | :--- |
| **`/admin`** | **Dashboard Overview** | Real-time analytics, total active products, category count, order volume, recent catalog additions, and system status indicators. |
| **`/admin/login`** | **Admin Sign-In** | Secure authentication portal supporting username or email login with session persistence. |
| **`/admin/products`** | **Product Management** | Product catalog table, live search, category filtering, stock counters, quick 1-click **Publish / Unpublish** toggle, and product deletion. |
| **`/admin/products/new`** | **Add New Product** | Multi-image file uploader with drag-and-drop, title, price, sale price, SKU, stock quantity, 4Cs specifications, attributes, SEO title/description. |
| **`/admin/products/edit?id=[ID]`** | **Edit Product** | Full dynamic editor to modify all product parameters, replace images, adjust stock, or update pricing. |
| **`/admin/categories`** | **Category Manager** | Create, edit, and reorder categories, manage subcategory tags, and upload banner cards. |
| **`/admin/shop`** | **Shop Settings** | Edit the hero title, subtitle, top announcement banner text, default sorting rule, and products-per-page. |
| **`/admin/content`** | **Website Content** | Control the 4 homepage hero slides (text, button destination, background image), promo cards, and social links. |
| **`/admin/navigation`** | **Header Menu Editor** | Add, reorder, or edit navigation links and multi-level dropdown menus. |
| **`/admin/footer`** | **Footer & Legal Links** | Customize newsletter subscription headline, legal links, and copyright text. |
| **`/admin/orders`** | **Client Orders** | View order numbers, customer details, payment status, and update shipment progress. |
| **`/admin/customers`** | **Customer Directory** | Manage registered clients, subscriber emails, and direct consultation inquiries. |
| **`/admin/settings`** | **System & Database Sync** | View database connection state, manage administrator roles, and run 1-click default data synchronization. |

---

## 🔐 Admin Portal Access & Credentials

To access the administrative control panel:

- **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) *(or `https://yourdomain.com/admin/login`)*
- **Username**: `Caritas360`
- **Password**: `Caritas1234!@#`

> [!NOTE]
> The login screen accepts either the username (`Caritas360`) or email. If Firebase is offline or not yet configured with keys, the dashboard operates seamlessly in secure standalone fallback mode.

---

## 🛡 Multi-Website Database Isolation Protection

If you share a Firebase project or database with **another website**, Caritas Luxury includes built-in **Collection Namespacing Protection**.

All collections created by this website are automatically prefixed with **`caritas_`**:

- `caritas_products`
- `caritas_categories`
- `caritas_settings`
- `caritas_orders`
- `caritas_customers`
- `caritas_adminUsers`
- `caritas_media`

### Why this matters:
1. **Never Overwrites**: It will **never** collide with standard collection names (such as `products`, `categories`, or `users`) used by your other website.
2. **Never Cross-Pollinates**: The diamond store will never accidentally load products from your other project.
3. **Safe Co-existence**: Both websites can operate inside the exact same Firebase database in complete isolation.

---

## 🔌 Connecting Your Firebase Account

To connect a new or existing Firebase account:

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Cloud Firestore**, **Firebase Authentication** (Email/Password), and **Firebase Storage**.
3. Create or update your `.env.local` file with your project keys:

```bash
# ─────────────────────────────────────────────────────────────
# FIREBASE PROJECT CONFIGURATION
# ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...

# If using a named Firestore database, specify its ID (otherwise leave blank for default):
NEXT_PUBLIC_FIREBASE_DATABASE_ID=

# Isolated collection prefix (keep as caritas_ to protect multi-website databases):
NEXT_PUBLIC_COLLECTION_PREFIX=caritas_
```

4. Once connected, open `/admin/settings` and click **"⚡ Re-Sync Default Data"** (or run `node scripts/run-seed.mjs`) to populate all initial diamond jewellery collections into your new Firestore database.

---

## 💻 Local Development & Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
All 9 test suites verify route existence, metadata, navigation structure, and asset preservation:
```bash
npm test
```

---

## 🚀 Production Build & Hosting Deployment

### A. cPanel / Apache Shared Hosting
The project includes automated generation for Apache/cPanel static hosting:

1. Build the static export:
   ```powershell
   $env:NEXT_EXPORT="true"; npx next build
   ```
2. Copy the routing `.htaccess` file:
   ```powershell
   Copy-Item 'public\.htaccess' 'out\.htaccess' -Force
   ```
3. Generate the deployment zip archive:
   ```powershell
   tar -a -cf cpanel_public_html_caritas_luxury.zip -C out .
   ```
4. Log into your cPanel File Manager, open `public_html`, upload `cpanel_public_html_caritas_luxury.zip`, and click **Extract**.

---

### B. Firebase Hosting
To host directly on Google Cloud infrastructure:

```bash
# 1. Build the production export
npm run build

# 2. Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

### C. Vercel / Node.js Server
For SSR (Server-Side Rendering) or full Node.js deployment:
1. Push to your GitHub repository: [https://github.com/Arghya360/diamond-website-](https://github.com/Arghya360/diamond-website-)
2. Import the repository in [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Add the environment variables from `.env.local`.
4. Deploy!

---

## 📄 License & Attribution
Designed and engineered for **Caritas Luxury Fine Jewellery**.  
All rights reserved © 2026. Handcrafted bespoke lab-grown diamonds.
