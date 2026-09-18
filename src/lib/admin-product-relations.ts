// src/lib/admin-product-relations.ts
import { db } from './prisma';

type Result = { ok: true } | { ok: false; error: string };

/**
 * Checks that the chosen category exists (and, when it's actually being
 * changed, that it's active) and does the same for the optional brand.
 * Shared by product create (no `previous*`, so every check applies) and
 * product update (only re-checks "active" when the value actually changed).
 */
export async function validateProductCategoryAndBrand({
  categoryId,
  brandId,
  previousCategoryId,
  previousBrandId,
}: {
  categoryId: string;
  brandId?: string | null;
  previousCategoryId?: string;
  previousBrandId?: string | null;
}): Promise<Result> {
  const [category, brand] = await Promise.all([
    db.category.findUnique({
      where: { id: categoryId },
      select: { id: true, isActive: true },
    }),
    brandId
      ? db.brand.findUnique({
          where: { id: brandId },
          select: { id: true, isActive: true },
        })
      : null,
  ]);

  if (!category) return { ok: false, error: 'دسته‌بندی انتخاب‌شده پیدا نشد.' };
  const categoryChanged = categoryId !== previousCategoryId;
  if (categoryChanged && !category.isActive)
    return {
      ok: false,
      error:
        previousCategoryId === undefined
          ? 'دسته‌بندی انتخاب‌شده غیرفعال است.'
          : 'دسته‌بندی جدید غیرفعال است.',
    };

  if (brandId && !brand)
    return { ok: false, error: 'برند انتخاب‌شده پیدا نشد.' };
  const brandChanged = brandId !== previousBrandId;
  if (brandId && brandChanged && !brand?.isActive)
    return {
      ok: false,
      error:
        previousBrandId === undefined
          ? 'برند انتخاب‌شده غیرفعال است.'
          : 'برند جدید غیرفعال است.',
    };

  return { ok: true };
}
