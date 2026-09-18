// src/features/home/api/home.api.ts
import {
  HOME_BEST_SELLER_LIMIT,
  HOME_CATEGORY_LIMIT,
  HOME_DISCOUNTED_LIMIT,
  HOME_FEATURED_LIMIT,
  HOME_NEWEST_LIMIT,
} from '@/constants/constants';
import { db } from '@/lib/prisma';

const homeProductInclude = {
  images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
  brand: true,
  category: true,
  variants: true,
  _count: { select: { reviews: true } },
};

export async function getHomePageData() {
  const [
    placements,
    featuredFallback,
    newestFallback,
    discountedFallback,
    categories,
    sold,
  ] = await Promise.all([
    db.homePlacement.findMany({
      orderBy: [{ slot: 'asc' }, { position: 'asc' }],
      where: { product: { status: 'PUBLISHED' } },
      include: { product: { include: homeProductInclude } },
    }),
    db.product.findMany({
      where: { status: 'PUBLISHED', featured: true },
      include: homeProductInclude,
      orderBy: { createdAt: 'desc' },
      take: HOME_FEATURED_LIMIT,
    }),
    db.product.findMany({
      where: { status: 'PUBLISHED' },
      include: homeProductInclude,
      orderBy: { createdAt: 'desc' },
      take: HOME_NEWEST_LIMIT,
    }),
    db.product.findMany({
      where: { status: 'PUBLISHED', compareAtPrice: { not: null } },
      include: homeProductInclude,
      orderBy: { createdAt: 'desc' },
      take: HOME_DISCOUNTED_LIMIT,
    }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      take: HOME_CATEGORY_LIMIT,
    }),
    db.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      where: { order: { orderStatus: { not: 'CANCELLED' } } },
    }),
  ]);

  const bestIds = sold
    .sort((a, b) => (b._sum.quantity ?? 0) - (a._sum.quantity ?? 0))
    .slice(0, HOME_BEST_SELLER_LIMIT)
    .map((item) => item.productId);
  const bestProducts = bestIds.length
    ? await db.product.findMany({
        where: { id: { in: bestIds }, status: 'PUBLISHED' },
        include: homeProductInclude,
      })
    : [];
  const bestById = new Map(
    bestProducts.map((product) => [product.id, product]),
  );
  const bestFallback = bestIds
    .map((id) => bestById.get(id))
    .filter((product): product is (typeof bestProducts)[number] =>
      Boolean(product),
    );
  const bySlot = new Map<string, typeof placements>();
  placements.forEach((placement) => {
    const list = bySlot.get(placement.slot) ?? [];
    list.push(placement);
    bySlot.set(placement.slot, list);
  });
  const selected = (slot: string, fallback: typeof featuredFallback) => {
    const rows = bySlot.get(slot) ?? [];
    return rows.length ? rows.map((row) => row.product) : fallback;
  };
  const heroBase =
    bySlot.get('HERO_PRODUCT')?.[0]?.product ?? newestFallback[0] ?? null;
  const heroReview = heroBase
    ? await db.review.aggregate({ where: { productId: heroBase.id }, _avg: { rating: true }, _count: { _all: true } })
    : null;
  const hero = heroBase
    ? {
        ...heroBase,
        ratingAverage: heroReview?._avg.rating ?? 0,
        ratingCount: heroReview?._count._all ?? 0,
      }
    : null;
  return {
    hero,
    featured: selected('FEATURED_PRODUCTS', featuredFallback),
    discounted: selected('DISCOUNTED_PRODUCTS', discountedFallback),
    best: selected('BEST_SELLERS', bestFallback),
    newest: selected('NEWEST_PRODUCTS', newestFallback),
    categories,
  };
}

export type HomePageData = Awaited<ReturnType<typeof getHomePageData>>;
