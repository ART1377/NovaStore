// src/app/api/admin/categories/route.ts
import {
  handleResourceCreate,
  handleResourceList,
} from '@/lib/admin-resource-routes';
import { db } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET() {
  return handleResourceList(
    () =>
      db.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
    'دریافت دسته‌بندی‌ها انجام نشد.',
  );
}

export async function POST(request: Request) {
  return handleResourceCreate(
    request,
    (name) =>
      db.category.create({
        data: { name, slug: `${slugify(name)}-${Date.now().toString(36)}` },
      }),
    'ساخت دسته‌بندی انجام نشد.',
  );
}
