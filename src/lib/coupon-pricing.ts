// src/lib/coupon-pricing.ts
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COSTS } from '@/constants/constants';

export type CouponRecord = {
  code: string;
  type: string;
  value: number;
  isActive: boolean;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
  minOrder: number;
};

export type ShippingMethod = keyof typeof SHIPPING_COSTS;

export function getCouponDiscount(
  subtotal: number,
  coupon: Pick<CouponRecord, 'type' | 'value'>,
) {
  const rawDiscount =
    coupon.type === 'PERCENTAGE'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  return Math.min(Math.max(rawDiscount, 0), subtotal);
}

export function isCouponUsable(coupon: CouponRecord, now = new Date()) {
  return (
    coupon.isActive &&
    !(coupon.expiresAt && coupon.expiresAt < now) &&
    !(coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
  );
}

/**
 * Runs the full set of order-level coupon rules (validity, minimum order,
 * free-shipping eligibility) that both the checkout endpoint and the
 * coupon-preview endpoint need to enforce identically. Returns either the
 * resulting pricing or a single Persian error message to show the user.
 */
export function priceOrderWithCoupon({
  subtotal,
  shippingMethod,
  coupon,
  now = new Date(),
}: {
  subtotal: number;
  shippingMethod: ShippingMethod;
  coupon: CouponRecord | null;
  now?: Date;
}):
  | { ok: true; discount: number; shippingCost: number; total: number }
  | { ok: false; error: string } {
  if (coupon && !isCouponUsable(coupon, now)) {
    return { ok: false, error: 'کد تخفیف معتبر نیست یا منقضی شده است.' };
  }
  if (coupon && subtotal < coupon.minOrder) {
    return {
      ok: false,
      error: `حداقل مبلغ سفارش برای استفاده از این کد ${coupon.minOrder.toLocaleString('fa-IR')} تومان است.`,
    };
  }

  const discount = coupon ? getCouponDiscount(subtotal, coupon) : 0;
  const netSubtotal = subtotal - discount;

  if (shippingMethod === 'FREE' && netSubtotal < FREE_SHIPPING_THRESHOLD) {
    return {
      ok: false,
      error: `برای ارسال رایگان، مبلغ سفارش پس از تخفیف باید حداقل ${FREE_SHIPPING_THRESHOLD.toLocaleString('fa-IR')} تومان باشد.`,
    };
  }

  const shippingCost =
    shippingMethod === 'FREE' ? 0 : SHIPPING_COSTS[shippingMethod];

  return {
    ok: true,
    discount,
    shippingCost,
    total: netSubtotal + shippingCost,
  };
}
