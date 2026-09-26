// src/app/api/admin/inventory/route.ts
import { ADMIN_LIST_PAGE_SIZE } from '@/constants/constants';
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  variantId: z.string().min(1),
  stock: z.number().int().min(0).max(1_000_000),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  search: z.string().trim().max(80).optional(),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const query = listQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );

    const where: Prisma.ProductVariantWhereInput = query.search
      ? {
          OR: [
            { sku: { contains: query.search } },
            { name: { contains: query.search } },
            { product: { name: { contains: query.search } } },
          ],
        }
      : {};

    const [variants, total] = await db.$transaction([
      db.productVariant.findMany({
        where,
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
        skip: (query.page - 1) * ADMIN_LIST_PAGE_SIZE,
        take: ADMIN_LIST_PAGE_SIZE,
      }),
      db.productVariant.count({ where }),
    ]);

    return NextResponse.json({
      variants,
      total,
      page: query.page,
      pageSize: ADMIN_LIST_PAGE_SIZE,
      hasMore: query.page * ADMIN_LIST_PAGE_SIZE < total,
    });
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
