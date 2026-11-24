import './globals.css';
import LegacyStyles from '../components/LegacyStyles.jsx';
import { getSiteDocument } from '../lib/source-page.js';

const site = getSiteDocument();
const favicon = '/images/favicon.png';
const title = 'Caritas Luxury – Lab-Grown Diamonds in Extraordinary Colour';
const description = 'Caritas Luxury creates bespoke jewellery with lab-grown diamonds. Discover our signature pink and white lab-grown diamonds.';

export const metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    title,
    description
  },
  icons: {
    icon: favicon
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang={site.lang} suppressHydrationWarning>
      <head>
        {/* Polyfill URL.canParse for older browsers / Next.js 16 Turbopack HMR */}
        <script dangerouslySetInnerHTML={{ __html: `if(typeof URL.canParse!=='function'){URL.canParse=function(u,b){try{new URL(u,b);return true;}catch(e){return false;}}}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" />
        <LegacyStyles resources={site.stylesheets} />
      </head>
      <body className={site.bodyClass} suppressHydrationWarning>{children}</body>
    </html>
  );
}
