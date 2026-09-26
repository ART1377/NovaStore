// src/app/api/admin/categories/[id]/route.ts
import {
  handleResourceDelete,
  handleResourceUpdate,
} from '@/lib/admin-resource-routes';
import { db } from '@/lib/prisma';

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
          await db.category.findUnique({ where: { id }, select: { id: true } }),
        ),
      update: (id, data) =>
        db.category.update({
          where: { id },
          data: { name: data.name, isActive: data.isActive },
        }),
    },
    {
      notFound: 'دسته‌بندی پیدا نشد.',
      updateError: 'به‌روزرسانی دسته‌بندی انجام نشد.',
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
      countProductsUsing: (id) =>
        db.product.count({ where: { categoryId: id } }),
      deleteIfExists: async (id) =>
        (await db.category.deleteMany({ where: { id } })).count,
    },
    {
      inUse: 'این دسته‌بندی دارای محصول است؛ ابتدا محصولات را جابه‌جا کنید.',
      notFound: 'دسته‌بندی پیدا نشد.',
      deleteError: 'حذف دسته‌بندی انجام نشد.',
    },
  );
}
