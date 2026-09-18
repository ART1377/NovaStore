// src/lib/api-error.ts
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export function apiErrorResponse(
  error: unknown,
  fallback = 'خطایی در پردازش درخواست رخ داد.',
) {
  if (error instanceof z.ZodError) {
    const fieldErrors = error.issues.reduce<Record<string, string>>(
      (acc, issue) => {
        const key = issue.path.join('.');
        if (key && !acc[key]) acc[key] = issue.message;
        return acc;
      },
      {},
    );
    return {
      status: 400,
      body: { error: error.issues[0]?.message ?? fallback, fieldErrors },
    };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      return { status: 409, body: { error: 'این اطلاعات قبلاً ثبت شده است.' } };
    if (error.code === 'P2025')
      return { status: 404, body: { error: 'منبع موردنظر پیدا نشد.' } };
    if (error.code === 'P2003')
      return {
        status: 409,
        body: {
          error: 'این مورد به داده‌های دیگری وابسته است و قابل حذف نیست.',
        },
      };
  }
  const message = error instanceof Error ? error.message : '';
  if (message === 'UNAUTHORIZED')
    return { status: 401, body: { error: 'برای ادامه باید وارد حساب شوید.' } };
  if (message === 'FORBIDDEN')
    return {
      status: 403,
      body: { error: 'شما دسترسی لازم برای این عملیات را ندارید.' },
    };
  return { status: 500, body: { error: fallback } };
}
