// src/features/checkout/hooks/use-checkout-pricing.ts
'use client';

import { FREE_SHIPPING_THRESHOLD, SHIPPING_COSTS } from '@/constants/constants';
import { useMemo } from 'react';
import type { CouponPreview, ShippingMethod } from '../types/checkout-types';

type CartLine = {
  quantity: number;
  variant: { price: number | null } | null;
  product: { price: number };
};

export function useCheckoutPricing({
  cartItems,
  shippingMethod,
  coupon,
}: {
  cartItems: CartLine[];
  shippingMethod: ShippingMethod;
  coupon: CouponPreview | null;
}) {
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (item.variant?.price ?? item.product.price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const discount = coupon?.discount ?? 0;
  const hasFreeShipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD;

  const shippingCost = coupon
    ? coupon.shippingCost
    : shippingMethod === 'FREE' && hasFreeShipping
      ? 0
      : SHIPPING_COSTS[shippingMethod];

  const total = subtotal - discount + shippingCost;

  return { subtotal, discount, hasFreeShipping, shippingCost, total };
}
