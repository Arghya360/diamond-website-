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
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './client';
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
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);

    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const snapshot = await getDocs(q);
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
    console.error('Error fetching products from Firebase:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return normalizeProduct(docSnap.id, docSnap.data());
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<string> {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}

// ─── Categories Service ───────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  try {
    const catRef = collection(db, 'categories');
    const snapshot = await getDocs(catRef);
    const categories: Category[] = [];
    snapshot.forEach((docSnap) => {
      categories.push(normalizeCategory(docSnap.id, docSnap.data()));
    });
    return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.error('Error fetching categories from Firebase:', error);
    return [];
  }
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const catRef = collection(db, 'categories');
  const docRef = await addDoc(catRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
}

// ─── Shop Settings ─────────────────────────────────────────────────
export async function getShopSettings(): Promise<ShopSettings | null> {
  try {
    const docRef = doc(db, 'settings', 'shop');
    let docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      docSnap = await getDoc(doc(db, 'shopSettings', 'general'));
    }
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as ShopSettings) };
  } catch (error) {
    console.error('Error fetching shop settings:', error);
    return null;
  }
}

export async function updateShopSettings(data: Partial<ShopSettings>): Promise<void> {
  const docRef = doc(db, 'settings', 'shop');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Website Content (Hero slides, promo, contact) ─────────────────
export async function getWebsiteContent(): Promise<WebsiteContent | null> {
  try {
    const docRef = doc(db, 'settings', 'websiteContent');
    let docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      docSnap = await getDoc(doc(db, 'websiteContent', 'general'));
    }
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as WebsiteContent) };
  } catch (error) {
    console.error('Error fetching website content:', error);
    return null;
  }
}

export async function updateWebsiteContent(data: Partial<WebsiteContent>): Promise<void> {
  const docRef = doc(db, 'settings', 'websiteContent');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Navigation Service ───────────────────────────────────────────
export async function getNavigation(): Promise<NavigationItem[]> {
  try {
    const docRef = doc(db, 'settings', 'navigation');
    let docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      docSnap = await getDoc(doc(db, 'navigation', 'mainMenu'));
    }
    if (docSnap.exists() && docSnap.data().items) {
      return docSnap.data().items as NavigationItem[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return [];
  }
}

export async function updateNavigation(items: NavigationItem[]): Promise<void> {
  const docRef = doc(db, 'settings', 'navigation');
  await setDoc(docRef, { items, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Footer Config ─────────────────────────────────────────────────
export async function getFooterConfig(): Promise<FooterConfig | null> {
  try {
    const docRef = doc(db, 'settings', 'footer');
    let docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      docSnap = await getDoc(doc(db, 'footer', 'config'));
    }
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as FooterConfig) };
  } catch (error) {
    console.error('Error fetching footer config:', error);
    return null;
  }
}

export async function updateFooterConfig(data: Partial<FooterConfig>): Promise<void> {
  const docRef = doc(db, 'settings', 'footer');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Orders Service ───────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...(docSnap.data() as Order) });
    });
    return orders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(
  id: string,
  orderStatus: Order['orderStatus'],
  paymentStatus?: Order['paymentStatus']
): Promise<void> {
  const docRef = doc(db, 'orders', id);
  const updateData: any = { orderStatus, updatedAt: serverTimestamp() };
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  await updateDoc(docRef, updateData);
}

// ─── Customers Service ────────────────────────────────────────────
export async function getCustomers(): Promise<Customer[]> {
  try {
    const custRef = collection(db, 'customers');
    const snapshot = await getDocs(custRef);
    const customers: Customer[] = [];
    snapshot.forEach((docSnap) => {
      customers.push({ id: docSnap.id, ...(docSnap.data() as Customer) });
    });
    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

// ─── Admin Users & Role Verification ──────────────────────────────
export async function checkIsAdmin(email?: string | null, uid?: string | null): Promise<boolean> {
  if (!email && !uid) return false;
  // Super admin fallback for configured owner
  if (email === 'arghyabiswas0792@gmail.com') return true;

  try {
    if (email) {
      const q = query(collection(db, 'adminUsers'), where('email', '==', email));
      const snap = await getDocs(q);
      if (!snap.empty) return true;
      const emailDoc = await getDoc(doc(db, 'admins', email));
      if (emailDoc.exists()) return true;
    }
    if (uid) {
      const uidDoc = await getDoc(doc(db, 'adminUsers', uid));
      if (uidDoc.exists()) return true;
      const uidDocLegacy = await getDoc(doc(db, 'admins', uid));
      if (uidDocLegacy.exists()) return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return email === 'arghyabiswas0792@gmail.com';
  }
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const adminsRef = collection(db, 'adminUsers');
    const snapshot = await getDocs(adminsRef);
    const admins: AdminUser[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      admins.push({
        uid: docSnap.id,
        email: d.email || '',
        displayName: d.name || d.displayName || d.email?.split('@')[0] || 'Admin',
        role: d.role === 'owner' ? 'super_admin' : (d.role || 'admin'),
        createdAt: d.createdAt,
      });
    });
    return admins;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

export async function addAdminUser(
  email: string,
  role: AdminUser['role'] = 'admin',
  displayName?: string
): Promise<void> {
  const docRef = doc(db, 'adminUsers', email);
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
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${folder}/${Date.now()}-${cleanName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
