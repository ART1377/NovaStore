// src/constants/constants.ts
export const PRODUCTS_PAGE_SIZE = 12;
export const ADMIN_LIST_PAGE_SIZE = 25;
export const MAX_PRODUCT_IMAGES = 12;
export const MAX_PRODUCT_VARIANTS = 30;
export const MAX_CART_QUANTITY = 50;
export const MAX_SEARCH_LENGTH = 80;
export const MIN_PASSWORD_LENGTH = 8;
export const SEARCH_DEBOUNCE_MS = 350;
export const SUGGESTION_MIN_LENGTH = 2;
export const SUGGESTION_DEBOUNCE_MS = 250;
export const QUERY_STALE_TIME_MS = 60_000;
export const SUGGESTION_STALE_TIME_MS = 30_000;
export const SUGGESTION_GC_TIME_MS = 5 * 60_000;
export const NOTIFICATION_POLL_INTERVAL_MS = 30_000;
export const API_TIMEOUT_MS = 12_000;
export const LOW_STOCK_THRESHOLD = 5;
export const FREE_SHIPPING_THRESHOLD = 20_000_000;
export const RELATED_PRODUCT_LIMIT = 4;
export const SEARCH_SUGGESTION_LIMIT = 6;
export const PRODUCT_GRID_SKELETON_COUNT = 8;
export const ADMIN_DASHBOARD_LOW_STOCK_LIMIT = 6;
export const ADMIN_DASHBOARD_TOP_PRODUCTS_LIMIT = 5;
export const ADMIN_DASHBOARD_RECENT_DAYS = 7;
export const ADMIN_DASHBOARD_REVENUE_ROW_LIMIT = 100;
export const ADMIN_USER_ACTIVITY_LIMIT = 20;
export const HOME_FEATURED_LIMIT = 4;
export const HOME_NEWEST_LIMIT = 8;
export const HOME_DISCOUNTED_LIMIT = 4;
export const HOME_CATEGORY_LIMIT = 6;
export const HOME_BEST_SELLER_LIMIT = 5;
export const HOME_PLACEMENT_LIMITS = {
  HERO_PRODUCT: 1,
  FEATURED_PRODUCTS: 4,
  DISCOUNTED_PRODUCTS: 4,
  BEST_SELLERS: 5,
  NEWEST_PRODUCTS: 8,
} as const;
export const HOME_PLACEMENT_SLOTS = Object.keys(HOME_PLACEMENT_LIMITS) as Array<
  keyof typeof HOME_PLACEMENT_LIMITS
>;

export const SHIPPING_COSTS = {
  STANDARD: 799,
  EXPRESS: 1499,
  FREE: 0,
} as const;

export const PRICE_FILTER_RANGE = {
  MIN: 0,
  MAX: 300_000_000,
  STEP: 10_000_000,
} as const;

export const ORDER_STATUSES = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;
export const PAYMENT_STATUSES = [
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
] as const;
export const SHIPPING_STATUSES = [
  'PENDING',
  'SHIPPED',
  'DELIVERED',
  'RETURNED',
] as const;

export const ORDER_STATUS_LABELS = {
  PENDING: 'در انتظار',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
} as const;

export const PAYMENT_STATUS_LABELS = {
  PENDING: 'در انتظار پرداخت',
  PAID: 'پرداخت شده',
  FAILED: 'ناموفق',
  REFUNDED: 'مسترد شده',
} as const;

export const SHIPPING_STATUS_LABELS = {
  PENDING: 'آماده‌سازی',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  RETURNED: 'مرجوع شده',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type ShippingStatus = (typeof SHIPPING_STATUSES)[number];

export const PRODUCT_STATUSES = ['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  PUBLISHED: 'منتشر شده',
  DRAFT: 'پیش‌نویس',
  ARCHIVED: 'آرشیو',
} as const;

export const STATUS_LABELS = {
  ...ORDER_STATUS_LABELS,
  ...PAYMENT_STATUS_LABELS,
  ...SHIPPING_STATUS_LABELS,
  ...PRODUCT_STATUS_LABELS,
} as const;
