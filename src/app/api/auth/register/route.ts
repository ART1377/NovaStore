// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/prisma';
import { apiErrorResponse } from '@/lib/api-error';
import { registerSchema } from '@/features/account/validation/auth.schema';
export async function POST(req: Request) {
  try {
    const b = registerSchema.parse(await req.json());
    const exists = await db.user.findUnique({
      where: { email: b.email.toLowerCase() },
    });
    if (exists)
      return NextResponse.json(
        { error: 'این ایمیل قبلاً ثبت شده است' },
        { status: 409 },
      );
    const user = await db.user.create({
      data: {
        name: b.name,
        email: b.email.toLowerCase(),
        passwordHash: await hash(b.password, 10),
        cart: { create: {} },
        wishlist: { create: {} },
      },
      select: { id: true, name: true, email: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    const r = apiErrorResponse(e, 'ثبت‌نام ناموفق بود.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
