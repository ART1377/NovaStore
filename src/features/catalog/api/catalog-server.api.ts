// src/features/catalog/api/catalog-server.api.ts
import { RELATED_PRODUCT_LIMIT } from '@/constants/constants';
import { db } from '@/lib/prisma';

const productDetailInclude = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  variants: { orderBy: { name: 'asc' as const } },
  brand: true,
  category: true,
  reviews: {
    include: {
      user: { select: { id: true, name: true, role: true } },
      replies: {
        include: { user: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: 'asc' as const },
      },
    },
    orderBy: { createdAt: 'desc' as const },
    take: 20,
  },
  relatedFrom: {
    include: {
      toProduct: {
        include: {
          images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
          brand: true,
          category: true,
          variants: true,
          _count: { select: { reviews: true } },
        },
      },
    },
    take: RELATED_PRODUCT_LIMIT,
  },
};

async function getProductForDetail(slug: string, includeUnpublished = false) {
  const product = await db.product.findFirst({
    where: includeUnpublished ? { slug } : { slug, status: 'PUBLISHED' },
    include: productDetailInclude,
  });
  if (!product) return null;
  const [aggregate, distribution] = await Promise.all([
    db.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    db.review.groupBy({
      by: ['rating'],
      where: { productId: product.id },
      _count: { _all: true },
    }),
  ]);
  return {
    ...product,
    reviews: product.reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      replies: review.replies.map((reply) => ({
        ...reply,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
      })),
    })),
    ratingAverage: aggregate._avg.rating ?? 0,
    ratingCount: aggregate._count._all,
    ratingDistribution: Object.fromEntries(
      distribution.map((row) => [String(row.rating), row._count._all]),
    ),
  };
}

export async function getPublishedProduct(slug: string) {
  return getProductForDetail(slug, false);
}

export async function getAdminProductForDetail(slug: string) {
  return getProductForDetail(slug, true);
}

export type PublishedProduct = NonNullable<
  Awaited<ReturnType<typeof getPublishedProduct>>
>;

export async function getPublishedProductMeta(slug: string) {
  return db.product.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      name: true,
      description: true,
      images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
    },
  });
}
