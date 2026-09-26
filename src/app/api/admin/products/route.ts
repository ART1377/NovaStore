// src/app/api/admin/products/route.ts
import { ADMIN_LIST_PAGE_SIZE } from '@/constants/constants';
import {
  createProductSchema,
  resolveProductImages,
} from '@/features/admin/validation/product.schema';
import { validateProductCategoryAndBrand } from '@/lib/admin-product-relations';
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import type { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

    const where: Prisma.ProductWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { brand: { name: { contains: query.search } } },
            { category: { name: { contains: query.search } } },
          ],
        }
      : {};

    const [products, total] = await db.$transaction([
      db.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          variants: true,
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          _count: { select: { reviews: true, orderItems: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (query.page - 1) * ADMIN_LIST_PAGE_SIZE,
        take: ADMIN_LIST_PAGE_SIZE,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page: query.page,
      pageSize: ADMIN_LIST_PAGE_SIZE,
      hasMore: query.page * ADMIN_LIST_PAGE_SIZE < total,
    });
  } catch (error) {
    const result = apiErrorResponse(error, 'دریافت محصولات مدیریتی انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = createProductSchema.parse(await req.json());
    const relations = await validateProductCategoryAndBrand({
      categoryId: body.categoryId,
      brandId: body.brandId,
    });
    if (!relations.ok)
      return NextResponse.json({ error: relations.error }, { status: 400 });

    const images = resolveProductImages(body);
    const slug = `${slugify(body.name)}-${Date.now().toString(36)}`;
    const product = await db.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        price: body.price,
        compareAtPrice: body.compareAtPrice ?? null,
        categoryId: body.categoryId,
        brandId: body.brandId ?? null,
        status: body.status,
        featured: body.featured,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        variants: {
          create: body.variants.map((variant) => ({
            sku: variant.sku,
            name: variant.name,
            color: variant.color ?? null,
            size: variant.size ?? null,
            price: variant.price ?? body.price,
            stock: variant.stock,
          })),
        },
        images: images.length
          ? {
              create: images.map((image, index) => ({
                url: image.url,
                publicId: image.publicId ?? null,
                bytes: image.bytes ?? null,
                alt: body.name,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: { variants: true, images: true },
    });
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const result = apiErrorResponse(error, 'ساخت محصول انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
