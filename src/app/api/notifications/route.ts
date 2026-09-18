// src/app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { ORDER_STATUS_LABELS } from '@/constants/constants';

function localizeNotificationMessage(message: string) {
  return Object.entries(ORDER_STATUS_LABELS).reduce(
    (result, [status, label]) => result.replaceAll(status, label),
    message,
  );
}

export async function GET() {
  try {
    const u = await requireUser();
    const [items, unread] = await db.$transaction([
      db.notification.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' }, take: 50 }),
      db.notification.count({ where: { userId: u.id, isRead: false } }),
    ]);
    return NextResponse.json({
      items: items.map((item) => ({ ...item, message: localizeNotificationMessage(item.message) })),
      unread,
    });
  } catch (e) {
    const r = apiErrorResponse(e, 'دریافت اعلان‌ها انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}

export async function PATCH(req: Request) {
  try {
    const u = await requireUser();
    const b = z.object({ id: z.string().optional(), all: z.boolean().optional() }).refine((v) => !!v.id || !!v.all, 'درخواست نامعتبر است.').parse(await req.json());
    if (b.all) await db.notification.updateMany({ where: { userId: u.id, isRead: false }, data: { isRead: true } });
    else if (b.id) await db.notification.updateMany({ where: { id: b.id, userId: u.id }, data: { isRead: true } });
    return NextResponse.json({ success: true });
  } catch (e) {
    const r = apiErrorResponse(e, 'به‌روزرسانی اعلان انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
