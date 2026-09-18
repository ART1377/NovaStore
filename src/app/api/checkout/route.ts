// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { createOrderNumber } from '@/lib/utils';
import { pusherServer } from '@/lib/pusher';
import { apiErrorResponse } from '@/lib/api-error';
import { priceOrderWithCoupon } from '@/lib/coupon-pricing';
import { getCartWithSubtotal } from '@/lib/cart-subtotal';
import { ORDER_STATUS_LABELS } from '@/constants/constants';

const schema = z.object({
  addressId: z.string().min(1),
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'FREE']),
  couponCode: z.string().trim().max(50).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());
    const cartResult = await getCartWithSubtotal(user.id);
    if (!cartResult)
      return NextResponse.json(
        { error: 'سبد خرید شما خالی است.' },
        { status: 400 },
      );
    const { cart, subtotal } = cartResult;

    const address = await db.address.findFirst({
      where: { id: body.addressId, userId: user.id },
    });
    if (!address)
      return NextResponse.json(
        { error: 'آدرس انتخاب‌شده معتبر نیست.' },
        { status: 404 },
      );

    for (const item of cart.items) {
      if (!item.variant || item.variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `موجودی «${item.product.name}» کافی نیست.` },
          { status: 400 },
        );
      }
    }

    const coupon = body.couponCode
      ? await db.coupon.findUnique({
          where: { code: body.couponCode.toUpperCase() },
        })
      : null;
    if (body.couponCode && !coupon)
      return NextResponse.json(
        { error: 'کد تخفیف معتبر نیست یا منقضی شده است.' },
        { status: 400 },
      );

    const pricing = priceOrderWithCoupon({
      subtotal,
      shippingMethod: body.shippingMethod,
      coupon,
    });
    if (!pricing.ok)
      return NextResponse.json({ error: pricing.error }, { status: 400 });
    const { discount, shippingCost, total } = pricing;

    const order = await db.$transaction(async (tx) => {
      for (const item of cart.items) {
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId!, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count !== 1)
          throw new Error(
            `موجودی «${item.product.name}» در همین لحظه کافی نیست.`,
          );
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          userId: user.id,
          addressId: address.id,
          subtotal,
          discount,
          shippingCost,
          total,
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
              amount: total,
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

      if (coupon)
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
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
      const admins = await tx.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
      if (admins.length) {
        await tx.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: 'ORDER_CREATED',
            title: 'سفارش جدید ثبت شد',
            message: `سفارش ${createdOrder.orderNumber} با وضعیت «${ORDER_STATUS_LABELS[createdOrder.orderStatus as keyof typeof ORDER_STATUS_LABELS]}» ثبت شد.`,
            link: `/admin/orders/${createdOrder.id}`,
          })),
        });
      }

      return createdOrder;
    });

    if (pusherServer) {
      try {
        await pusherServer.trigger(`private-user-${user.id}`, 'notification', { type: 'ORDER_CREATED', title: 'سفارش جدید ثبت شد', message: `سفارش ${order.orderNumber} با موفقیت ثبت شد.`, orderNumber: order.orderNumber });
        const admins = await db.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
        await Promise.all(admins.map((admin) => pusherServer!.trigger(`private-user-${admin.id}`, 'notification', { type: 'ORDER_CREATED', title: 'سفارش جدید ثبت شد', message: `سفارش ${order.orderNumber} با موفقیت ثبت شد.`, orderNumber: order.orderNumber })));
      } catch {
        // Realtime delivery must not make a successfully created order fail.
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const response = apiErrorResponse(error, 'ثبت سفارش انجام نشد.');
    return NextResponse.json(response.body, { status: response.status });
  }
}
