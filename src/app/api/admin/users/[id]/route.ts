// src/app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            orderStatus: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            product: { select: { name: true, slug: true } },
          },
        },
        _count: {
          select: { orders: true, reviews: true, notifications: true },
        },
      },
    });
    if (!user)
      return NextResponse.json({ error: 'کاربر پیدا نشد.' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    const r = apiErrorResponse(error, 'دریافت اطلاعات کاربر انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
