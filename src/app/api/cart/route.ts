// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';

const addSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});
const updateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});

class CartConflictError extends Error {}

async function getCart(userId: string) {
  return db.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        orderBy: { id: 'asc' },
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: 'asc' }, take: 1 },
              variants: true,
            },
          },
          variant: true,
        },
      },
    },
  });
}

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(await getCart(user.id));
  } catch (error) {
    const r = apiErrorResponse(error, 'دریافت سبد خرید انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = addSchema.parse(await request.json());
    const variant = await db.productVariant.findFirst({
      where: { id: body.variantId, productId: body.productId },
      include: { product: { select: { id: true, status: true } } },
    });
    if (!variant || variant.product.status !== 'PUBLISHED')
      return NextResponse.json(
        { error: 'محصول یا مدل انتخاب‌شده پیدا نشد.' },
        { status: 404 },
      );
    if (variant.stock < 1)
      return NextResponse.json(
        { error: 'این مدل ناموجود است.' },
        { status: 409 },
      );

    let item;
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        item = await db.$transaction(async (tx) => {
          const cart = await tx.cart.upsert({
            where: { userId: user.id },
            update: {},
            create: { userId: user.id },
          });
          const current = await tx.cartItem.findFirst({
            where: {
              cartId: cart.id,
              productId: body.productId,
              variantId: body.variantId,
            },
          });
          const nextQuantity = (current?.quantity ?? 0) + body.quantity;
          if (nextQuantity > variant.stock)
            throw new CartConflictError(
              `حداکثر ${variant.stock} عدد از این محصول قابل خرید است.`,
            );
          if (current)
            return tx.cartItem.update({
              where: { id: current.id },
              data: { quantity: nextQuantity },
            });
          return tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId: body.productId,
              variantId: body.variantId,
              quantity: body.quantity,
            },
          });
        });
        break;
      } catch (error) {
        lastError = error;
        if ((error as { code?: string }).code !== 'P2002' || attempt === 2)
          throw error;
      }
    }
    if (!item) throw lastError ?? new Error('افزودن به سبد خرید انجام نشد.');

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    if (error instanceof CartConflictError)
      return NextResponse.json({ error: error.message }, { status: 409 });
    const r = apiErrorResponse(error, 'افزودن به سبد خرید انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = updateSchema.parse(await request.json());
    const item = await db.cartItem.findFirst({
      where: { id: body.itemId, cart: { userId: user.id } },
      include: { variant: true },
    });
    if (!item)
      return NextResponse.json(
        { error: 'آیتم سبد خرید پیدا نشد.' },
        { status: 404 },
      );
    if (!item.variant || body.quantity > item.variant.stock)
      return NextResponse.json(
        { error: 'تعداد درخواستی از موجودی بیشتر است.' },
        { status: 409 },
      );
    return NextResponse.json(
      await db.cartItem.update({
        where: { id: item.id },
        data: { quantity: body.quantity },
      }),
    );
  } catch (error) {
    const r = apiErrorResponse(error, 'به‌روزرسانی سبد خرید انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const itemId = new URL(request.url).searchParams.get('itemId');
    if (!itemId)
      return NextResponse.json(
        { error: 'شناسه آیتم مشخص نشده است.' },
        { status: 400 },
      );
    const result = await db.cartItem.deleteMany({
      where: { id: itemId, cart: { userId: user.id } },
    });
    if (!result.count)
      return NextResponse.json(
        { error: 'آیتم سبد خرید پیدا نشد.' },
        { status: 404 },
      );
    return NextResponse.json({ success: true });
  } catch (error) {
    const r = apiErrorResponse(error, 'حذف آیتم از سبد خرید انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
