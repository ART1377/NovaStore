// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';

const schema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(3, 'متن نظر باید حداقل ۳ کاراکتر باشد.')
    .max(2000),
});

const REVIEWABLE_ORDER_STATUSES = [
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());
    const purchase = await db.orderItem.findFirst({
      where: {
        productId: body.productId,
        order: {
          userId: user.id,
          orderStatus: { in: [...REVIEWABLE_ORDER_STATUSES] },
        },
      },
      select: { id: true },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'فقط خریداران این محصول می‌توانند امتیاز و نظر ثبت کنند.' },
        { status: 403 },
      );
    }

    return NextResponse.json(
      await db.review.upsert({
        where: {
          productId_userId: { productId: body.productId, userId: user.id },
        },
        update: { rating: body.rating, comment: body.comment },
        create: {
          productId: body.productId,
          userId: user.id,
          rating: body.rating,
          comment: body.comment,
        },
      }),
      { status: 201 },
    );
  } catch (error) {
    const result = apiErrorResponse(error, 'ثبت امتیاز و نظر انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
