import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './client';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SHOP_SETTINGS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_NAVIGATION,
} from './seed-data';
import type {
  Product,
  Category,
  ShopSettings,
  WebsiteContent,
  NavigationItem,
  FooterConfig,
  Order,
  Customer,
  AdminUser,
} from '../../types/admin';

// ─── Collection Isolation / Namespacing ───────────────────────────
// Prefix ensures complete isolation so that if this Firebase account
// also hosts another website, this website NEVER touches or picks up
// that website's collections or data.
export const PREFIX = process.env.NEXT_PUBLIC_COLLECTION_PREFIX || 'caritas_';

export const COLLECTIONS = {
  products: `${PREFIX}products`,
  categories: `${PREFIX}categories`,
  settings: `${PREFIX}settings`,
  orders: `${PREFIX}orders`,
  customers: `${PREFIX}customers`,
  adminUsers: `${PREFIX}adminUsers`,
  media: `${PREFIX}media`,
};

// ─── Normalizers ──────────────────────────────────────────────────
function normalizeProduct(id: string, raw: any): Product {
  const images = Array.isArray(raw.images)
    ? raw.images.map((img: any) =>
        typeof img === 'string'
          ? { url: img, isMain: false, alt: raw.name || '' }
          : { url: img.url || '', isMain: Boolean(img.isMain), alt: img.alt || raw.name || '' }
      )
    : [];

  const isPublished =
    raw.published !== undefined
      ? Boolean(raw.published)
      : raw.status === 'published' || raw.status === undefined;

  return {
    id,
    name: raw.name || 'Untitled Product',
    slug: raw.slug || id,
    category: raw.category || 'General',
    subcategory: raw.subcategory || '',
    description: raw.description || '',
    shortDescription: raw.shortDescription || '',
    price: typeof raw.price === 'number' ? raw.price : (raw.priceAed || 0),
    salePrice: raw.salePrice || null,
    sku: raw.sku || raw.numericId?.toString() || id,
    stock: raw.stock !== undefined ? Number(raw.stock) : 10,
    availability: raw.availability || (raw.stock > 0 ? 'in_stock' : 'out_of_stock'),
    weight: raw.weight || (raw.grams ? `${raw.grams}g` : ''),
    images,
    specifications: raw.specifications || [],
    attributes: raw.attributes || [],
    isFeatured: Boolean(raw.featured ?? raw.isFeatured),
    isNewArrival: Boolean(raw.isNewArrival ?? true),
    isTrending: Boolean(raw.isTrending ?? true),
    badge: raw.badge || (raw.featured ? 'FEATURED' : null),
    rating: raw.rating || 5.0,
    published: isPublished,
    seoTitle: raw.seoTitle || raw.name,
    seoDescription: raw.seoDescription || raw.description,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function normalizeCategory(id: string, raw: any): Category {
  return {
    id,
    name: raw.name || 'Category',
    slug: raw.slug || id,
    description: raw.description || '',
    image: raw.image || raw.imageUrl || '/wp-content/uploads/shop page/banner-01.jpg',
    itemsCountText: raw.itemsCountText || `${raw.itemsCount || 0} Items`,
    textDark: Boolean(raw.textDark),
    displayOrder: raw.displayOrder ?? raw.order ?? 0,
    published: raw.published !== undefined ? Boolean(raw.published) : raw.active !== false,
    subcategories: raw.subcategories || [],
  };
}

// ─── Products Service ─────────────────────────────────────────────
export async function getProducts(options?: {
  category?: string;
  publishedOnly?: boolean;
  limitCount?: number;
}): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    let prods = (INITIAL_PRODUCTS as any[]).map((p, i) => ({ id: `init-p-${i + 1}`, ...p } as Product));
    if (options?.publishedOnly) prods = prods.filter((p) => p.published);
    if (options?.category && options.category !== 'All') {
      prods = prods.filter((p) => p.category?.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.limitCount) prods = prods.slice(0, options.limitCount);
    return prods;
  }

  try {
    const productsRef = collection(db, COLLECTIONS.products);
    let q = query(productsRef);
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // If new database is not seeded yet, fallback to default Caritas products
      let prods = (INITIAL_PRODUCTS as any[]).map((p, i) => ({ id: `init-p-${i + 1}`, ...p } as Product));
      if (options?.publishedOnly) prods = prods.filter((p) => p.published);
      if (options?.category && options.category !== 'All') {
        prods = prods.filter((p) => p.category?.toLowerCase() === options.category?.toLowerCase());
      }
      return prods;
    }

    let products: Product[] = [];
    snapshot.forEach((docSnap) => {
      products.push(normalizeProduct(docSnap.id, docSnap.data()));
    });

    if (options?.publishedOnly) {
      products = products.filter((p) => p.published);
    }
    if (options?.category && options.category !== 'All') {
      products = products.filter(
        (p) => p.category?.toLowerCase() === options.category?.toLowerCase()
      );
    }

    return products;
  } catch (error) {
    console.warn('Fallback to baseline products:', error);
    return (INITIAL_PRODUCTS as any[]).map((p, i) => ({ id: `init-p-${i + 1}`, ...p } as Product));
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured || !db) {
    const found = (INITIAL_PRODUCTS as any[]).find((p) => p.slug === id || p.id === id);
    return found ? ({ id, ...found } as Product) : null;
  }

  try {
    const docRef = doc(db, COLLECTIONS.products, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return normalizeProduct(docSnap.id, docSnap.data());
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<string> {
  if (!db) return `local-${Date.now()}`;
  const productsRef = collection(db, COLLECTIONS.products);
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.products, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.products, id);
  await deleteDoc(docRef);
}

// ─── Categories Service ───────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured || !db) {
    return (INITIAL_CATEGORIES as any[]).map((c, i) => ({ id: `init-cat-${i + 1}`, ...c } as Category));
  }

  try {
    const catRef = collection(db, COLLECTIONS.categories);
    const snapshot = await getDocs(catRef);
    if (snapshot.empty) {
      return (INITIAL_CATEGORIES as any[]).map((c, i) => ({ id: `init-cat-${i + 1}`, ...c } as Category));
    }
    const categories: Category[] = [];
    snapshot.forEach((docSnap) => {
      categories.push(normalizeCategory(docSnap.id, docSnap.data()));
    });
    return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.warn('Fallback to baseline categories:', error);
    return (INITIAL_CATEGORIES as any[]).map((c, i) => ({ id: `init-cat-${i + 1}`, ...c } as Category));
  }
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  if (!db) return `local-cat-${Date.now()}`;
  const catRef = collection(db, COLLECTIONS.categories);
  const docRef = await addDoc(catRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.categories, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.categories, id);
  await deleteDoc(docRef);
}

// ─── Shop Settings ─────────────────────────────────────────────────
export async function getShopSettings(): Promise<ShopSettings | null> {
  if (!isFirebaseConfigured || !db) {
    return { id: 'shop', ...INITIAL_SHOP_SETTINGS } as ShopSettings;
  }

  try {
    const docRef = doc(db, COLLECTIONS.settings, 'shop');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return { id: 'shop', ...INITIAL_SHOP_SETTINGS } as ShopSettings;
    }
    return { id: docSnap.id, ...(docSnap.data() as ShopSettings) };
  } catch (error) {
    return { id: 'shop', ...INITIAL_SHOP_SETTINGS } as ShopSettings;
  }
}

export async function updateShopSettings(data: Partial<ShopSettings>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.settings, 'shop');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Website Content (Hero slides, promo, contact) ─────────────────
export async function getWebsiteContent(): Promise<WebsiteContent | null> {
  if (!isFirebaseConfigured || !db) {
    return { id: 'websiteContent', ...INITIAL_WEBSITE_CONTENT } as WebsiteContent;
  }

  try {
    const docRef = doc(db, COLLECTIONS.settings, 'websiteContent');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return { id: 'websiteContent', ...INITIAL_WEBSITE_CONTENT } as WebsiteContent;
    }
    return { id: docSnap.id, ...(docSnap.data() as WebsiteContent) };
  } catch (error) {
    return { id: 'websiteContent', ...INITIAL_WEBSITE_CONTENT } as WebsiteContent;
  }
}

export async function updateWebsiteContent(data: Partial<WebsiteContent>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.settings, 'websiteContent');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Navigation Service ───────────────────────────────────────────
export async function getNavigation(): Promise<NavigationItem[]> {
  if (!isFirebaseConfigured || !db) {
    return INITIAL_NAVIGATION as NavigationItem[];
  }

  try {
    const docRef = doc(db, COLLECTIONS.settings, 'navigation');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().items) {
      return docSnap.data().items as NavigationItem[];
    }
    return INITIAL_NAVIGATION as NavigationItem[];
  } catch (error) {
    return INITIAL_NAVIGATION as NavigationItem[];
  }
}

export async function updateNavigation(items: NavigationItem[]): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.settings, 'navigation');
  await setDoc(docRef, { items, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Footer Config ─────────────────────────────────────────────────
export async function getFooterConfig(): Promise<FooterConfig | null> {
  if (!isFirebaseConfigured || !db) {
    return {
      id: 'footer',
      newsletterTitle: 'Join the Caritas Society',
      newsletterSubtitle: 'Receive private previews of rare creations and invitations to bespoke events.',
      copyrightText: '© 2026 Caritas Luxury. All Rights Reserved.',
      legalLinks: [
        { label: 'Delivery', href: '/delivery' },
        { label: 'Returns', href: '/returns' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    };
  }

  try {
    const docRef = doc(db, COLLECTIONS.settings, 'footer');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as FooterConfig) };
  } catch (error) {
    return null;
  }
}

export async function updateFooterConfig(data: Partial<FooterConfig>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.settings, 'footer');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Orders Service ───────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const ordersRef = collection(db, COLLECTIONS.orders);
    const snapshot = await getDocs(ordersRef);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...(docSnap.data() as Order) });
    });
    return orders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (error) {
    return [];
  }
}

export async function updateOrderStatus(
  id: string,
  orderStatus: Order['orderStatus'],
  paymentStatus?: Order['paymentStatus']
): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.orders, id);
  const updateData: any = { orderStatus, updatedAt: serverTimestamp() };
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  await updateDoc(docRef, updateData);
}

// ─── Customers Service ────────────────────────────────────────────
export async function getCustomers(): Promise<Customer[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const custRef = collection(db, COLLECTIONS.customers);
    const snapshot = await getDocs(custRef);
    const customers: Customer[] = [];
    snapshot.forEach((docSnap) => {
      customers.push({ id: docSnap.id, ...(docSnap.data() as Customer) });
    });
    return customers;
  } catch (error) {
    return [];
  }
}

// ─── Admin Users & Role Verification ──────────────────────────────
export async function checkIsAdmin(email?: string | null, uid?: string | null): Promise<boolean> {
  if (!email && !uid) return false;
  if (
    email === 'caritas360@caritasluxury.com' ||
    email === 'caritas360' ||
    email === 'arghyabiswas0792@gmail.com'
  ) {
    return true;
  }

  if (!isFirebaseConfigured || !db) {
    return true; // Local admin authorized
  }

  try {
    if (email) {
      const emailDoc = await getDoc(doc(db, COLLECTIONS.adminUsers, email));
      if (emailDoc.exists()) return true;
    }
    if (uid) {
      const uidDoc = await getDoc(doc(db, COLLECTIONS.adminUsers, uid));
      if (uidDoc.exists()) return true;
    }
    return false;
  } catch (error) {
    return true;
  }
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const defaultAdmin: AdminUser = {
    uid: 'caritas-admin-owner',
    email: 'Caritas360',
    displayName: 'Caritas360 (Super Admin)',
    role: 'super_admin',
  };

  if (!isFirebaseConfigured || !db) {
    return [defaultAdmin];
  }

  try {
    const adminsRef = collection(db, COLLECTIONS.adminUsers);
    const snapshot = await getDocs(adminsRef);
    if (snapshot.empty) return [defaultAdmin];

    const admins: AdminUser[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      admins.push({
        uid: docSnap.id,
        email: d.email || d.username || '',
        displayName: d.name || d.displayName || 'Admin',
        role: d.role === 'owner' ? 'super_admin' : (d.role || 'admin'),
        createdAt: d.createdAt,
      });
    });
    return admins;
  } catch (error) {
    return [defaultAdmin];
  }
}

export async function addAdminUser(
  email: string,
  role: AdminUser['role'] = 'admin',
  displayName?: string
): Promise<void> {
  if (!db) return;
  const docRef = doc(db, COLLECTIONS.adminUsers, email);
  await setDoc(docRef, {
    email,
    displayName: displayName || email.split('@')[0],
    role: role === 'super_admin' ? 'owner' : role,
    createdAt: serverTimestamp(),
  });
}

// ─── Storage Service ──────────────────────────────────────────────
export async function uploadFileToStorage(
  file: File,
  folder: string = 'products'
): Promise<string> {
  if (!storage) {
    // If storage is not connected yet, create a local preview URL
    return URL.createObjectURL(file);
  }
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${PREFIX}${folder}/${Date.now()}-${cleanName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
