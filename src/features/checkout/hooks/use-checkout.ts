// src/features/checkout/hooks/use-checkout.ts
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ShippingMethod } from '../types/checkout-types';
import { useSubmitCheckout } from './use-checkout-actions';
import { useCheckoutAddress } from './use-checkout-address';
import { useCheckoutCoupon } from './use-checkout-coupon';
import { useCheckoutPricing } from './use-checkout-pricing';

type UseCheckoutParams = {
  addresses: { id: string; isDefault: boolean }[];
  cartItems: {
    quantity: number;
    variant: { price: number | null } | null;
    product: { price: number };
  }[];
};

export function useCheckout({ addresses, cartItems }: UseCheckoutParams) {
  const router = useRouter();
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>('STANDARD');
  const checkoutMutation = useSubmitCheckout();

  const { addressId, setSelectedAddress } = useCheckoutAddress(addresses);
  const couponHook = useCheckoutCoupon();
  const pricing = useCheckoutPricing({
    cartItems,
    shippingMethod,
    coupon: couponHook.coupon,
  });

  // One key per checkout session: retries from the same flow reuse it so
  // the server can dedupe; a fresh mount (after success) starts a new key.
  const idempotencyKeyRef = useRef<string | null>(null);
  const getIdempotencyKey = () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `ns-${Date.now().toString(36)}-${Math.random()
              .toString(36)
              .slice(2, 10)}`;
    }
    return idempotencyKeyRef.current;
  };

  const changeShipping = (nextMethod: ShippingMethod) => {
    setShippingMethod(nextMethod);
    // Shipping cost is part of the coupon's total, so re-validate.
    if (couponHook.coupon) {
      couponHook.validate(couponHook.coupon.code, nextMethod);
    }
  };

  const submit = () => {
    if (!addressId) return;
    checkoutMutation.mutate({
      addressId,
      shippingMethod,
      couponCode: couponHook.coupon?.code || undefined,
      idempotencyKey: getIdempotencyKey(),
    });
  };

  const goToProducts = () => router.push('/products');

  return {
    addressId,
    setSelectedAddress,
    shippingMethod,
    changeShipping,
    couponCode: couponHook.couponCode,
    setCouponCode: couponHook.setCouponCode,
    coupon: couponHook.coupon,
    couponMessage: couponHook.couponMessage,
    couponMessageType: couponHook.couponMessageType,
    couponMutation: couponHook.couponMutation,
    applyCoupon: () => couponHook.apply(shippingMethod),
    clearCoupon: couponHook.clear,
    ...pricing,
    checkoutMutation,
    submit,
    goToProducts,
  };
}
