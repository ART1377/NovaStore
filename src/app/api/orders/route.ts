// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
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
