// src/features/account/components/address-manager.tsx
'use client';

import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { getClientErrorMessage } from '@/lib/client-error';
import { MapPin, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { useAddressManager } from '../hooks/use-address-manager';
import { AddressListSkeleton } from './address-list-skeleton';

export function AddressManager() {
  const manager = useAddressManager();
  const {
    addresses,
    form,
    errors,
    editingId,
    create,
    update,
    remove,
    setDefault,
    isLoading,
    isError,
    error,
    refetch,
    resetForm,
    startCreate,
    startEdit,
    setField,
    submit,
    scrollToForm,
  } = manager;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-nova-muted text-xs">اطلاعات ارسال</p>
          <h2 className="mt-1 text-xl font-black">آدرس‌های من</h2>
          <p className="text-nova-muted mt-1 text-sm">
            آدرس‌ها را اضافه، ویرایش، حذف و به‌عنوان پیش‌فرض انتخاب کن.
          </p>
        </div>
        {!editingId ? (
          <Button
            variant="outline"
            onClick={() => {
              startCreate();
            }}
          >
            <Plus size={16} /> آدرس جدید
          </Button>
        ) : (
          <Button variant="ghost" onClick={resetForm}>
            <X size={16} /> انصراف از ویرایش
          </Button>
        )}
      </div>

      {isLoading ? (
        <AddressListSkeleton />
      ) : isError ? (
        <div className="border-nova-danger/20 bg-nova-danger-soft/30 mt-5 rounded-3xl border p-5">
          <p className="text-nova-danger font-bold">آدرس‌ها دریافت نشدند.</p>
          <p className="text-nova-danger/80 mt-1 text-sm">
            {getClientErrorMessage(
              error,
              'دریافت آدرس‌ها انجام نشد. دوباره تلاش کنید.',
            )}
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => refetch()}
          >
            تلاش مجدد
          </Button>
        </div>
      ) : addresses.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={
                address.isDefault
                  ? 'border-nova-primary ring-nova-primary/20 ring-1'
                  : ''
              }
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-nova-hover text-nova-primary grid size-10 place-items-center rounded-2xl">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black">{address.title}</h3>
                        {address.isDefault ? (
                          <span className="bg-nova-hover text-nova-primary inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold">
                            <Star size={11} /> پیش‌فرض
                          </span>
                        ) : null}
                      </div>
                      <p className="text-nova-muted mt-1 text-xs">
                        گیرنده: {address.recipient}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(address)}
                      className="text-nova-muted hover:bg-nova-hover rounded-xl p-2"
                      aria-label="ویرایش آدرس"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={remove.isPending}
                      onClick={() => remove.mutate(address.id)}
                      className="text-nova-danger/75 hover:bg-nova-danger-soft rounded-xl p-2"
                      aria-label="حذف آدرس"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-sm leading-6">
                  <p>
                    {address.state}، {address.city}
                  </p>
                  <p>{address.street}</p>
                  <p className="text-nova-muted text-xs">
                    کد پستی: {address.postalCode} · {address.phone}
                  </p>
                </div>
                {!address.isDefault ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-3"
                    disabled={setDefault.isPending}
                    onClick={() => setDefault.mutate(address)}
                  >
                    انتخاب به‌عنوان پیش‌فرض
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            icon={MapPin}
            title="هنوز آدرسی ثبت نکرده‌ای."
            description="یک آدرس ذخیره کن تا در خریدهای بعدی فقط آن را انتخاب کنی."
            action={{
              label: 'ثبت اولین آدرس',
              onClick: scrollToForm,
            }}
          />
        </div>
      )}

      <Card id="address-form" className="mt-5 scroll-mt-24">
        <CardContent className="p-5 md:p-6">
          <div>
            <h3 className="font-black">
              {editingId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
            </h3>
            <p className="text-nova-muted mt-1 text-xs">
              اطلاعات کامل این آدرس در سفارش و پروفایل شما استفاده می‌شود.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField label="عنوان آدرس" required error={errors.title}>
              <Input
                value={form.title}
                aria-invalid={!!errors.title}
                onChange={(e) => setField('title', e.target.value)}
              />
            </FormField>
            <FormField label="نام گیرنده" required error={errors.recipient}>
              <Input
                value={form.recipient}
                aria-invalid={!!errors.recipient}
                onChange={(e) => setField('recipient', e.target.value)}
              />
            </FormField>
            <FormField label="شماره موبایل" required error={errors.phone}>
              <Input
                inputMode="tel"
                value={form.phone}
                aria-invalid={!!errors.phone}
                onChange={(e) => setField('phone', e.target.value)}
              />
            </FormField>
            <FormField label="شهر" required error={errors.city}>
              <Input
                value={form.city}
                aria-invalid={!!errors.city}
                onChange={(e) => setField('city', e.target.value)}
              />
            </FormField>
            <FormField label="استان" required error={errors.state}>
              <Input
                value={form.state}
                aria-invalid={!!errors.state}
                onChange={(e) => setField('state', e.target.value)}
              />
            </FormField>
            <FormField label="کد پستی" required error={errors.postalCode}>
              <Input
                inputMode="numeric"
                maxLength={10}
                value={form.postalCode}
                aria-invalid={!!errors.postalCode}
                onChange={(e) => setField('postalCode', e.target.value)}
              />
            </FormField>
            <FormField
              className="md:col-span-2"
              label="آدرس کامل"
              required
              error={errors.street}
            >
              <Input
                value={form.street}
                aria-invalid={!!errors.street}
                onChange={(e) => setField('street', e.target.value)}
              />
            </FormField>
          </div>
          <div className="mt-2 min-h-6">
            <Checkbox
              label="این آدرس را به‌عنوان پیش‌فرض انتخاب کن"
              checked={form.isDefault || (addresses.length === 0 && !editingId)}
              disabled={addresses.length === 0 && !editingId}
              onChange={(event) => setField('isDefault', event.target.checked)}
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              disabled={create.isPending || update.isPending}
              onClick={submit}
            >
              {create.isPending || update.isPending
                ? 'در حال ذخیره...'
                : editingId
                  ? 'ذخیره ویرایش'
                  : 'ذخیره آدرس'}
            </Button>
            {editingId ? (
              <Button variant="ghost" onClick={resetForm}>
                انصراف
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
