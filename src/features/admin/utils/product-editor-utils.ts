// src/features/admin/utils/product-editor-utils.ts
import { numericInputValue } from '@/lib/utils';
import type { AdminProductPayload } from '../types/admin-types';
import type { CloudinaryImageValue } from '@/components/shared/cloudinary-types';
import type { FormState, Variant } from '../types/product-editor-types';

function toVariantPayload(variant: Variant) {
  return {
    id: variant.id,
    sku: variant.sku.trim(),
    name: variant.name.trim() || 'مدل اصلی',
    color: variant.color.trim() || null,
    size: variant.size.trim() || null,
    price: variant.price
      ? Math.round(Number(numericInputValue(variant.price)))
      : null,
    stock: Math.max(
      0,
      Math.round(Number(numericInputValue(variant.stock)) || 0),
    ),
  };
}

function buildVariantsPayload(variants: Variant[]) {
  const filled = variants.filter((variant) => variant.sku.trim());
  if (filled.length) return filled.map(toVariantPayload);

  // No SKU was entered for any variant: fall back to a single
  // auto-generated variant so the product is still saveable.
  const fallback = variants[0];
  return [
    {
      ...toVariantPayload({
        ...(fallback ?? {
          sku: '',
          name: '',
          color: '',
          size: '',
          price: '',
          stock: '0',
        }),
        sku: `NOVA-${Date.now().toString(36).toUpperCase()}`,
      }),
    },
  ];
}

export function buildProductPayload(
  form: FormState,
  variants: Variant[],
  images: CloudinaryImageValue[],
): AdminProductPayload {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Math.round(Number(numericInputValue(form.price))),
    compareAtPrice: form.compareAtPrice
      ? Math.round(Number(numericInputValue(form.compareAtPrice)))
      : null,
    categoryId: form.categoryId,
    brandId: form.brandId || null,
    status: form.status,
    featured: form.featured,
    images,
    variants: buildVariantsPayload(variants),
  };
}

export function totalVariantStock(variants: Variant[]) {
  return variants.reduce(
    (sum, variant) => sum + Math.max(0, Number(variant.stock) || 0),
    0,
  );
}
