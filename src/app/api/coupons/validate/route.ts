// src/app/api/coupons/validate/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { priceOrderWithCoupon } from '@/lib/coupon-pricing';
import { getCartWithSubtotal } from '@/lib/cart-subtotal';

const schema = z.object({
  code: z.string().trim().min(3).max(50),
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'FREE']).default('STANDARD'),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());
    const cartResult = await getCartWithSubtotal(user.id);
    if (!cartResult)
      return NextResponse.json(
        { error: 'سبد خرید شما خالی است.' },
        { status: 400 },
      );
    const { subtotal } = cartResult;

    const coupon = await db.coupon.findUnique({
      where: { code: body.code.toUpperCase() },
    });
    if (!coupon)
      return NextResponse.json(
        { error: 'کد تخفیف معتبر نیست یا منقضی شده است.' },
        { status: 400 },
      );

    const pricing = priceOrderWithCoupon({
      subtotal,
      shippingMethod: body.shippingMethod,
      coupon,
    });
    if (!pricing.ok)
      return NextResponse.json({ error: pricing.error }, { status: 400 });

    return NextResponse.json({
      code: coupon.code,
      discount: pricing.discount,
      shippingCost: pricing.shippingCost,
      subtotal,
      total: pricing.total,
    });
  } catch (error) {
    const response = apiErrorResponse(error, 'اعتبارسنجی کد تخفیف انجام نشد.');
    return NextResponse.json(response.body, { status: response.status });
  }
}
