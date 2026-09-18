// src/app/api/products/suggestions/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { apiErrorResponse } from '@/lib/api-error';

const schema = z.string().trim().max(80);

export async function GET(request: Request) {
  try {
    const value = schema.parse(
      new URL(request.url).searchParams.get('q') ?? '',
    );
    if (value.length < 2) return NextResponse.json([]);
    const products = await db.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { name: { contains: value } },
          { brand: { name: { contains: value } } },
          { category: { name: { contains: value } } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          select: { url: true },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    const result = apiErrorResponse(
      error,
      'دریافت پیشنهادهای جستجو انجام نشد.',
    );
    return NextResponse.json(result.body, { status: result.status });
  }
}
