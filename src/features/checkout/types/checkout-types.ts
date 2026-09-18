// src/features/checkout/types/checkout-types.ts
export type ShippingMethod = 'STANDARD' | 'EXPRESS' | 'FREE';

export type CheckoutAddress = {
  id: string;
  title: string;
  recipient: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  street: string;
  isDefault: boolean;
};

export type CheckoutItem = {
  id: string;
  quantity: number;
  product: { id: string; name: string };
  variant: {
    id: string;
    name: string;
    price: number | null;
    sku: string;
  } | null;
};

export type CouponPreview = {
  code: string;
  discount: number;
  shippingCost: number;
  subtotal: number;
  total: number;
};
