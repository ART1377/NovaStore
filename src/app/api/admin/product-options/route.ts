// src/app/api/admin/product-options/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await requireAdmin();
    const [categories, brands] = await Promise.all([
      db.category.findMany({
        select: { id: true, name: true, isActive: true },
        orderBy: { name: 'asc' },
      }),
      db.brand.findMany({
        select: { id: true, name: true, isActive: true },
        orderBy: { name: 'asc' },
      }),
    ]);
    return NextResponse.json({ categories, brands });
  } catch (error) {
    const result = apiErrorResponse(
      error,
      'دریافت گزینه‌های دسته‌بندی و برند انجام نشد.',
    );
    return NextResponse.json(result.body, { status: result.status });
  }
}
