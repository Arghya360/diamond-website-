import { collection, doc, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from './client';
import type { Product, Category, ShopSettings, WebsiteContent, NavigationItem } from '../../types/admin';

export const INITIAL_CATEGORIES: Category[] = [
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

export const INITIAL_PRODUCTS: Product[] = [
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
    specifications: [
      { name: 'Chain Length', value: '16-18 inches' },
      { name: 'Metal', value: '18k Yellow Gold' },
    ],
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
    specifications: [
      { name: 'Center Stone', value: '2.01 ct Emerald Cut' },
      { name: 'Color', value: 'E' },
      { name: 'Clarity', value: 'VVS1' },
    ],
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
    specifications: [
      { name: 'Total Carats', value: '3.50 ctw' },
      { name: 'Metal', value: 'Platinum' },
    ],
    isFeatured: false,
    isNewArrival: true,
    isTrending: true,
    badge: null,
    rating: 4.8,
    published: true,
  },
  {
    name: 'Diamond Pavé Band',
    slug: 'diamond-pave-band',
    category: 'Bracelets',
    subcategory: 'Bangles',
    description: 'Classic micro-pavé diamond wedding and stacking band with round brilliant lab-grown diamonds.',
    shortDescription: 'Micro-pavé diamond band.',
    price: 900,
    salePrice: null,
    sku: 'BND-PAV-007',
    stock: 15,
    availability: 'in_stock',
    weight: '1.9g',
    images: [{ url: '/wp-content/uploads/shop page/banner-02.jpg', isMain: true, alt: 'Diamond Pavé Band' }],
    isFeatured: false,
    isNewArrival: false,
    isTrending: true,
    badge: null,
    rating: 4.9,
    published: true,
  },
  {
    name: 'Rainbow Gemstone Huggies',
    slug: 'rainbow-gemstone-huggies',
    category: 'Earrings',
    subcategory: 'Huggies',
    description: 'Playful yet sophisticated multi-color gemstones set along a diamond hoop frame.',
    shortDescription: 'Rainbow gemstone huggie earrings.',
    price: 1250,
    salePrice: null,
    sku: 'ERR-RNB-008',
    stock: 9,
    availability: 'in_stock',
    weight: '2.0g',
    images: [{ url: '/wp-content/uploads/shop page/banner-04.jpg', isMain: true, alt: 'Rainbow Gemstone Huggies' }],
    isFeatured: false,
    isNewArrival: false,
    isTrending: true,
    badge: 'BESTSELLER',
    rating: 4.9,
    published: true,
  },
  {
    name: 'Sapphire Collar Necklace Set',
    slug: 'sapphire-collar-necklace-set',
    category: 'Necklaces',
    subcategory: 'Collar Sets',
    description: 'Royal sapphire and diamond necklace collar paired with matching drop earrings for high-glamour occasions.',
    shortDescription: 'Sapphire and diamond collar necklace set.',
    price: 3400,
    salePrice: null,
    sku: 'SET-SPH-009',
    stock: 2,
    availability: 'in_stock',
    weight: '8.4g',
    images: [{ url: '/wp-content/uploads/shop page/bannerr-03.jpg', isMain: true, alt: 'Sapphire Collar Necklace Set' }],
    isFeatured: true,
    isNewArrival: false,
    isTrending: true,
    badge: null,
    rating: 5.0,
    published: true,
  },
];

export const INITIAL_SHOP_SETTINGS: ShopSettings = {
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

export const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
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

export const INITIAL_NAVIGATION: NavigationItem[] = [
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

export async function seedAllWebsiteData(overwrite: boolean = false): Promise<{ success: boolean; message: string }> {
  try {
    const productsExisting = await getDocs(collection(db, 'products'));
    if (!overwrite && !productsExisting.empty) {
      return { success: true, message: 'Firebase already has product data. Skipping overwrite.' };
    }

    const batch = writeBatch(db);

    // Seed super admin
    const adminRef = doc(db, 'adminUsers', 'arghyabiswas0792@gmail.com');
    batch.set(adminRef, {
      email: 'arghyabiswas0792@gmail.com',
      role: 'owner',
      displayName: 'Arghya Biswas',
      name: 'Arghya Biswas',
      createdAt: serverTimestamp(),
    }, { merge: true });

    // Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      const catRef = doc(collection(db, 'categories'));
      batch.set(catRef, { ...cat, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }

    // Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      const prodRef = doc(collection(db, 'products'));
      batch.set(prodRef, { ...prod, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }

    // Seed Shop Settings
    const shopRef = doc(db, 'settings', 'shop');
    batch.set(shopRef, { ...INITIAL_SHOP_SETTINGS, updatedAt: serverTimestamp() });

    // Seed Website Content
    const contentRef = doc(db, 'settings', 'websiteContent');
    batch.set(contentRef, { ...INITIAL_WEBSITE_CONTENT, updatedAt: serverTimestamp() });

    // Seed Navigation
    const navRef = doc(db, 'settings', 'navigation');
    batch.set(navRef, { items: INITIAL_NAVIGATION, updatedAt: serverTimestamp() });

    await batch.commit();
    return { success: true, message: 'Successfully seeded all website data into Firebase!' };
  } catch (error: any) {
    console.error('Error seeding data into Firebase:', error);
    return { success: false, message: error.message || 'Error seeding Firebase data' };
  }
}
