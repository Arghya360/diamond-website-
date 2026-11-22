export interface ProductImage {
  url: string;
  alt?: string;
  isMain?: boolean;
  order?: number;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Product {
  id?: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number | null;
  sku?: string;
  stock: number;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  weight?: string;
  images: ProductImage[];
  specifications?: ProductSpecification[];
  attributes?: Record<string, string>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  badge?: 'NEW' | 'HOT' | 'TRENDING' | 'BESTSELLER' | null;
  rating?: number;
  reviewCount?: number;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemsCountText?: string;
  textDark?: boolean;
  displayOrder: number;
  published: boolean;
  subcategories?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface ShopSettings {
  id?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  bannerImage?: string;
  announcementText?: string;
  defaultSorting?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  productsPerPage?: number;
  enableFilters?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: any;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  badge?: string;
  order: number;
  active: boolean;
}

export interface WebsiteSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  active: boolean;
}

export interface WebsiteContent {
  id?: string;
  slides?: WebsiteSlide[];
  promoBanners?: PromotionalBanner[];
  brandLogos?: { src: string; alt: string; order: number }[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialPinterest?: string;
  socialYoutube?: string;
  updatedAt?: any;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  hasChildren: boolean;
  order: number;
  active: boolean;
  children?: {
    id: string;
    label: string;
    href: string;
    active: boolean;
  }[];
}

export interface FooterConfig {
  id?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  copyrightText?: string;
  legalLinks?: { label: string; href: string }[];
  customerServiceLinks?: { label: string; href: string }[];
  updatedAt?: any;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  inquiryMessage?: string;
  type: 'customer' | 'inquiry';
  createdAt?: any;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'super_admin' | 'admin' | 'editor';
  createdAt?: any;
  lastLogin?: any;
}
