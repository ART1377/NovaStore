// src/app/api/addresses/route.ts
import { addressSchemaWithDefault } from '@/features/account/validation/address.schema';
import { clearOtherDefaultAddresses } from '@/lib/address-defaults';
import { apiErrorResponse } from '@/lib/api-error';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { numericInputValue } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await requireUser();
    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { id: 'desc' }],
    });
    return NextResponse.json(addresses);
  } catch (error) {
    const response = apiErrorResponse(error, 'دریافت آدرس‌ها انجام نشد.');
    return NextResponse.json(response.body, { status: response.status });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const raw = await req.json();
    const body = addressSchemaWithDefault.parse({
      ...raw,
      phone: numericInputValue(raw.phone ?? ''),
      postalCode: numericInputValue(raw.postalCode ?? ''),
    });
    const address = await db.$transaction(async (tx) => {
      if (body.isDefault) await clearOtherDefaultAddresses(tx, user.id);
      const created = await tx.address.create({
        data: { ...body, userId: user.id },
      });
      if (!body.isDefault) {
        const count = await tx.address.count({ where: { userId: user.id } });
        if (count === 1)
          return tx.address.update({
            where: { id: created.id },
            data: { isDefault: true },
          });
      }
      return created;
    });
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    const response = apiErrorResponse(error, 'ذخیره آدرس انجام نشد.');
    return NextResponse.json(response.body, { status: response.status });
  }
}
