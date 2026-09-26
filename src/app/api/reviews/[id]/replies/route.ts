// src/app/api/reviews/[id]/replies/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  comment: z
    .string()
    .trim()
    .min(2, 'متن پاسخ باید حداقل ۲ کاراکتر باشد.')
    .max(1000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id: reviewId } = await params;
    const body = schema.parse(await request.json());
    const review = await db.review.findUnique({
      where: { id: reviewId },
      select: { id: true },
    });
    if (!review)
      return NextResponse.json({ error: 'نظر پیدا نشد.' }, { status: 404 });

    const reply = await db.reviewReply.create({
      data: { reviewId, userId: user.id, comment: body.comment },
      include: { user: { select: { id: true, name: true, role: true } } },
    });
    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    const result = apiErrorResponse(error, 'ثبت پاسخ انجام نشد.');
    return NextResponse.json(result.body, { status: result.status });
  }
}
