// src/app/api/admin/coupons/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const schema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      'کد تخفیف فقط می‌تواند شامل حروف، عدد، خط تیره و زیرخط باشد.',
    )
    .transform((value) => value.toUpperCase()),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minOrder: z.number().nonnegative().default(0),
  usageLimit: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      await db.coupon.findMany({ orderBy: { createdAt: 'desc' } }),
    );
  } catch (error) {
    const result = apiErrorResponse(error, 'دریافت کدهای تخفیف انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    return NextResponse.json(
      await db.coupon.create({
        data: {
          code: body.code,
          type: body.type,
          value: body.type === 'PERCENTAGE' ? body.value : body.value,
          minOrder: body.minOrder,
          usageLimit: body.usageLimit ?? null,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
          isActive: body.isActive,
        },
      }),
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
      return NextResponse.json({ error: 'این کد تخفیف قبلاً ثبت شده است.' }, { status: 409 });
    const result = apiErrorResponse(error, 'ساخت کد تخفیف انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
