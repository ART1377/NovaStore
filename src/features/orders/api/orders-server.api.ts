// src/features/orders/api/orders-server.api.ts
import { db } from '@/lib/prisma';

export async function getAccountOrder(orderId: string, userId: string) {
  return db.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, shipment: true, payment: true, address: true },
  });
}

export type AccountOrderDetail = NonNullable<
  Awaited<ReturnType<typeof getAccountOrder>>
>;
