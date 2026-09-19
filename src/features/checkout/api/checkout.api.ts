// src/features/checkout/api/checkout.api.ts
import api from '@/lib/api-client';
import type { Address } from '@/features/account/types/address';
import type { CouponPreview, ShippingMethod } from '../types/checkout-types';
import type { AddressInputWithDefault } from '@/features/account/validation/address.schema';

export type CheckoutPayload = {
  addressId: string;
  shippingMethod: ShippingMethod;
  couponCode?: string;
  idempotencyKey: string;
};

export const checkoutService = {
  validateCoupon: async (
    code: string,
    shippingMethod: ShippingMethod,
  ): Promise<CouponPreview> =>
    (
      await api.post<CouponPreview>('/coupons/validate', {
        code,
        shippingMethod,
      })
    ).data,
  createAddress: async (address: AddressInputWithDefault): Promise<Address> =>
    (await api.post<Address>('/addresses', address)).data,
  submit: async (payload: CheckoutPayload) =>
    (await api.post('/checkout', payload)).data,
};
