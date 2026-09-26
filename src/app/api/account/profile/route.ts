// src/app/api/account/profile/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
const schema = z.object({
  name: z.string().trim().min(2, 'نام باید حداقل ۲ کاراکتر باشد.'),
});
export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const data = schema.parse(await req.json());
    const updated = await db.user.update({
      where: { id: user.id },
      data: { name: data.name },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    const r = apiErrorResponse(e, 'بروزرسانی پروفایل انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
