// src/features/admin/hooks/use-admin-order-detail.ts
'use client';

import { useState } from 'react';
import { z } from 'zod';
import type { OrderStatus, PaymentStatus, ShippingStatus } from '@/constants/constants';
import { useAdminOrder, useAdminOrderActions } from './use-admin';

const trackingSchema = z.string().trim().max(100, 'کد رهگیری نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد.');

export function useAdminOrderDetail(id: string) {
  const query = useAdminOrder(id);
  const { update } = useAdminOrderActions();
  const [status, setStatus] = useState<OrderStatus>();
  const [payment, setPayment] = useState<PaymentStatus>();
  const [shipping, setShipping] = useState<ShippingStatus>();
  const [tracking, setTracking] = useState('');
  const [trackingError, setTrackingError] = useState('');

  const submitUpdate = () => {
    const result = trackingSchema.safeParse(tracking);
    if (!result.success) {
      setTrackingError(result.error.issues[0]?.message ?? 'کد رهگیری نامعتبر است.');
      return;
    }
    setTrackingError('');
    update.mutate({ orderId: id, orderStatus: status, paymentStatus: payment, shippingStatus: shipping, trackingNumber: tracking || null });
  };

  const changeTracking = (value: string) => { setTracking(value); setTrackingError(''); };
  return { ...query, update, status, payment, shipping, tracking, trackingError, setStatus, setPayment, setShipping, setTracking: changeTracking, submitUpdate };
}
