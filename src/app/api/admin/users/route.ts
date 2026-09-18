// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { apiErrorResponse } from '@/lib/api-error';
import { pusherServer } from '@/lib/pusher';
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { orders: true, reviews: true, notifications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  } catch (error) {
    const r = apiErrorResponse(error, 'دریافت کاربران انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = z
      .object({ userId: z.string(), role: z.enum(['USER', 'ADMIN']) })
      .parse(await req.json());
    if (admin.id === body.userId && body.role !== 'ADMIN')
      return NextResponse.json(
        { error: 'نمی‌توانید نقش حساب خودتان را حذف کنید.' },
        { status: 400 },
      );
    const exists = await db.user.findUnique({
      where: { id: body.userId },
      select: { id: true },
    });
    if (!exists)
      return NextResponse.json({ error: 'کاربر پیدا نشد.' }, { status: 404 });
    const updated = await db.user.update({
      where: { id: body.userId },
      data: { role: body.role },
      select: { id: true, name: true, email: true, role: true },
    });
    if (pusherServer) {
      try {
        await pusherServer.trigger(`private-user-${updated.id}`, 'notification', { type: 'ROLE_UPDATED', title: 'نقش حساب کاربری به‌روزرسانی شد', message: 'نقش حساب شما تغییر کرده است.' });
      } catch {
        // Realtime delivery must not make a successful role update fail.
      }
    }
    return NextResponse.json(updated);
  } catch (error) {
    const r = apiErrorResponse(error, 'تغییر نقش کاربر انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
