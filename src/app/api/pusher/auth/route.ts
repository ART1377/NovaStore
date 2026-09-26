// src/app/api/pusher/auth/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const u = await requireUser();
    if (!pusherServer)
      return NextResponse.json(
        { error: 'Pusher not configured' },
        { status: 503 },
      );
    const body = await req.json();
    if (typeof body?.socket_id !== 'string' || !body.socket_id)
      return NextResponse.json(
        { error: 'درخواست Pusher نامعتبر است.' },
        { status: 400 },
      );
    const { socket_id } = body;
    return NextResponse.json(
      pusherServer.authorizeChannel(socket_id, `private-user-${u.id}`),
    );
  } catch (e) {
    const r = apiErrorResponse(e, 'دسترسی به این بخش ممکن نیست.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
