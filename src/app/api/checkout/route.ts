// src/app/api/checkout/route.ts
import { ORDER_STATUS_LABELS } from '@/constants/constants';
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { priceOrderWithCoupon } from '@/lib/coupon-pricing';
import { db } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { createOrderNumber } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  addressId: z.string().min(1),
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'FREE']),
  couponCode: z.string().trim().max(50).optional(),
  idempotencyKey: z.string().min(8).max(80),
});

/** Business-rule failure that should surface as a specific HTTP status. */
class CheckoutError extends Error {
  constructor(
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
    this.name = 'CheckoutError';
  }
}

export async function POST(request: Request) {
  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await request.json());
  } catch (error) {
    const response = apiErrorResponse(error, 'درخواست نامعتبر است.');
    return NextResponse.json(response.body, { status: response.status });
  }

  try {
    const user = await requireUser();

    // Idempotency: if this key already produced an order, return it verbatim.
    const existingOrder = await db.order.findUnique({
      where: { idempotencyKey: body.idempotencyKey },
    });
    if (existingOrder) {
      if (existingOrder.userId !== user.id) {
        return NextResponse.json(
          { error: 'کلید idempotency نامعتبر است.' },
          { status: 409 },
        );
      }
      return NextResponse.json(existingOrder, { status: 201 });
    }

    const { order, adminIds } = await db.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: { include: { product: true, variant: true } },
        },
      });
      if (!cart?.items.length) {
        throw new CheckoutError('سبد خرید شما خالی است.');
      }

      const address = await tx.address.findFirst({
        where: { id: body.addressId, userId: user.id },
      });
      if (!address) {
        throw new CheckoutError('آدرس انتخاب‌شده معتبر نیست.', 404);
      }

      for (const item of cart.items) {
        if (!item.variant || item.variant.stock < item.quantity) {
          throw new CheckoutError(`موجودی «${item.product.name}» کافی نیست.`);
        }
      }

      const coupon = body.couponCode
        ? await tx.coupon.findUnique({
            where: { code: body.couponCode.toUpperCase() },
          })
        : null;
      if (body.couponCode && !coupon) {
        throw new CheckoutError('کد تخفیف معتبر نیست یا منقضی شده است.');
      }

      const subtotal = cart.items.reduce(
        (sum, item) =>
          sum + (item.variant!.price ?? item.product.price) * item.quantity,
        0,
      );

      const pricing = priceOrderWithCoupon({
        subtotal,
        shippingMethod: body.shippingMethod,
        coupon,
      });
      if (!pricing.ok) {
        throw new CheckoutError(pricing.error);
      }

      // Conditional decrement guarantees atomicity against concurrent buyers.
      for (const item of cart.items) {
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId!, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count !== 1) {
          throw new CheckoutError(
            `موجودی «${item.product.name}» در همین لحظه کافی نیست.`,
          );
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          idempotencyKey: body.idempotencyKey,
          userId: user.id,
          addressId: address.id,
          subtotal,
          discount: pricing.discount,
          shippingCost: pricing.shippingCost,
          total: pricing.total,
          couponCode: coupon?.code,
          paymentStatus: 'PAID',
          orderStatus: 'PAID',
          shippingStatus: 'PENDING',
          paymentMethod: 'DEMO',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.product.name,
              unitPrice: item.variant!.price ?? item.product.price,
              quantity: item.quantity,
            })),
          },
          payment: {
            create: {
              amount: pricing.total,
              status: 'PAID',
              provider: 'DEMO',
              transactionId: `DEMO-${Date.now()}`,
            },
          },
          shipment: {
            create: { method: body.shippingMethod, status: 'PENDING' },
          },
        },
      });

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      await tx.notification.create({
        data: {
          userId: user.id,
          type: 'ORDER_CREATED',
          title: 'سفارش جدید ثبت شد',
          message: `سفارش ${createdOrder.orderNumber} با موفقیت ثبت شد.`,
          link: `/account/orders/${createdOrder.id}`,
        },
      });

      const admins = await tx.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      if (admins.length) {
        await tx.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: 'ORDER_CREATED',
            title: 'سفارش جدید ثبت شد',
            message: `سفارش ${createdOrder.orderNumber} با وضعیت «${
              ORDER_STATUS_LABELS[
                createdOrder.orderStatus as keyof typeof ORDER_STATUS_LABELS
              ]
            }» ثبت شد.`,
            link: `/admin/orders/${createdOrder.id}`,
          })),
        });
      }

      return { order: createdOrder, adminIds: admins.map((a) => a.id) };
    });

    // Realtime delivery outside the transaction: a Pusher outage must never
    // roll back a successfully created order.
    if (pusherServer) {
      try {
        const payload = {
          type: 'ORDER_CREATED',
          title: 'سفارش جدید ثبت شد',
          message: `سفارش ${order.orderNumber} با موفقیت ثبت شد.`,
          orderNumber: order.orderNumber,
        };
        await Promise.all([
          pusherServer.trigger(
            `private-user-${user.id}`,
            'notification',
            payload,
          ),
          ...adminIds.map((adminId) =>
            pusherServer!.trigger(
              `private-user-${adminId}`,
              'notification',
              payload,
            ),
          ),
        ]);
      } catch {}
    }

    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const existing = await db.order.findUnique({
        where: { idempotencyKey: body.idempotencyKey },
      });
      if (existing) return NextResponse.json(existing, { status: 201 });
    }
    const response = apiErrorResponse(error, 'ثبت سفارش انجام نشد.');
    return NextResponse.json(response.body, { status: response.status });
  }
}
