// src/features/checkout/hooks/use-checkout.ts
'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CouponPreview, ShippingMethod } from '../types/checkout-types';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COSTS } from '@/constants/constants';
import { useCouponValidation, useSubmitCheckout } from './use-checkout-actions';

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
  const [selectedAddress, setSelectedAddress] = useState('');
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>('STANDARD');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<CouponPreview | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponMessageType, setCouponMessageType] = useState<
    'success' | 'error' | ''
  >('');
  const couponMutation = useCouponValidation();
  const checkoutMutation = useSubmitCheckout();

  const idempotencyKeyRef = useRef<string | null>(null);
  const getIdempotencyKey = () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `ns-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }
    return idempotencyKeyRef.current;
  };

  const addressId =
    selectedAddress ||
    addresses.find((address) => address.isDefault)?.id ||
    addresses[0]?.id ||
    '';

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (item.variant?.price ?? item.product.price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const hasFreeShipping =
    subtotal - (coupon?.discount ?? 0) >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = coupon
    ? coupon.shippingCost
    : shippingMethod === 'FREE' && hasFreeShipping
      ? 0
      : SHIPPING_COSTS[shippingMethod];
  const discount = coupon?.discount ?? 0;
  const total = subtotal - discount + shippingCost;

  const validateCoupon = (code: string, method: ShippingMethod) => {
    couponMutation.mutate(
      { code, shippingMethod: method },
      {
        onSuccess: (result) => {
          setCoupon(result);
          setCouponMessage('کد تخفیف با موفقیت اعمال شد.');
          setCouponMessageType('success');
        },
        onError: (error) => {
          setCoupon(null);
          setCouponMessage(
            error instanceof Error ? error.message : 'کد تخفیف معتبر نیست.',
          );
          setCouponMessageType('error');
        },
      },
    );
  };

  const changeShipping = (nextMethod: ShippingMethod) => {
    setShippingMethod(nextMethod);
    if (coupon) validateCoupon(coupon.code, nextMethod);
  };

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    if (!normalized) {
      setCoupon(null);
      setCouponMessage('کد تخفیف را وارد کنید.');
      setCouponMessageType('error');
      return;
    }
    setCouponCode(normalized);
    validateCoupon(normalized, shippingMethod);
  };

  const clearCoupon = () => {
    setCouponCode('');
    setCoupon(null);
    setCouponMessage('');
    setCouponMessageType('');
  };

  const submit = () => {
    if (!addressId) return;
    checkoutMutation.mutate({
      addressId,
      shippingMethod,
      couponCode: coupon?.code || undefined,
      idempotencyKey: getIdempotencyKey(),
    });
  };

  const goToProducts = () => router.push('/products');

  return {
    addressId,
    shippingMethod,
    couponCode,
    coupon,
    couponMessage,
    couponMessageType,
    subtotal,
    hasFreeShipping,
    shippingCost,
    discount,
    total,
    couponMutation,
    checkoutMutation,
    setSelectedAddress,
    setCouponCode,
    changeShipping,
    applyCoupon,
    clearCoupon,
    submit,
    goToProducts,
  };
}
