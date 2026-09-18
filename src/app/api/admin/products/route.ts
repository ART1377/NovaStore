// src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { apiErrorResponse } from '@/lib/api-error';
import { validateProductCategoryAndBrand } from '@/lib/admin-product-relations';
import {
  createProductSchema,
  resolveProductImages,
} from '@/features/admin/validation/product.schema';

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      await db.product.findMany({
        include: {
          category: true,
          brand: true,
          variants: true,
          images: true,
          _count: { select: { reviews: true, orderItems: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    );
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
