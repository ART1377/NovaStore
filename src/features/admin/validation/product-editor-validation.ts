// src/features/admin/validation/product-editor-validation.ts
import { z } from 'zod';
import { numericInputValue } from '@/lib/utils';
import { zodFieldErrors, type FieldErrors } from '@/lib/form-errors';
import type { FormState, Variant } from '../types/product-editor-types';

const MAX_VARIANT_STOCK = 1_000_000;

export const productClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'نام محصول باید حداقل ۲ کاراکتر باشد.')
    .max(160, 'نام محصول نمی‌تواند بیشتر از ۱۶۰ کاراکتر باشد.'),
  description: z
    .string()
    .trim()
    .min(10, 'توضیحات باید حداقل ۱۰ کاراکتر باشد.')
    .max(10000, 'توضیحات نمی‌تواند بیشتر از ۱۰۰۰۰ کاراکتر باشد.'),
  price: z
    .string()
    .trim()
    .refine(
      (v) => /^\d+(?:\.\d{1,2})?$/.test(v),
      'قیمت را به‌صورت عددی وارد کنید.',
    )
    .refine((v) => Number(v) > 0, 'قیمت باید بیشتر از صفر باشد.'),
  compareAtPrice: z
    .string()
    .trim()
    .refine(
      (v) => !v || /^\d+(?:\.\d{1,2})?$/.test(v),
      'قیمت قبل از تخفیف را به‌صورت عددی وارد کنید.',
    )
    .refine(
      (v) => !v || Number(v) > 0,
      'قیمت قبل از تخفیف باید بیشتر از صفر باشد.',
    ),
  categoryId: z.string().min(1, 'دسته‌بندی را انتخاب کنید.'),
  brandId: z.string(),
  status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']),
  featured: z.boolean(),
});

function validateVariant(
  variant: Variant,
  index: number,
  seenSkus: Set<string>,
): FieldErrors {
  const errors: FieldErrors = {};
  const prefix = `variants.${index}`;
  const sku = variant.sku.trim();
  const name = variant.name.trim();
  const price = numericInputValue(variant.price.trim());
  const stock = numericInputValue(variant.stock.trim());

  const hasOtherVariantData = Boolean(
    variant.color.trim() ||
    variant.size.trim() ||
    variant.price.trim() ||
    numericInputValue(variant.stock.trim()) !== '0' ||
    name !== 'مدل اصلی',
  );
  if (!sku && hasOtherVariantData)
    errors[`${prefix}.sku`] = `SKU تنوع ${index + 1} را وارد کنید.`;
  else if (sku.length < 2)
    errors[`${prefix}.sku`] = 'SKU باید حداقل ۲ کاراکتر باشد.';
  else if (sku.length > 80)
    errors[`${prefix}.sku`] = 'SKU نمی‌تواند بیشتر از ۸۰ کاراکتر باشد.';
  else if (seenSkus.has(sku.toLowerCase()))
    errors[`${prefix}.sku`] = 'SKU هر تنوع باید یکتا باشد.';
  else seenSkus.add(sku.toLowerCase());

  if (!name) errors[`${prefix}.name`] = 'عنوان تنوع را وارد کنید.';
  else if (name.length > 80)
    errors[`${prefix}.name`] = 'عنوان تنوع نمی‌تواند بیشتر از ۸۰ کاراکتر باشد.';

  if (price && (!/^\d+(?:\.\d{1,2})?$/.test(price) || Number(price) < 0))
    errors[`${prefix}.price`] = 'قیمت تنوع باید عددی و صفر یا بیشتر باشد.';

  if (
    !/^\d+$/.test(stock) ||
    Number(stock) < 0 ||
    Number(stock) > MAX_VARIANT_STOCK
  )
    errors[`${prefix}.stock`] =
      'موجودی باید یک عدد صحیح بین صفر تا ۱٬۰۰۰٬۰۰۰ باشد.';

  if (variant.color.trim().length > 50)
    errors[`${prefix}.color`] = 'رنگ نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.';
  if (variant.size.trim().length > 50)
    errors[`${prefix}.size`] = 'سایز نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.';

  return errors;
}

/**
 * Validates the product form + its variants and returns a flat map of
 * field-path -> error message, ready to hand to <AdminFormField error=...>.
 */
export function validateProductForm(
  form: FormState,
  variants: Variant[],
): FieldErrors {
  const normalizedForm = {
    ...form,
    price: numericInputValue(form.price),
    compareAtPrice: numericInputValue(form.compareAtPrice),
  };
  const parsed = productClientSchema.safeParse(normalizedForm);
  const errors: FieldErrors = parsed.success
    ? {}
    : zodFieldErrors(parsed.error);
  const seenSkus = new Set<string>();

  variants.forEach((variant, index) => {
    Object.assign(errors, validateVariant(variant, index, seenSkus));
  });

  if (
    normalizedForm.compareAtPrice &&
    Number(normalizedForm.compareAtPrice) < Number(normalizedForm.price)
  )
    errors.compareAtPrice =
      'قیمت قبل از تخفیف باید بیشتر یا مساوی قیمت فعلی باشد.';

  return errors;
}
