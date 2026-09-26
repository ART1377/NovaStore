// src/app/api/addresses/[id]/route.ts
import { addressSchemaWithDefault } from '@/features/account/validation/address.schema';
import { clearOtherDefaultAddresses } from '@/lib/address-defaults';
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { numericInputValue } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const exists = await db.address.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });
    if (!exists)
      return NextResponse.json({ error: 'آدرس پیدا نشد.' }, { status: 404 });

    const raw = await req.json();
    const body = addressSchemaWithDefault.parse({
      ...raw,
      phone: numericInputValue(raw.phone ?? ''),
      postalCode: numericInputValue(raw.postalCode ?? ''),
    });
    const address = await db.$transaction(async (tx) => {
      if (body.isDefault) await clearOtherDefaultAddresses(tx, user.id);
      return tx.address.update({ where: { id: exists.id }, data: body });
    });
    return NextResponse.json(address);
  } catch (error) {
    const response = apiErrorResponse(error, 'به‌روزرسانی آدرس انجام نشد.');
    return NextResponse.json(response.body, { status: response.status });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const target = await db.address.findFirst({
      where: { id, userId: user.id },
      select: { id: true, isDefault: true },
    });
    if (!target)
      return NextResponse.json({ error: 'آدرس پیدا نشد.' }, { status: 404 });

    await db.$transaction(async (tx) => {
      await tx.address.delete({ where: { id: target.id } });
      if (target.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId: user.id },
          orderBy: { id: 'desc' },
          select: { id: true },
        });
        if (next)
          await tx.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const response = apiErrorResponse(error, 'حذف آدرس انجام نشد.');
    return NextResponse.json(response.body, { status: response.status });
  }
}
