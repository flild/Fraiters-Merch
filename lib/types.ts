export type ProductCategory = 'all' | 'stands' | 'keychains' | 'stickers' | 'pins' | 'apparel' | 'prints';

export type AppSection = 'home' | 'catalog' | 'shelves' | 'delivery' | 'reviews' | 'faq' | 'admin';

export type ViewMode = 'sections' | 'full';

export interface OrderRecord {
  id: string;
  date: string;
  items: CartItem[];
  values: OrderFormValues;
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'completed';
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  isPreorder?: boolean;
  stockCount?: number;
  badge?: string;
  image: string;
  fallbackGradient: string;
  description: string;
  size: string;
  material: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface ShelfLocation {
  id: string;
  city: string;
  storeName: string;
  address: string;
  metro?: string;
  shelfNumber: string;
  workingHours: string;
  statusText: string;
  itemsAvailable: string[];
  yandexMapUrl?: string;
}

export interface Review {
  id: string;
  author: string;
  handle?: string;
  date: string;
  rating: number;
  text: string;
  productName: string;
  verified: boolean;
  avatarBg: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface OrderFormValues {
  fullName: string;
  telegramUsername: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  deliveryMethod: 'cdek' | 'post' | 'shelf';
  paymentMethod: 'card' | 'sbp';
  comment?: string;
}
