// src/app/api/admin/coupons/[id]/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const patchSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/)
    .transform((value) => value.toUpperCase())
    .optional(),
  type: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  value: z.number().positive().optional(),
  minOrder: z.number().nonnegative().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = patchSchema.parse(await req.json());
    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon)
      return NextResponse.json(
        { error: 'کد تخفیف پیدا نشد.' },
        { status: 404 },
      );
    return NextResponse.json(
      await db.coupon.update({
        where: { id },
        data: {
          code: body.code,
          type: body.type,
          value: body.value,
          minOrder: body.minOrder,
          usageLimit: body.usageLimit,
          isActive: body.isActive,
          expiresAt:
            body.expiresAt === undefined
              ? undefined
              : body.expiresAt
                ? new Date(body.expiresAt)
                : null,
        },
      }),
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      return NextResponse.json(
        { error: 'این کد تخفیف قبلاً ثبت شده است.' },
        { status: 409 },
      );
    const result = apiErrorResponse(error, 'به‌روزرسانی کد تخفیف انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon)
      return NextResponse.json(
        { error: 'کد تخفیف پیدا نشد.' },
        { status: 404 },
      );
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const result = apiErrorResponse(error, 'حذف کد تخفیف انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
