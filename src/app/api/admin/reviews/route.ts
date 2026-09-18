// src/app/api/admin/reviews/route.ts
import { NextResponse } from 'next/server';
import { apiErrorResponse } from '@/lib/api-error';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      await db.review.findMany({
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
    );
  } catch (e) {
    const r = apiErrorResponse(e, 'دریافت نظرات انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
