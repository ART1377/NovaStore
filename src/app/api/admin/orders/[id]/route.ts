// src/app/api/admin/orders/[id]/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        items: {
          include: {
            product: { select: { name: true, slug: true } },
            variant: { select: { name: true, sku: true } },
          },
        },
        payment: true,
        shipment: true,
      },
    });
    if (!order)
      return NextResponse.json({ error: 'سفارش پیدا نشد' }, { status: 404 });
    return NextResponse.json(order);
  } catch (e) {
    const r = apiErrorResponse(e, 'جزئیات سفارش دریافت نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
