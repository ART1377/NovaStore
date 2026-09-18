// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { cloudinary } from '@/lib/cloudinary';
import { validateProductCategoryAndBrand } from '@/lib/admin-product-relations';
import {
  resolveProductImages,
  updateProductSchema,
} from '@/features/admin/validation/product.schema';

function publicIdFromCloudinaryUrl(url: string) {
  const marker = '/upload/';
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length);
  const parts = path.split('/');
  while (parts[0] && /^(v\d+|q_auto|f_auto|fl_[^/]+)$/.test(parts[0]))
    parts.shift();
  const joined = parts.join('/');
  return joined.replace(/\.[a-z0-9]+$/i, '') || null;
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { name: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        brand: true,
      },
    });
    if (!product)
      return NextResponse.json({ error: 'محصول پیدا نشد.' }, { status: 404 });
    const images = await Promise.all(
      product.images.map(async (image) => {
        if (image.bytes && image.publicId) return image;
        try {
          const publicId =
            image.publicId ?? publicIdFromCloudinaryUrl(image.url);
          if (!publicId) return image;
          const resource = await cloudinary.api.resource(publicId, {
            resource_type: 'image',
          });
          const bytes =
            typeof resource.bytes === 'number' ? resource.bytes : image.bytes;
          if (bytes && (!image.bytes || !image.publicId)) {
            await db.productImage.update({
              where: { id: image.id },
              data: { publicId, bytes },
            });
          }
          return { ...image, publicId, bytes };
        } catch {
          return image;
        }
      }),
    );
    return NextResponse.json({ ...product, images });
  } catch (error) {
    const r = apiErrorResponse(error, 'دریافت محصول انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const parsedBody = updateProductSchema.parse(await req.json());
    const body = { ...parsedBody, images: resolveProductImages(parsedBody) };
    const existing = await db.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!existing)
      return NextResponse.json({ error: 'محصول پیدا نشد.' }, { status: 404 });
    const relations = await validateProductCategoryAndBrand({
      categoryId: body.categoryId,
      brandId: body.brandId,
      previousCategoryId: existing.categoryId,
      previousBrandId: existing.brandId,
    });
    if (!relations.ok)
      return NextResponse.json({ error: relations.error }, { status: 400 });
    const existingIds = new Set(existing.variants.map((v) => v.id));
    for (const variant of body.variants) {
      if (variant.id && !existingIds.has(variant.id))
        return NextResponse.json(
          { error: 'یکی از مدل‌های محصول متعلق به این محصول نیست.' },
          { status: 400 },
        );
    }
    const updated = await db.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          price: body.price,
          compareAtPrice: body.compareAtPrice,
          categoryId: body.categoryId,
          brandId: body.brandId,
          status: body.status,
          featured: body.featured,
          publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        },
      });
      const incomingIds = new Set(
        body.variants
          .map((v) => v.id)
          .filter((value): value is string => Boolean(value)),
      );
      for (const old of existing.variants) {
        if (!incomingIds.has(old.id))
          await tx.productVariant.update({
            where: { id: old.id },
            data: { stock: 0 },
          });
      }
      for (const variant of body.variants) {
        if (variant.id) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              sku: variant.sku,
              name: variant.name,
              color: variant.color ?? null,
              size: variant.size ?? null,
              price: (() => {
                const previous = existing.variants.find(
                  (item) => item.id === variant.id,
                );
                return previous?.price === existing.price &&
                  variant.price === previous.price
                  ? body.price
                  : (variant.price ?? body.price);
              })(),
              stock: variant.stock,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              sku: variant.sku,
              name: variant.name,
              color: variant.color ?? null,
              size: variant.size ?? null,
              price: variant.price ?? body.price,
              stock: variant.stock,
            },
          });
        }
      }
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (body.images.length)
        await tx.productImage.createMany({
          data: body.images.map((image, index) => ({
            productId: id,
            url: image.url,
            publicId: image.publicId ?? null,
            bytes: image.bytes ?? null,
            alt: body.name,
            sortOrder: index,
          })),
        });
      return product;
    });
    revalidatePath('/products');
    revalidatePath(`/products/${updated.slug}`);
    return NextResponse.json(updated);
  } catch (error) {
    const r = apiErrorResponse(error, 'به‌روزرسانی محصول انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const existing = await db.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing)
      return NextResponse.json({ error: 'محصول پیدا نشد.' }, { status: 404 });
    const product = await db.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
      select: { slug: true },
    });
    await db.homePlacement.deleteMany({ where: { productId: id } });
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const r = apiErrorResponse(error, 'آرشیو محصول انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
