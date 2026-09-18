// src/app/api/admin/home/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import {
  HOME_PLACEMENT_LIMITS,
  HOME_PLACEMENT_SLOTS,
} from '@/constants/constants';

const slotSchema = z.enum([
  'HERO_PRODUCT',
  'FEATURED_PRODUCTS',
  'DISCOUNTED_PRODUCTS',
  'BEST_SELLERS',
  'NEWEST_PRODUCTS',
]);
const updateSchema = z.object({
  slot: slotSchema,
  productIds: z.array(z.string().min(1)).max(8),
});

export async function GET() {
  try {
    await requireAdmin();
    const [products, rows] = await Promise.all([
      db.product.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
            select: { url: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      db.homePlacement.findMany({
        orderBy: [{ slot: 'asc' }, { position: 'asc' }],
        select: { slot: true, productId: true, position: true },
      }),
    ]);
    const placements = HOME_PLACEMENT_SLOTS.map((slot) => ({
      slot,
      limit: HOME_PLACEMENT_LIMITS[slot],
      productIds: rows
        .filter((row) => row.slot === slot)
        .sort((a, b) => a.position - b.position)
        .map((row) => row.productId),
    }));
    return NextResponse.json({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        status: product.status,
        image: product.images[0]?.url ?? null,
      })),
      placements,
    });
  } catch (error) {
    const result = apiErrorResponse(
      error,
      'دریافت تنظیمات صفحه اصلی انجام نشد.',
    );
    return NextResponse.json(result.body, { status: result.status });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = updateSchema.parse(await request.json());
    const limit = HOME_PLACEMENT_LIMITS[body.slot];
    const uniqueProductIds = [...new Set(body.productIds)];
    if (body.productIds.length > limit)
      return NextResponse.json(
        { error: `برای این جایگاه حداکثر ${limit} محصول قابل انتخاب است.` },
        { status: 400 },
      );
    if (uniqueProductIds.length !== body.productIds.length)
      return NextResponse.json(
        { error: 'یک محصول را بیش از یک‌بار انتخاب نکنید.' },
        { status: 400 },
      );

    const products = await db.product.findMany({
      where: { id: { in: uniqueProductIds } },
      select: { id: true, status: true },
    });
    if (products.length !== uniqueProductIds.length)
      return NextResponse.json(
        { error: 'یکی از محصولات انتخاب‌شده پیدا نشد.' },
        { status: 400 },
      );
    if (products.some((product) => product.status !== 'PUBLISHED'))
      return NextResponse.json(
        {
          error:
            'فقط محصولات منتشرشده می‌توانند در ویترین صفحه اصلی قرار بگیرند.',
        },
        { status: 400 },
      );

    await db.$transaction(async (tx) => {
      await tx.homePlacement.deleteMany({ where: { slot: body.slot } });
      if (uniqueProductIds.length)
        await tx.homePlacement.createMany({
          data: uniqueProductIds.map((productId, position) => ({
            slot: body.slot,
            productId,
            position,
          })),
        });
    });
    return NextResponse.json({
      success: true,
      slot: body.slot,
      productIds: uniqueProductIds,
    });
  } catch (error) {
    const result = apiErrorResponse(
      error,
      'به‌روزرسانی جایگاه صفحه اصلی انجام نشد.',
    );
    return NextResponse.json(result.body, { status: result.status });
  }
}
