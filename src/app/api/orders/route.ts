// src/app/api/orders/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const u = await requireUser();
    return NextResponse.json(
      await db.order.findMany({
        where: { userId: u.id },
        include: { items: true, shipment: true, payment: true, address: true },
        orderBy: { createdAt: 'desc' },
      }),
    );
  } catch (e) {
    const r = apiErrorResponse(e, 'دریافت اطلاعات انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
