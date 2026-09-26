// src/app/api/account/reviews/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await requireUser();
    const reviews = await db.review.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              select: { url: true },
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
          },
        },
        replies: {
          include: { user: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    const result = apiErrorResponse(error, 'دریافت نظرهای شما انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
