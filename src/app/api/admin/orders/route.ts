// src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
  ORDER_STATUS_LABELS,
  ADMIN_LIST_PAGE_SIZE,
} from '@/constants/constants';
import { apiErrorResponse } from '@/lib/api-error';
import type { Prisma } from '@prisma/client';

const schema = z.object({
  orderId: z.string(),
  orderStatus: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  shippingStatus: z.enum(SHIPPING_STATUSES).optional(),
  trackingNumber: z.string().trim().max(100).nullable().optional(),
});

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

    const where: Prisma.OrderWhereInput = query.search
      ? {
          OR: [
            { orderNumber: { contains: query.search } },
            { user: { name: { contains: query.search } } },
            { user: { email: { contains: query.search } } },
          ],
        }
      : {};

    const [orders, total] = await db.$transaction([
      db.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            select: { id: true, name: true, quantity: true, unitPrice: true },
          },
          payment: true,
          shipment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * ADMIN_LIST_PAGE_SIZE,
        take: ADMIN_LIST_PAGE_SIZE,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page: query.page,
      pageSize: ADMIN_LIST_PAGE_SIZE,
      hasMore: query.page * ADMIN_LIST_PAGE_SIZE < total,
    });
  } catch (error) {
    const r = apiErrorResponse(error, 'دریافت سفارش‌ها انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await req.json());
    const old = await db.order.findUnique({
      where: { id: body.orderId },
      include: {
        shipment: true,
        items: { select: { variantId: true, quantity: true } },
      },
    });
    if (!old)
      return NextResponse.json({ error: 'سفارش پیدا نشد.' }, { status: 404 });
    const nextStatus = body.orderStatus ?? old.orderStatus;
    const nextShipping =
      body.shippingStatus ??
      (nextStatus === 'SHIPPED'
        ? 'SHIPPED'
        : nextStatus === 'DELIVERED'
          ? 'DELIVERED'
          : old.shippingStatus);
    if (old.orderStatus === 'CANCELLED' && nextStatus !== 'CANCELLED')
      return NextResponse.json(
        { error: 'سفارش لغوشده قابل بازگشت به چرخه سفارش نیست.' },
        { status: 409 },
      );
    const order = await db.$transaction(async (tx) => {
      if (nextStatus === 'CANCELLED' && old.orderStatus !== 'CANCELLED') {
        for (const item of old.items) {
          if (item.variantId)
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
        }
      }
      const next = await tx.order.update({
        where: { id: old.id },
        data: {
          orderStatus: nextStatus,
          paymentStatus: body.paymentStatus ?? undefined,
          shippingStatus: nextShipping,
        },
      });
      if (old.shipment) {
        await tx.shipment.update({
          where: { id: old.shipment.id },
          data: {
            status: nextShipping,
            trackingNumber:
              body.trackingNumber === undefined
                ? undefined
                : body.trackingNumber || null,
          },
        });
      }
      await tx.notification.create({
        data: {
          userId: old.userId,
          type: 'ORDER_UPDATED',
          title: 'وضعیت سفارش به‌روزرسانی شد',
          message: `سفارش ${next.orderNumber} اکنون «${ORDER_STATUS_LABELS[next.orderStatus as keyof typeof ORDER_STATUS_LABELS]}» است.`,
          link: `/account/orders/${next.id}`,
        },
      });
      return next;
    });
    if (pusherServer) {
      try {
        const payload = {
          type: 'ORDER_UPDATED',
          title: 'وضعیت سفارش به‌روزرسانی شد',
          message: `سفارش ${order.orderNumber} اکنون «${ORDER_STATUS_LABELS[order.orderStatus as keyof typeof ORDER_STATUS_LABELS]}» است.`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: order.orderStatus,
        };
        const admins = await db.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        await Promise.all([
          pusherServer.trigger(
            `private-user-${old.userId}`,
            'notification',
            payload,
          ),
          ...admins
            .filter((admin) => admin.id !== old.userId)
            .map((admin) =>
              pusherServer!.trigger(
                `private-user-${admin.id}`,
                'notification',
                payload,
              ),
            ),
        ]);
      } catch {
        // Realtime delivery must not make a successful order update fail.
      }
    }
    return NextResponse.json(order);
  } catch (error) {
    const r = apiErrorResponse(error, 'به‌روزرسانی سفارش انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
