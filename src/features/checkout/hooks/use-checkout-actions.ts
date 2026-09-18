// src/features/checkout/hooks/use-checkout-actions.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { checkoutService } from '../api/checkout.api';
import { getClientErrorMessage } from '@/lib/client-error';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { ShippingMethod } from '../types/checkout-types';
import type { Address } from '@/features/account/types/address';

export function useCouponValidation() {
  return useMutation({
    mutationFn: ({
      code,
      shippingMethod,
    }: {
      code: string;
      shippingMethod: ShippingMethod;
    }) => checkoutService.validateCoupon(code, shippingMethod),
  });
}

export function useCreateCheckoutAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkoutService.createAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses });
      toast.success('آدرس با موفقیت اضافه شد.');
    },
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'افزودن آدرس انجام نشد.')),
  });
}

export function useSubmitCheckout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: checkoutService.submit,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      toast.success('سفارش شما با موفقیت ثبت شد.');
      router.push('/account/orders');
    },
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'ثبت سفارش انجام نشد.')),
  });
}
