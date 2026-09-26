// src/app/api/admin/reviews/[id]/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const result = await db.review.deleteMany({ where: { id } });
    if (!result.count)
      return NextResponse.json({ error: 'نظر پیدا نشد.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    const r = apiErrorResponse(error, 'حذف نظر انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
