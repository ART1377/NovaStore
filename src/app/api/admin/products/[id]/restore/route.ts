// src/app/api/admin/products/[id]/restore/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const existing = await db.product.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing)
      return NextResponse.json({ error: 'محصول پیدا نشد.' }, { status: 404 });

    if (existing.status !== 'ARCHIVED')
      return NextResponse.json({ error: 'این محصول آرشیو نشده است.' }, { status: 400 });

    const product = await db.product.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json(product);
  } catch (error) {
    const r = apiErrorResponse(error, 'بازگردانی محصول انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
