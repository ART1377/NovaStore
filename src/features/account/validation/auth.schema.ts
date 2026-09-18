// src/features/account/validation/auth.schema.ts
import { z } from 'zod';
import { MIN_PASSWORD_LENGTH } from '@/constants/constants';

export const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد.`,
  );

export const loginSchema = z.object({
  email: z.string().trim().email('ایمیل معتبر وارد کنید.'),
  password: z.string().min(1, 'رمز عبور را وارد کنید.'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'نام باید حداقل ۲ کاراکتر باشد.'),
  email: z.string().trim().email('ایمیل معتبر وارد کنید.'),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
