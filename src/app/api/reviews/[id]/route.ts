// src/app/api/reviews/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { z } from 'zod';
import { apiErrorResponse } from '@/lib/api-error';
const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3),
});
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const u = await requireUser();
    const { id } = await params;
    const old = await db.review.findFirst({ where: { id, userId: u.id } });
    if (!old)
      return NextResponse.json({ error: 'نظر پیدا نشد' }, { status: 404 });
    const b = schema.parse(await req.json());
    return NextResponse.json(
      await db.review.update({ where: { id }, data: b }),
    );
  } catch (e) {
    const r = apiErrorResponse(e, 'عملیات انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const u = await requireUser();
    const { id } = await params;
    await db.review.deleteMany({ where: { id, userId: u.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    const r = apiErrorResponse(e, 'عملیات انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
