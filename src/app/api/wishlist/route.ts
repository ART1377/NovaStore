// src/app/api/wishlist/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';

const schema = z.object({
  productId: z.string().min(1),
  wished: z.boolean().optional(),
});

async function getWishlist(userId: string) {
  return db.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: 'asc' } },
              brand: true,
              category: true,
              variants: true,
            },
          },
        },
      },
    },
  });
}

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(await getWishlist(user.id));
  } catch (error) {
    const result = apiErrorResponse(error, 'دریافت علاقه‌مندی‌ها انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { productId, wished } = schema.parse(await request.json());
    const product = await db.product.findFirst({
      where: { id: productId, status: 'PUBLISHED' },
      select: { id: true },
    });
    if (!product)
      return NextResponse.json({ error: 'محصول پیدا نشد.' }, { status: 404 });

    const wishlist = await db.wishlist.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
    const existing = await db.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      select: { id: true },
    });
    const nextWished = wished ?? !existing;

    if (nextWished) {
      // upsert is race-safe: two concurrent adds converge to one row.
      await db.wishlistItem.upsert({
        where: {
          wishlistId_productId: { wishlistId: wishlist.id, productId },
        },
        update: {},
        create: { wishlistId: wishlist.id, productId },
      });
    } else {
      await db.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id, productId },
      });
    }
    return NextResponse.json({ wished: nextWished });
  } catch (error) {
    const result = apiErrorResponse(error, 'به‌روزرسانی علاقه‌مندی انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const productId = new URL(request.url).searchParams.get('productId');
    if (!productId)
      return NextResponse.json(
        { error: 'محصول مشخص نشده است.' },
        { status: 400 },
      );
    await db.wishlistItem.deleteMany({
      where: { productId, wishlist: { userId: user.id } },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const result = apiErrorResponse(error, 'حذف علاقه‌مندی انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
