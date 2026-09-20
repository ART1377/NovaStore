// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { PRODUCTS_PAGE_SIZE } from '@/constants/constants';
import { apiErrorResponse } from '@/lib/api-error';

const querySchema = z
  .object({
    search: z.string().trim().max(80).optional(),
    category: z.string().trim().max(100).optional(),
    brand: z.string().trim().max(100).optional(),
    minPrice: z.coerce.number().int().nonnegative().optional(),
    maxPrice: z.coerce.number().int().nonnegative().optional(),
    available: z.enum(['true', 'false']).optional(),
    discounted: z.enum(['true', 'false']).optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    sort: z
      .enum(['newest', 'price-asc', 'price-desc', 'popular', 'rating'])
      .default('newest'),
    page: z.coerce.number().int().min(1).max(1000).default(1),
  })
  .superRefine((value, ctx) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['minPrice'],
        message: 'حداقل قیمت نمی‌تواند از حداکثر قیمت بیشتر باشد.',
      });
    }
  });

export async function GET(request: Request) {
  try {
    const query = querySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    const where: Prisma.ProductWhereInput = {
      status: 'PUBLISHED',
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search } },
              { description: { contains: query.search } },
              { brand: { name: { contains: query.search } } },
              { category: { name: { contains: query.search } } },
            ],
          }
        : {}),
      ...(query.category
        ? { category: { slug: query.category, isActive: true } }
        : {}),
      ...(query.brand ? { brand: { slug: query.brand, isActive: true } } : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            price: {
              ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
              ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
            },
          }
        : {}),
      ...(query.available === 'true'
        ? { variants: { some: { stock: { gt: 0 } } } }
        : {}),
      ...(query.available === 'false'
        ? { variants: { every: { stock: { lte: 0 } } } }
        : {}),
      ...(query.discounted === 'true' ? { compareAtPrice: { not: null } } : {}),
      ...(query.rating
        ? { reviews: { some: { rating: { gte: query.rating } } } }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === 'price-asc'
        ? { price: 'asc' }
        : query.sort === 'price-desc'
          ? { price: 'desc' }
          : query.sort === 'popular'
            ? { reviews: { _count: 'desc' } }
            : { createdAt: 'desc' };

    const [products, total, categories, brands] = await db.$transaction([
      db.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          brand: true,
          category: true,
          variants: true,
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (query.page - 1) * PRODUCTS_PAGE_SIZE,
        take: PRODUCTS_PAGE_SIZE,
      }),
      db.product.count({ where }),
      db.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
      db.brand.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    const ratingGroups = products.length
      ? await db.review.groupBy({
          by: ['productId'],
          where: { productId: { in: products.map((product) => product.id) } },
          _avg: { rating: true },
          _count: { _all: true },
        })
      : [];
      
    const ratingMap = new Map(
      ratingGroups.map((item) => [
        item.productId,
        { average: item._avg.rating ?? 0, count: item._count._all },
      ]),
    );
    let productsWithRatings = products.map((product) => ({
      ...product,
      ratingAverage: ratingMap.get(product.id)?.average ?? 0,
      ratingCount: ratingMap.get(product.id)?.count ?? product._count.reviews,
    }));

    if (query.rating) {
      const threshold = query.rating;
      productsWithRatings = productsWithRatings.filter(
        (product) => product.ratingAverage >= threshold,
      );
    }
    const sorted =
      query.sort === 'rating'
        ? [...productsWithRatings].sort(
            (a, b) => b.ratingAverage - a.ratingAverage,
          )
        : productsWithRatings;

    return NextResponse.json({
      products: sorted,
      total,
      page: query.page,
      pageSize: PRODUCTS_PAGE_SIZE,
      hasMore: query.page * PRODUCTS_PAGE_SIZE < total,
      categories,
      brands,
    });
  } catch (error) {
    const result = apiErrorResponse(error, 'دریافت محصولات انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
