// src/app/api/admin/users/route.ts
import { ADMIN_LIST_PAGE_SIZE } from '@/constants/constants';
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
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

    const where: Prisma.UserWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { email: { contains: query.search } },
          ],
        }
      : {};

    const [users, total] = await db.$transaction([
      db.user.findMany({
        where,
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
        skip: (query.page - 1) * ADMIN_LIST_PAGE_SIZE,
        take: ADMIN_LIST_PAGE_SIZE,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page: query.page,
      pageSize: ADMIN_LIST_PAGE_SIZE,
      hasMore: query.page * ADMIN_LIST_PAGE_SIZE < total,
    });
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
        await pusherServer.trigger(
          `private-user-${updated.id}`,
          'notification',
          {
            type: 'ROLE_UPDATED',
            title: 'نقش حساب کاربری به‌روزرسانی شد',
            message: 'نقش حساب شما تغییر کرده است.',
          },
        );
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
