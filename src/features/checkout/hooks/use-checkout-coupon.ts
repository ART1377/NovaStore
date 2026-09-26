// src/features/checkout/hooks/use-checkout-coupon.ts
'use client';

import { getClientErrorMessage } from '@/lib/client-error';
import { useState } from 'react';
import type { CouponPreview, ShippingMethod } from '../types/checkout-types';
import { useCouponValidation } from './use-checkout-actions';

export function useCheckoutCoupon() {
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<CouponPreview | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponMessageType, setCouponMessageType] = useState<
    'success' | 'error' | ''
  >('');
  const couponMutation = useCouponValidation();

  const validate = (code: string, shippingMethod: ShippingMethod) => {
    couponMutation.mutate(
      { code, shippingMethod },
      {
        onSuccess: (result) => {
          setCoupon(result);
          setCouponMessage('کد تخفیف با موفقیت اعمال شد.');
          setCouponMessageType('success');
        },
        onError: (error) => {
          setCoupon(null);
          setCouponMessage(
            getClientErrorMessage(error, 'کد تخفیف معتبر نیست.'),
          );
          setCouponMessageType('error');
        },
      },
    );
  };

  const apply = (shippingMethod: ShippingMethod) => {
    const normalized = couponCode.trim().toUpperCase();
    if (!normalized) {
      setCoupon(null);
      setCouponMessage('کد تخفیف را وارد کنید.');
      setCouponMessageType('error');
      return;
    }
    setCouponCode(normalized);
    validate(normalized, shippingMethod);
  };

  const clear = () => {
    setCouponCode('');
    setCoupon(null);
    setCouponMessage('');
    setCouponMessageType('');
  };

  return {
    couponCode,
    setCouponCode,
    coupon,
    couponMessage,
    couponMessageType,
    couponMutation,
    validate,
    apply,
    clear,
  };
}
