// src/app/api/admin/brands/route.ts
import {
  handleResourceCreate,
  handleResourceList,
} from '@/lib/admin-resource-routes';
import { db } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET() {
  return handleResourceList(
    () =>
      db.brand.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
    'دریافت برندها انجام نشد.',
  );
}

export async function POST(request: Request) {
  return handleResourceCreate(
    request,
    (name) =>
      db.brand.create({
        data: { name, slug: `${slugify(name)}-${Date.now().toString(36)}` },
      }),
    'ساخت برند انجام نشد.',
  );
}
