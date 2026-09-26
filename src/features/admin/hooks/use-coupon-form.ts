// src/features/admin/hooks/use-coupon-form.ts
'use client';

import { numericInputValue } from '@/lib/utils';
import { useState } from 'react';
import { z } from 'zod';
import type { AdminCoupon } from '../types/admin-types';
import { useAdminCouponActions } from './use-admin';
import { useDeleteConfirmation } from './use-delete-confirmation';

type CouponForm = {
  code: string;
  type: AdminCoupon['type'];
  value: string;
  minOrder: string;
  usageLimit: string;
  expiresAt?: Date;
};
export const INITIAL_COUPON_FORM: CouponForm = {
  code: '',
  type: 'PERCENTAGE',
  value: '20',
  minOrder: '0',
  usageLimit: '100',
};
const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, 'کد تخفیف باید حداقل ۳ کاراکتر باشد.')
      .max(40, 'کد تخفیف نمی‌تواند بیشتر از ۴۰ کاراکتر باشد.')
      .regex(
        /^[A-Z0-9_-]+$/,
        'کد تخفیف فقط شامل حروف انگلیسی، عدد، خط تیره و زیرخط باشد.',
      ),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    value: z
      .string()
      .trim()
      .refine(
        (value) => /^\d+(?:\.\d{1,2})?$/.test(value),
        'مقدار را به‌صورت عددی وارد کنید.',
      )
      .refine((value) => Number(value) > 0, 'مقدار باید بیشتر از صفر باشد.'),
    minOrder: z
      .string()
      .trim()
      .refine(
        (value) => /^\d+(?:\.\d{1,2})?$/.test(value),
        'حداقل خرید را به‌صورت عددی وارد کنید.',
      )
      .refine((value) => Number(value) >= 0, 'حداقل خرید نمی‌تواند منفی باشد.'),
    usageLimit: z
      .string()
      .trim()
      .refine(
        (value) => !value || /^\d+$/.test(value),
        'محدودیت مصرف باید عدد صحیح باشد.',
      )
      .refine(
        (value) => !value || Number(value) > 0,
        'محدودیت مصرف باید بیشتر از صفر باشد.',
      ),
    expiresAt: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'PERCENTAGE' && Number(data.value) > 100)
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.',
      });
    if (data.expiresAt && data.expiresAt.getTime() <= Date.now())
      ctx.addIssue({
        code: 'custom',
        path: ['expiresAt'],
        message: 'تاریخ انقضا باید در آینده باشد.',
      });
  });

export function useCouponForm() {
  const { create, update, remove } = useAdminCouponActions();
  const { confirmId, requestDelete, cancel, confirm } = useDeleteConfirmation(
    remove.mutate,
  );
  const [form, setForm] = useState<CouponForm>(INITIAL_COUPON_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const resetForm = () => {
    setForm(INITIAL_COUPON_FORM);
    setErrors({});
    setEditingId(null);
  };
  const startEdit = (coupon: AdminCoupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minOrder: String(coupon.minOrder),
      usageLimit: coupon.usageLimit === null ? '' : String(coupon.usageLimit),
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt) : undefined,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const updateField = <K extends keyof CouponForm>(
    key: K,
    value: CouponForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [String(key)]: '' }));
  };
  const submit = () => {
    const normalized = {
      ...form,
      value: numericInputValue(form.value),
      minOrder: numericInputValue(form.minOrder),
      usageLimit: numericInputValue(form.usageLimit),
    };
    const result = couponSchema.safeParse(normalized);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    const payload = {
      code: result.data.code,
      type: result.data.type,
      value: Number(result.data.value),
      minOrder: Number(result.data.minOrder),
      usageLimit: result.data.usageLimit
        ? Number(result.data.usageLimit)
        : null,
      expiresAt: result.data.expiresAt?.toISOString() ?? null,
    };
    if (editingId)
      update.mutate({ id: editingId, payload }, { onSuccess: resetForm });
    else
      create.mutate({ ...payload, isActive: true }, { onSuccess: resetForm });
  };
  return {
    form,
    errors,
    editingId,
    updateField,
    submit,
    resetForm,
    startEdit,
    create,
    update,
    remove,
    confirmId,
    requestDelete,
    cancel,
    confirm,
  };
}
