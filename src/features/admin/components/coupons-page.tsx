// src/features/admin/components/coupons-page.tsx
'use client';

import {
  QueryEmpty,
  QueryError,
  QueryLoading,
} from '@/components/shared/query-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { NumericInput } from '@/components/ui/numeric-input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { Select } from '@/components/ui/select';
import { getClientErrorMessage } from '@/lib/client-error';
import { formatDate, formatNumber } from '@/lib/utils';
import { Pencil, Power, TicketPercent, Trash2, X } from 'lucide-react';
import { useAdminCoupons } from '../hooks/use-admin';
import { useCouponForm } from '../hooks/use-coupon-form';
import type { AdminCoupon } from '../types/admin-types';
import { AdminPageHeader } from './admin-page-header';

export function CouponsPage() {
  const {
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
  } = useCouponForm();
  const {
    data: coupons = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCoupons();
  if (isLoading) return <QueryLoading label="در حال دریافت کدهای تخفیف..." />;
  if (isError)
    return (
      <QueryError
        message={getClientErrorMessage(error, 'دریافت کدهای تخفیف انجام نشد.')}
        onRetry={() => refetch()}
      />
    );
  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow="مدیریت / کدهای تخفیف"
        title="کدهای تخفیف"
        description="ساخت، ویرایش و مدیریت وضعیت کدهای تخفیف فروشگاه."
      />
      <Card className="mt-6">
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.4fr)_160px_180px_180px_220px_130px] xl:items-start">
            <FormField label="کد تخفیف" error={errors.code}>
              <Input
                className="h-11 min-w-0"
                value={form.code}
                onChange={(e) =>
                  updateField('code', e.target.value.toUpperCase())
                }
                placeholder="WELCOME20"
              />
            </FormField>
            <FormField label="نوع" error={errors.type}>
              <Select
                className="h-11 w-full"
                value={form.type}
                onChange={(e) =>
                  updateField('type', e.target.value as AdminCoupon['type'])
                }
              >
                <option value="PERCENTAGE">درصدی</option>
                <option value="FIXED">مبلغ ثابت</option>
              </Select>
            </FormField>
            <FormField label="مقدار" error={errors.value}>
              <NumericInput
                className="h-11"
                value={form.value}
                onValueChange={(v) => updateField('value', v)}
              />
            </FormField>
            <FormField label="حداقل خرید" error={errors.minOrder}>
              <NumericInput
                className="h-11"
                value={form.minOrder}
                onValueChange={(v) => updateField('minOrder', v)}
              />
            </FormField>
            <FormField label="تاریخ انقضا" error={errors.expiresAt}>
              <PersianDatePicker
                value={form.expiresAt}
                onChange={(v) => updateField('expiresAt', v)}
              />
            </FormField>
            <div className="flex gap-2 pt-6">
              <Button
                className="w-full"
                disabled={
                  create.isPending || update.isPending || !form.code.trim()
                }
                onClick={submit}
              >
                <TicketPercent size={16} />
                {editingId ? 'ذخیره ویرایش' : 'ساخت کد'}
              </Button>
              {editingId ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  aria-label="انصراف"
                >
                  <X size={16} />
                </Button>
              ) : null}
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {!coupons.length ? (
              <QueryEmpty
                title="هنوز کد تخفیفی ساخته نشده است"
                description="با ساخت اولین کد تخفیف، اینجا نمایش داده می‌شود."
              />
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex flex-col gap-4 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <b>{coupon.code}</b>
                      <Badge
                        className={
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-nova-soft text-nova-primary'
                        }
                      >
                        {coupon.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </div>
                    <p className="text-nova-primary mt-1 text-xs leading-6">
                      {coupon.type === 'PERCENTAGE'
                        ? `${coupon.value}٪`
                        : `${formatNumber(coupon.value)} تومان`}{' '}
                      · حداقل {formatNumber(coupon.minOrder)} تومان · مصرف{' '}
                      {formatNumber(coupon.usedCount)}/
                      {coupon.usageLimit
                        ? formatNumber(coupon.usageLimit)
                        : '∞'}
                      {coupon.expiresAt
                        ? ` · انقضا ${formatDate(coupon.expiresAt)}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex w-full flex-wrap gap-2 lg:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(coupon)}
                    >
                      <Pencil size={14} /> ویرایش
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({
                          id: coupon.id,
                          payload: { isActive: !coupon.isActive },
                        })
                      }
                    >
                      <Power size={14} />
                      {coupon.isActive ? 'غیرفعال' : 'فعال'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={remove.isPending}
                      onClick={() => requestDelete(coupon.id)}
                    >
                      <Trash2 size={14} /> حذف
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!confirmId}
        title="حذف کد تخفیف"
        description="این کد به‌صورت کامل حذف می‌شود و دیگر قابل استفاده یا بازیابی نیست. ادامه می‌دهید؟"
        busy={remove.isPending}
        onClose={cancel}
        onConfirm={confirm}
      />
    </main>
  );
}
