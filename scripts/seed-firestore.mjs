// Migration and Seed script for Caritas Diamonds & Shop pages
// Run with node scripts/seed-firestore.mjs

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCdJCORNxXI14ZWF043rEwYeAB2xMm51Qk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "caritas-luxury-diamonds.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "caritas-luxury-diamonds",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "caritas-luxury-diamonds.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "105561760579",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:105561760579:web:03d30d060fbc373bf145f6"
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const PREFIX = process.env.NEXT_PUBLIC_COLLECTION_PREFIX || 'caritas_';

const ALL_DIAMONDS = [
  { name: 'Round Brilliant 1.02ct D VVS2', slug: 'rd-1-1-02-d-vvs2', shape: 'Round', carat: 1.02, cut: 'Super Ideal', color: 'D', clarity: 'VVS2', price: 5040, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download.jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 1 },
  { name: 'Round Brilliant 1.01ct F VS2', slug: 'rd-2-1-01-f-vs2', shape: 'Round', carat: 1.01, cut: 'Super Ideal', color: 'F', clarity: 'VS2', price: 3610, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(1).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 2 },
  { name: 'Round Brilliant 1.50ct H VS2', slug: 'rd-3-1-50-h-vs2', shape: 'Round', carat: 1.50, cut: 'Very Good', color: 'H', clarity: 'VS2', price: 13370, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(11).jpg', availability: 'available', quickShip: false, bestValue: false, published: true, popularRank: 3 },
  { name: 'Oval Brilliant 1.50ct G VS1', slug: 'ov-1-1-50-g-vs1', shape: 'Oval', carat: 1.50, cut: 'Super Ideal', color: 'G', clarity: 'VS1', price: 8130, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(2).jpg', availability: 'available', quickShip: true, bestValue: true, published: true, popularRank: 4 },
  { name: 'Oval Brilliant 1.50ct F VS2', slug: 'ov-2-1-50-f-vs2', shape: 'Oval', carat: 1.50, cut: 'Ideal', color: 'F', clarity: 'VS2', price: 10600, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(6).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 5 },
  { name: 'Oval Brilliant 1.00ct D VVS1', slug: 'ov-3-1-00-d-vvs1', shape: 'Oval', carat: 1.00, cut: 'Ideal', color: 'D', clarity: 'VVS1', price: 4440, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(7).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 6 },
  { name: 'Emerald Cut 1.50ct H VS2', slug: 'em-1-1-50-h-vs2', shape: 'Emerald', carat: 1.50, cut: 'Super Ideal', color: 'H', clarity: 'VS2', price: 5340, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(8).jpg', availability: 'available', quickShip: true, bestValue: true, published: true, popularRank: 7 },
  { name: 'Emerald Cut 1.55ct H VVS1', slug: 'em-2-1-55-h-vvs1', shape: 'Emerald', carat: 1.55, cut: 'Super Ideal', color: 'H', clarity: 'VVS1', price: 7970, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(5).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 8 },
  { name: 'Emerald Cut 1.02ct F VVS2', slug: 'em-3-1-02-f-vvs2', shape: 'Emerald', carat: 1.02, cut: 'Super Ideal', color: 'F', clarity: 'VVS2', price: 3130, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(10).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 9 },
  { name: 'Asscher Cut 1.52ct D IF', slug: 'ass-1-1-52-d-if', shape: 'Asscher', carat: 1.52, cut: 'Ideal', color: 'D', clarity: 'IF', price: 9400, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(3).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 10 },
  { name: 'Marquise Cut 1.20ct E VS1', slug: 'mar-1-1-20-e-vs1', shape: 'Marquise', carat: 1.20, cut: 'Ideal', color: 'E', clarity: 'VS1', price: 4890, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(4).jpg', availability: 'available', quickShip: true, bestValue: true, published: true, popularRank: 11 },
  { name: 'Cushion Cut 1.70ct G VVS2', slug: 'cush-1-1-70-g-vvs2', shape: 'Cushion', carat: 1.70, cut: 'Super Ideal', color: 'G', clarity: 'VVS2', price: 6420, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(7).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 12 },
  { name: 'Princess Cut 1.35ct D VS2', slug: 'prin-1-1-35-d-vs2', shape: 'Princess', carat: 1.35, cut: 'Ideal', color: 'D', clarity: 'VS2', price: 4150, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(3).jpg', availability: 'available', quickShip: true, bestValue: true, published: true, popularRank: 13 },
  { name: 'Pear Shape 1.25ct F VVS1', slug: 'pear-1-1-25-f-vvs1', shape: 'Pear', carat: 1.25, cut: 'Super Ideal', color: 'F', clarity: 'VVS1', price: 5200, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(9).jpg', availability: 'available', quickShip: false, bestValue: false, published: true, popularRank: 14 },
  { name: 'Radiant Cut 2.01ct E VVS2', slug: 'rad-1-2-01-e-vvs2', shape: 'Radiant', carat: 2.01, cut: 'Super Ideal', color: 'E', clarity: 'VVS2', price: 8900, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(8).jpg', availability: 'available', quickShip: true, bestValue: true, published: true, popularRank: 15 },
  { name: 'Heart Shape 1.10ct F VS1', slug: 'hrt-1-1-10-f-vs1', shape: 'Heart', carat: 1.10, cut: 'Very Good', color: 'F', clarity: 'VS1', price: 4750, origin: 'Natural', category: 'white', image: '/wp-content/uploads/diamond/download%20(10).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 16 },
  { name: 'Pink Round Brilliant 1.05ct', slug: 'pnk-1-1-05-pink-vvs2', shape: 'Round', carat: 1.05, cut: 'Super Ideal', color: 'Pink', clarity: 'VVS2', price: 5800, origin: 'Lab Grown', category: 'pink', image: '/wp-content/uploads/diamond/download%20(1).jpg', availability: 'available', quickShip: true, bestValue: true, published: true, popularRank: 17 },
  { name: 'Pink Oval Brilliant 1.45ct', slug: 'pnk-2-1-45-pink-vs1', shape: 'Oval', carat: 1.45, cut: 'Ideal', color: 'Pink', clarity: 'VS1', price: 7200, origin: 'Lab Grown', category: 'pink', image: '/wp-content/uploads/diamond/download%20(6).jpg', availability: 'available', quickShip: true, bestValue: false, published: true, popularRank: 18 },
  { name: 'Pink Emerald Cut 1.20ct', slug: 'pnk-3-1-20-pink-vvs1', shape: 'Emerald', carat: 1.20, cut: 'Super Ideal', color: 'Pink', clarity: 'VVS1', price: 6100, origin: 'Lab Grown', category: 'pink', image: '/wp-content/uploads/diamond/download%20(5).jpg', availability: 'available', quickShip: false, bestValue: false, published: true, popularRank: 19 },
];

const CATEGORIES = [
  { name: 'Diamond ring', slug: 'diamond-ring', description: 'Bespoke diamond engagement rings and fine bands handcrafted to perfection.', image: '/wp-content/uploads/shop page/banner-01.jpg', itemsCountText: '7 Items', textDark: false, displayOrder: 1, published: true, subcategories: ['Engagement Rings', 'Eternity Bands', 'Solitaire Rings', 'Halo Rings'] },
  { name: 'Diamond bracelets', slug: 'diamond-bracelets', description: 'Exquisite diamond tennis bracelets and luxury bangles.', image: '/wp-content/uploads/shop page/banner-02.jpg', itemsCountText: '3 Items', textDark: true, displayOrder: 2, published: true, subcategories: ['Tennis Bracelets', 'Bangles', 'Chain Bracelets'] },
  { name: 'Necklace sets', slug: 'necklace-sets', description: 'Stunning diamond pendants, collar necklaces, and matching luxury sets.', image: '/wp-content/uploads/shop page/bannerr-03.jpg', itemsCountText: '3 Items', textDark: false, displayOrder: 3, published: true, subcategories: ['Pendants', 'Chokers', 'Collar Sets'] },
  { name: 'Earrings', slug: 'earrings', description: 'Brilliant diamond studs, drop earrings, and huggies.', image: '/wp-content/uploads/shop page/banner-04.jpg', itemsCountText: '5 Items', textDark: false, displayOrder: 4, published: true, subcategories: ['Studs', 'Drops', 'Hoops', 'Huggies'] },
];

const PRODUCTS = [
  { name: 'Pink Morganite Butterfly Ring', slug: 'pink-morganite-butterfly-ring', category: 'Rings', price: 4200, salePrice: 5190, sku: 'RNG-MRG-001', stock: 5, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/pro-21-300x300.png', isMain: true, alt: 'Pink Morganite Butterfly Ring' }], isFeatured: true, isNewArrival: true, isTrending: true, badge: 'NEW', rating: 4.9, published: true },
  { name: 'Fancy Pink Drop Earrings', slug: 'fancy-pink-drop-earrings', category: 'Earrings', price: 2100, salePrice: 2599, sku: 'ERR-PNK-002', stock: 8, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/pro-03-300x300.jpg', isMain: true, alt: 'Fancy Pink Drop Earrings' }], isFeatured: true, isNewArrival: true, isTrending: true, badge: 'HOT', rating: 4.8, published: true },
  { name: 'Teal Drop Ring & Earring Set', slug: 'teal-drop-ring-earring-set', category: 'Rings', price: 3600, salePrice: null, sku: 'SET-TEL-003', stock: 4, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/pro-05-300x300.jpg', isMain: true, alt: 'Teal Drop Ring & Earring Set' }], isFeatured: true, isNewArrival: true, isTrending: true, badge: 'NEW', rating: 4.9, published: true },
  { name: 'Pink Cluster Necklace', slug: 'pink-cluster-necklace', category: 'Necklaces', price: 600, salePrice: null, sku: 'NCK-CLS-004', stock: 12, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/pro-04-300x300.jpg', isMain: true, alt: 'Pink Cluster Necklace' }], isFeatured: false, isNewArrival: true, isTrending: true, badge: null, rating: 4.7, published: true },
  { name: 'Emerald Serpentine Ring', slug: 'emerald-serpentine-ring', category: 'Rings', price: 4800, salePrice: null, sku: 'RNG-SRF-005', stock: 3, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/pro-07-300x300.jpg', isMain: true, alt: 'Emerald Serpentine Ring' }], isFeatured: true, isNewArrival: true, isTrending: true, badge: 'TRENDING', rating: 5.0, published: true },
  { name: 'Emerald Eternity Band', slug: 'emerald-eternity-band', category: 'Rings', price: 2800, salePrice: null, sku: 'BND-EME-006', stock: 6, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/banner-01.jpg', isMain: true, alt: 'Emerald Eternity Band' }], isFeatured: false, isNewArrival: true, isTrending: true, badge: null, rating: 4.8, published: true },
  { name: 'Diamond Pavé Band', slug: 'diamond-pave-band', category: 'Bracelets', price: 900, salePrice: null, sku: 'BND-PAV-007', stock: 15, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/banner-02.jpg', isMain: true, alt: 'Diamond Pavé Band' }], isFeatured: false, isNewArrival: false, isTrending: true, badge: null, rating: 4.9, published: true },
  { name: 'Rainbow Gemstone Huggies', slug: 'rainbow-gemstone-huggies', category: 'Earrings', price: 1250, salePrice: null, sku: 'ERR-RNB-008', stock: 9, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/banner-04.jpg', isMain: true, alt: 'Rainbow Gemstone Huggies' }], isFeatured: false, isNewArrival: false, isTrending: true, badge: 'BESTSELLER', rating: 4.9, published: true },
  { name: 'Sapphire Collar Necklace Set', slug: 'sapphire-collar-necklace-set', category: 'Necklaces', price: 3400, salePrice: null, sku: 'SET-SPH-009', stock: 2, availability: 'in_stock', images: [{ url: '/wp-content/uploads/shop page/bannerr-03.jpg', isMain: true, alt: 'Sapphire Collar Necklace Set' }], isFeatured: true, isNewArrival: false, isTrending: true, badge: null, rating: 5.0, published: true },
];

const SHOP_SETTINGS = {
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

async function runSeed() {
  console.log(`Starting Firestore Seeding with prefix "${PREFIX}"...`);
  const batch = writeBatch(db);

  // 1. Diamonds
  console.log(`Seeding ${ALL_DIAMONDS.length} diamonds into ${PREFIX}diamonds...`);
  for (const diamond of ALL_DIAMONDS) {
    const docRef = doc(db, `${PREFIX}diamonds`, diamond.slug);
    batch.set(docRef, { ...diamond, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  }

  // 2. Categories
  console.log(`Seeding ${CATEGORIES.length} categories into ${PREFIX}categories...`);
  for (const cat of CATEGORIES) {
    const docRef = doc(db, `${PREFIX}categories`, cat.slug);
    batch.set(docRef, { ...cat, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  }

  // 3. Products
  console.log(`Seeding ${PRODUCTS.length} products into ${PREFIX}products...`);
  for (const prod of PRODUCTS) {
    const docRef = doc(db, `${PREFIX}products`, prod.slug);
    batch.set(docRef, { ...prod, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  }

  // 4. Shop Settings
  console.log(`Setting shop configuration in ${PREFIX}settings/shop...`);
  const shopRef = doc(db, `${PREFIX}settings`, 'shop');
  batch.set(shopRef, { ...SHOP_SETTINGS, updatedAt: serverTimestamp() }, { merge: true });

  await batch.commit();
  console.log('✅ Firestore Seed Complete! All collections successfully populated.');
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
