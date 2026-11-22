# Caritas Luxury — High-End Lab-Grown Diamonds & Fine Jewellery

> A luxury e-commerce platform crafted with **Next.js 16 (App Router)**, **TypeScript**, **Cloud Firestore Database**, **Firebase Storage**, and a dedicated, professional **Administrative Control Panel**.

---

## 📑 Table of Contents
1. [Website Architecture & Technology Stack](#-website-architecture--technology-stack)
2. [Complete Website URL Directory & Sitemap](#-complete-website-url-directory--sitemap)
   - [Public Storefront Routes](#1-public-storefront-routes)
   - [Admin Control Panel Routes](#2-admin-control-panel-routes-admin)
3. [Admin Portal Access & Credentials](#-admin-portal-access--credentials)
4. [Multi-Website Database Isolation Protection](#-multi-website-database-isolation-protection)
5. [Connecting Your Firebase Account](#-connecting-your-firebase-account)
6. [Local Development & Testing](#-local-development--testing)
7. [Production Build & Hosting Deployment](#-production-build--hosting-deployment)
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
