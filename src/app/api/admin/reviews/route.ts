// src/app/api/admin/reviews/route.ts
import { ADMIN_LIST_PAGE_SIZE } from '@/constants/constants';
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

    const where: Prisma.ReviewWhereInput = query.search
      ? {
          OR: [
            { comment: { contains: query.search } },
            { product: { name: { contains: query.search } } },
            { user: { name: { contains: query.search } } },
            { user: { email: { contains: query.search } } },
          ],
        }
      : {};

    const [reviews, total] = await db.$transaction([
      db.review.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * ADMIN_LIST_PAGE_SIZE,
        take: ADMIN_LIST_PAGE_SIZE,
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      total,
      page: query.page,
      pageSize: ADMIN_LIST_PAGE_SIZE,
      hasMore: query.page * ADMIN_LIST_PAGE_SIZE < total,
    });
  } catch (e) {
    const r = apiErrorResponse(e, 'دریافت نظرات انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
