// src/app/api/admin/brands/[id]/route.ts
import { db } from '@/lib/prisma';
import {
  handleResourceDelete,
  handleResourceUpdate,
} from '@/lib/admin-resource-routes';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleResourceUpdate(
    req,
    params,
    {
      exists: async (id) =>
        Boolean(
          await db.brand.findUnique({ where: { id }, select: { id: true } }),
        ),
      update: (id, data) =>
        db.brand.update({
          where: { id },
          data: { name: data.name, isActive: data.isActive },
        }),
    },
    {
      notFound: 'برند پیدا نشد.',
      updateError: 'به‌روزرسانی برند انجام نشد.',
    },
  );
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleResourceDelete(
    params,
    {
      countProductsUsing: (id) => db.product.count({ where: { brandId: id } }),
      deleteIfExists: async (id) =>
        (await db.brand.deleteMany({ where: { id } })).count,
    },
    {
      inUse: 'این برند دارای محصول است؛ ابتدا محصولات را جابه‌جا کنید.',
      notFound: 'برند پیدا نشد.',
      deleteError: 'حذف برند انجام نشد.',
    },
  );
}
