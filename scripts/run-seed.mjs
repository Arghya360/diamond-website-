import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.log('Firebase credentials are not set in environment. Skipping database seed.');
  process.exit(0);
}

const app = initializeApp(firebaseConfig);
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID;
const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
const PREFIX = process.env.NEXT_PUBLIC_COLLECTION_PREFIX || 'caritas_';

const INITIAL_CATEGORIES = [
  {
    name: 'Diamond ring',
    slug: 'diamond-ring',
    description: 'Bespoke diamond engagement rings and fine bands handcrafted to perfection.',
    image: '/wp-content/uploads/shop page/banner-01.jpg',
    itemsCountText: '7 Items',
    textDark: false,
    displayOrder: 1,
    published: true,
    subcategories: ['Engagement Rings', 'Eternity Bands', 'Solitaire Rings', 'Halo Rings'],
  },
  {
    name: 'Diamond bracelets',
    slug: 'diamond-bracelets',
    description: 'Exquisite diamond tennis bracelets and luxury bangles.',
    image: '/wp-content/uploads/shop page/banner-02.jpg',
    itemsCountText: '3 Items',
    textDark: true,
    displayOrder: 2,
    published: true,
    subcategories: ['Tennis Bracelets', 'Bangles', 'Chain Bracelets'],
  },
  {
    name: 'Necklace sets',
    slug: 'necklace-sets',
    description: 'Stunning diamond pendants, collar necklaces, and matching luxury sets.',
    image: '/wp-content/uploads/shop page/bannerr-03.jpg',
    itemsCountText: '3 Items',
    textDark: false,
    displayOrder: 3,
    published: true,
    subcategories: ['Pendants', 'Chokers', 'Collar Sets'],
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Brilliant diamond studs, drop earrings, and huggies.',
    image: '/wp-content/uploads/shop page/banner-04.jpg',
    itemsCountText: '5 Items',
    textDark: false,
    displayOrder: 4,
    published: true,
    subcategories: ['Studs', 'Drops', 'Hoops', 'Huggies'],
  },
];

const INITIAL_PRODUCTS = [
  {
    name: 'Pink Morganite Butterfly Ring',
    slug: 'pink-morganite-butterfly-ring',
    category: 'Rings',
    subcategory: 'Solitaire Rings',
    description: 'An ethereal luxury butterfly ring featuring brilliant pink morganite stones set with pavé diamonds in 18k rose gold.',
    shortDescription: 'Pink morganite butterfly ring with pavé diamond accents.',
    price: 4200,
    salePrice: 5190,
    sku: 'RNG-MRG-001',
    stock: 5,
    availability: 'in_stock',
    weight: '3.8g',
    images: [{ url: '/wp-content/uploads/shop page/pro-21-300x300.png', isMain: true, alt: 'Pink Morganite Butterfly Ring' }],
    specifications: [
      { name: 'Metal', value: '18k Rose Gold' },
      { name: 'Center Stone', value: 'Pink Morganite' },
      { name: 'Diamond Clarity', value: 'VS1' },
      { name: 'Diamond Color', value: 'F-G' },
    ],
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    badge: 'NEW',
    rating: 4.9,
    published: true,
  },
  {
    name: 'Fancy Pink Drop Earrings',
    slug: 'fancy-pink-drop-earrings',
    category: 'Earrings',
    subcategory: 'Drops',
    description: 'Dazzling fancy pink drop earrings crafted with precision-cut lab-grown diamonds for maximum fire and brilliance.',
    shortDescription: 'Fancy pink drop earrings in 18k white gold.',
    price: 2100,
    salePrice: 2599,
    sku: 'ERR-PNK-002',
    stock: 8,
    availability: 'in_stock',
    weight: '2.5g',
    images: [{ url: '/wp-content/uploads/shop page/pro-03-300x300.jpg', isMain: true, alt: 'Fancy Pink Drop Earrings' }],
    specifications: [
      { name: 'Metal', value: '18k White Gold' },
      { name: 'Total Carat Weight', value: '1.80 ctw' },
      { name: 'Clarity', value: 'VVS2' },
    ],
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    badge: 'HOT',
    rating: 4.8,
    published: true,
  },
  {
    name: 'Teal Drop Ring & Earring Set',
    slug: 'teal-drop-ring-earring-set',
    category: 'Rings',
    subcategory: 'Halo Rings',
    description: 'A striking statement collection combining oceanic teal lab gemstones and sparkling diamond halos.',
    shortDescription: 'Teal drop halo ring and matching earrings.',
    price: 3600,
    salePrice: null,
    sku: 'SET-TEL-003',
    stock: 4,
    availability: 'in_stock',
    weight: '4.2g',
    images: [{ url: '/wp-content/uploads/shop page/pro-05-300x300.jpg', isMain: true, alt: 'Teal Drop Ring & Earring Set' }],
    specifications: [
      { name: 'Metal', value: 'Platinum' },
      { name: 'Accent Diamonds', value: '0.95 ctw' },
    ],
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    badge: 'NEW',
    rating: 4.9,
    published: true,
  },
  {
    name: 'Pink Cluster Necklace',
    slug: 'pink-cluster-necklace',
    category: 'Necklaces',
    subcategory: 'Pendants',
    description: 'Delicate cluster pendant necklace with shimmering pink and white lab-grown diamonds suspended from an adjustable chain.',
    shortDescription: 'Pink diamond cluster necklace.',
    price: 600,
    salePrice: null,
    sku: 'NCK-CLS-004',
    stock: 12,
    availability: 'in_stock',
    weight: '2.1g',
    images: [{ url: '/wp-content/uploads/shop page/pro-04-300x300.jpg', isMain: true, alt: 'Pink Cluster Necklace' }],
    isFeatured: false,
    isNewArrival: true,
    isTrending: true,
    badge: null,
    rating: 4.7,
    published: true,
  },
  {
    name: 'Emerald Serpentine Ring',
    slug: 'emerald-serpentine-ring',
    category: 'Rings',
    subcategory: 'Engagement Rings',
    description: 'Vibrant green emerald cut diamond framed by serpentine pavé detailing in polished 18k yellow gold.',
    shortDescription: 'Emerald cut statement ring with diamond pavé.',
    price: 4800,
    salePrice: null,
    sku: 'RNG-EMR-005',
    stock: 3,
    availability: 'in_stock',
    weight: '4.8g',
    images: [{ url: '/wp-content/uploads/shop page/pro-07-300x300.jpg', isMain: true, alt: 'Emerald Serpentine Ring' }],
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    badge: 'TRENDING',
    rating: 5.0,
    published: true,
  },
  {
    name: 'Emerald Eternity Band',
    slug: 'emerald-eternity-band',
    category: 'Rings',
    subcategory: 'Eternity Bands',
    description: 'A full continuous loop of emerald-cut lab diamonds offering timeless elegance and endless sparkle.',
    shortDescription: 'Full emerald-cut diamond eternity band.',
    price: 2800,
    salePrice: null,
    sku: 'RNG-ETN-006',
    stock: 6,
    availability: 'in_stock',
    weight: '3.4g',
    images: [{ url: '/wp-content/uploads/shop page/banner-01.jpg', isMain: true, alt: 'Emerald Eternity Band' }],
    isFeatured: false,
    isNewArrival: true,
    isTrending: true,
    badge: null,
    rating: 4.8,
    published: true,
  },
];

const INITIAL_SHOP_SETTINGS = {
  heroBadge: '— THE FINE JEWELLERY COLLECTION —',
  heroTitle: 'Luxury Diamond Collection',
  heroSubtitle: 'Ethically crafted lab-grown diamonds, bespoke engagement rings, and timeless fine jewellery made to endure for generations.',
  heroButtonText: 'Explore Diamonds',
  heroButtonLink: '/diamonds',
  bannerImage: '/wp-content/uploads/home page header picture/Golden-Desert-Oasis-at-Sunset.png',
  announcementText: 'Complimentary Insured Worldwide Shipping & 30-Day Hassle-Free Returns on All Orders',
  defaultSorting: 'featured',
  productsPerPage: 12,
  enableFilters: true,
  seoTitle: 'Shop Lab-Grown Diamonds & Fine Jewellery | Caritas Luxury',
  seoDescription: 'Discover our certified lab-grown diamond collection with bespoke designs crafted for eternity.',
};

const INITIAL_WEBSITE_CONTENT = {
  slides: [
    {
      id: 'slide-1',
      title: 'Extraordinary brilliance crafted for eternity',
      subtitle: 'Welcome to the diamond hub',
      image: '/wp-content/uploads/home page header picture/Golden-Desert-Oasis-at-Sunset.png',
      buttonText: 'Discover More',
      buttonLink: '/diamonds',
      order: 1,
      active: true,
    },
    {
      id: 'slide-2',
      title: 'Welcome to the epitome of diamond',
      subtitle: 'Welcome to the diamond hub',
      image: '/wp-content/uploads/home page header picture/Artisan Setting a Diamond Ring.png',
      buttonText: 'Discover More',
      buttonLink: '/diamonds',
      order: 2,
      active: true,
    },
    {
      id: 'slide-3',
      title: 'Discover elegance The beyond compare',
      subtitle: 'Welcome to the diamond hub',
      image: '/wp-content/uploads/home page header picture/Gritty-Jewelrysmiths-Workbench.png',
      buttonText: 'Discover More',
      buttonLink: '/diamonds',
      order: 3,
      active: true,
    },
    {
      id: 'slide-4',
      title: 'Affordble that diamond Servics Eryone',
      subtitle: 'Welcome to the diamond hub',
      image: '/wp-content/uploads/home page header picture/Precision Lapidary Machine in Action.png',
      buttonText: 'Discover More',
      buttonLink: '/diamonds',
      order: 4,
      active: true,
    },
  ],
  promoBanners: [
    {
      id: 'promo-1',
      title: 'Engagement Rings',
      subtitle: 'Custom Crafted for You',
      buttonText: 'Explore Rings',
      buttonLink: '/diamonds',
      image: '/wp-content/uploads/shop page/banner-01.jpg',
      badge: 'BESPOKE',
      order: 1,
      active: true,
    },
    {
      id: 'promo-2',
      title: 'Diamond Bracelets',
      subtitle: 'Everyday Luxury',
      buttonText: 'View Collection',
      buttonLink: '/diamonds',
      image: '/wp-content/uploads/shop page/banner-02.jpg',
      badge: 'TRENDING',
      order: 2,
      active: true,
    },
    {
      id: 'promo-3',
      title: 'Certified Diamonds',
      subtitle: 'IGI & GIA Certified',
      buttonText: 'Search Stones',
      buttonLink: '/diamonds',
      image: '/wp-content/uploads/shop page/bannerr-03.jpg',
      badge: 'CERTIFIED',
      order: 3,
      active: true,
    },
  ],
  brandLogos: [
    { src: '/wp-content/uploads/shop page/brand-01.png', alt: 'Vogue Luxury', order: 1 },
    { src: '/wp-content/uploads/shop page/brand-02.png', alt: 'Harper Bazaar', order: 2 },
    { src: '/wp-content/uploads/shop page/brand-03.png', alt: 'Elle Magazine', order: 3 },
    { src: '/wp-content/uploads/shop page/brand-04.png', alt: 'GQ Style', order: 4 },
    { src: '/wp-content/uploads/shop page/brand-05.png', alt: 'Vanity Fair', order: 5 },
    { src: '/wp-content/uploads/shop page/brand-06.png', alt: 'Forbes Lux', order: 6 },
  ],
  contactEmail: 'concierge@caritasluxury.com',
  contactPhone: '+1 (800) 555-CARITAS',
  contactAddress: 'Mayfair, London, United Kingdom',
  socialInstagram: 'https://instagram.com',
  socialFacebook: 'https://facebook.com',
  socialPinterest: 'https://pinterest.com',
};

const INITIAL_NAVIGATION = [
  { id: 'mi-home', label: 'Home', href: '/', hasChildren: false, order: 1, active: true },
  {
    id: 'mi-diamonds',
    label: 'Diamonds',
    href: '/diamonds',
    hasChildren: true,
    order: 2,
    active: true,
    children: [
      { id: 'mi-all-diamonds', label: 'All Diamonds', href: '/diamonds', active: true },
      { id: 'mi-pink-diamonds', label: 'Pink Diamonds', href: '/diamonds/pink', active: true },
      { id: 'mi-white-diamonds', label: 'White Diamonds', href: '/diamonds/white', active: true },
      { id: 'mi-cyo', label: 'Create Your Own', href: '/create-your-own', active: true },
    ],
  },
  { id: 'mi-shop', label: 'Shop', href: '/shop', hasChildren: false, order: 3, active: true },
  {
    id: 'mi-wlg',
    label: 'Why Lab Grown',
    href: '/why-lab-grown',
    hasChildren: true,
    order: 4,
    active: true,
    children: [
      { id: 'mi-wlg-overview', label: 'Why Lab Grown', href: '/why-lab-grown', active: true },
      { id: 'mi-wlg-guide', label: 'Diamond Guide', href: '/diamond-guide', active: true },
      { id: 'mi-wlg-sourcing', label: 'Sourcing', href: '/sourcing', active: true },
    ],
  },
  { id: 'mi-about', label: 'About Caritas', href: '/about-us', hasChildren: false, order: 5, active: true },
  { id: 'mi-contact', label: 'Contact', href: '/contact', hasChildren: false, order: 6, active: true },
];

async function seed() {
  console.log('Seeding Firebase Firestore...');
  const batch = writeBatch(db);

  // Super Admin
  const adminRef = doc(db, `${PREFIX}adminUsers`, 'Caritas360');
  batch.set(adminRef, {
    username: 'Caritas360',
    email: 'caritas360@caritasluxury.com',
    role: 'owner',
    displayName: 'Caritas360 (Super Admin)',
    createdAt: serverTimestamp(),
  }, { merge: true });

  // Categories
  for (const cat of INITIAL_CATEGORIES) {
    const catRef = doc(collection(db, `${PREFIX}categories`));
    batch.set(catRef, { ...cat, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  // Products
  for (const prod of INITIAL_PRODUCTS) {
    const prodRef = doc(collection(db, `${PREFIX}products`));
    batch.set(prodRef, { ...prod, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  // Shop Settings
  batch.set(doc(db, `${PREFIX}settings`, 'shop'), { ...INITIAL_SHOP_SETTINGS, updatedAt: serverTimestamp() });

  // Website Content
  batch.set(doc(db, `${PREFIX}settings`, 'websiteContent'), { ...INITIAL_WEBSITE_CONTENT, updatedAt: serverTimestamp() });

  // Navigation
  batch.set(doc(db, `${PREFIX}settings`, 'navigation'), { items: INITIAL_NAVIGATION, updatedAt: serverTimestamp() });

  await batch.commit();
  console.log('Firebase seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
