// src/app/api/orders/[id]/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const u = await requireUser();
    const { id } = await params;
    const order = await db.order.findFirst({
      where: { id, userId: u.id },
      include: { items: true, shipment: true, payment: true, address: true },
    });
    if (!order)
      return NextResponse.json({ error: 'سفارش پیدا نشد' }, { status: 404 });
    return NextResponse.json(order);
  } catch (e) {
    const r = apiErrorResponse(e, 'دریافت اطلاعات انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
