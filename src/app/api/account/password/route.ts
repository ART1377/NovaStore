// src/app/api/account/password/route.ts
import { passwordSchema } from '@/features/account/validation/auth.schema';
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});
export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const data = schema.parse(await req.json());
    const record = await db.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    if (
      !record?.passwordHash ||
      !(await compare(data.currentPassword, record.passwordHash))
    )
      return NextResponse.json(
        { error: 'رمز فعلی صحیح نیست.' },
        { status: 400 },
      );
    if (data.currentPassword === data.newPassword)
      return NextResponse.json(
        { error: 'رمز جدید باید با رمز فعلی متفاوت باشد.' },
        { status: 400 },
      );
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: await hash(data.newPassword, 10) },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    const r = apiErrorResponse(e, 'تغییر رمز عبور انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
