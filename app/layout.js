import './globals.css';
import LegacyStyles from '../components/LegacyStyles.jsx';
import { getSiteDocument } from '../lib/source-page.js';

const site = getSiteDocument();
const favicon = '/wp-content/uploads/2024/02/favicon.png';
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
        <LegacyStyles resources={site.stylesheets} />
      </head>
      <body className={site.bodyClass} suppressHydrationWarning>{children}</body>
    </html>
  );
}
