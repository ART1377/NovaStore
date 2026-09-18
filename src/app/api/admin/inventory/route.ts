// src/app/api/admin/inventory/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';

const schema = z.object({
  variantId: z.string().min(1),
  stock: z.number().int().min(0).max(1_000_000),
});

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      await db.productVariant.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            },
          },
        },
        orderBy: [{ stock: 'asc' }, { product: { name: 'asc' } }],
      }),
    );
  } catch (error) {
    const result = apiErrorResponse(error, 'دریافت موجودی انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const variant = await db.productVariant.findUnique({
      where: { id: body.variantId },
    });
    if (!variant)
      return NextResponse.json(
        { error: 'مدل محصول پیدا نشد.' },
        { status: 404 },
      );
    return NextResponse.json(
      await db.productVariant.update({
        where: { id: body.variantId },
        data: { stock: body.stock },
      }),
    );
  } catch (error) {
    const result = apiErrorResponse(error, 'به‌روزرسانی موجودی انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
