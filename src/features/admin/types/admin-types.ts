// src/features/admin/types/admin-types.ts
import type {
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
  ProductStatus,
} from '@/constants/constants';

export type AdminResourceKind = 'categories' | 'brands';
export type AdminHomePlacementSlot =
  | 'HERO_PRODUCT'
  | 'FEATURED_PRODUCTS'
  | 'DISCOUNTED_PRODUCTS'
  | 'BEST_SELLERS'
  | 'NEWEST_PRODUCTS';

export type AdminResource = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count?: { products: number };
};

export type AdminStats = {
  totals: { users: number; products: number; orders: number; revenue: number };
  lowStock: { id: string; stock: number; product: { name: string } }[];
  statusCounts: Partial<Record<OrderStatus, number>>;
  topProducts: { name: string; quantity: number }[];
  dailyRevenue: { date: string; value: number }[];
};

export type AdminProduct = {
  id: string;
  name: string;
  price: number;
  status: ProductStatus;
  featured: boolean;
  category: { name: string };
  brand: { name: string } | null;
  variants: { stock: number }[];
  images: { url: string }[];
  _count: { reviews: number; orderItems: number };
};

export type AdminProductEditor = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  brandId: string | null;
  status: ProductStatus;
  featured: boolean;
  variants: {
    id: string;
    sku: string;
    name: string;
    color: string | null;
    size: string | null;
    price: number | null;
    stock: number;
  }[];
  images: {
    id: string;
    url: string;
    publicId: string | null;
    bytes: number | null;
  }[];
};

export type AdminProductOption = {
  id: string;
  name: string;
  isActive: boolean;
};

export type AdminProductPayload = {
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  brandId: string | null;
  status: ProductStatus;
  featured: boolean;
  images: { url: string; publicId?: string | null; bytes?: number | null }[];
  variants: Array<{
    id?: string;
    sku: string;
    name: string;
    color: string | null;
    size: string | null;
    price: number | null;
    stock: number;
  }>;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  createdAt: string;
  user: { name: string | null; email: string | null };
  items: { id: string; name: string; quantity: number; unitPrice: number }[];
  shipment?: { trackingNumber: string | null } | null;
};

export type AdminOrderDetail = {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  createdAt: string;
  user: { name: string | null; email: string | null };
  address: {
    recipient: string;
    phone: string;
    city: string;
    state: string;
    postalCode: string;
    street: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    variant: { name: string; sku: string } | null;
  }[];
  payment: {
    status: string;
    provider: string;
    transactionId: string | null;
  } | null;
  shipment: {
    method: string;
    trackingNumber: string | null;
    status: string;
  } | null;
};

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count: { orders: number; reviews: number };
};

export type AdminUserDetail = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  addresses: {
    id: string;
    title: string;
    recipient: string;
    phone: string;
    city: string;
    state: string;
    postalCode: string;
    street: string;
    isDefault: boolean;
  }[];
  orders: {
    id: string;
    orderNumber: string;
    total: number;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    product: { name: string; slug: string };
  }[];
  _count: { orders: number; reviews: number; notifications: number };
};

export type AdminReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
  product: { name: string; slug: string };
};

export type AdminCoupon = {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder: number;
  usedCount: number;
  usageLimit: number | null;
  expiresAt: string | null;
  isActive: boolean;
};

export type AdminCouponPayload = {
  code: string;
  type: AdminCoupon['type'];
  value: number;
  minOrder: number;
  usageLimit: number | null;
  expiresAt: string | null;
  isActive: boolean;
};

export type InventoryVariant = {
  id: string;
  sku: string;
  name: string;
  color: string | null;
  size: string | null;
  stock: number;
  product: { name: string; status: ProductStatus; images: { url: string }[] };
};

export type InventoryUpdate = { variantId: string; stock: number };

export type AdminHomeProduct = {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  image: string | null;
};

export type AdminHomePlacement = {
  slot: AdminHomePlacementSlot;
  productIds: string[];
};

export type AdminHomeData = {
  products: AdminHomeProduct[];
  placements: Array<AdminHomePlacement & { limit: number }>;
};
