// src/features/account/validation/address.schema.ts
import { z } from 'zod';

export const addressSchema = z.object({
  title: z.string().trim().min(2, 'عنوان آدرس حداقل ۲ کاراکتر باشد.').max(50),
  recipient: z
    .string()
    .trim()
    .min(2, 'نام گیرنده حداقل ۲ کاراکتر باشد.')
    .max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+98|0098|0)?9\d{9}$/, 'شماره موبایل معتبر وارد کنید.')
    .max(30),
  city: z.string().trim().min(2, 'شهر را وارد کنید.').max(80),
  state: z.string().trim().min(2, 'استان را وارد کنید.').max(80),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد.')
    .max(20),
  street: z.string().trim().min(5, 'آدرس کامل حداقل ۵ کاراکتر باشد.').max(500),
});

export const addressSchemaWithDefault = addressSchema.extend({
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type AddressInputWithDefault = z.infer<typeof addressSchemaWithDefault>;
