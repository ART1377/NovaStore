// src/features/admin/components/home-settings-page.tsx
'use client';

import Image from 'next/image';
import { GripVertical, Save } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { HOME_SLOTS, SLOT_META, useAdminHomeSettingsPage } from '../hooks/use-admin-home-settings-page';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryError } from '@/components/shared/query-state';
import { AdminPageHeader } from './admin-page-header';
import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';

export function AdminHomeSettingsPage() {
  const page = useAdminHomeSettingsPage();
  const { data, isLoading, error, refetch, updatePlacement, selected, dragged, publishedProducts, productMap, toggle, selectHero, startDrag, endDrag, drop, save } = page;
  if (isLoading)
    return (
      <main className="w-full min-w-0 space-y-6">
        <div>
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-3 h-9 w-56" />
          <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </main>
    );
  if (error || !data)
    return (
      <QueryError
        message="دریافت تنظیمات صفحه اصلی ناموفق بود."
        onRetry={() => void refetch()}
      />
    );

  return (
    <main className="w-full min-w-0 space-y-6">
      <AdminPageHeader
        eyebrow="مدیریت / ویترین صفحه اصلی"
        title="ویترین صفحه اصلی"
        description="انتخاب کنید کدام محصولات در Hero و بخش‌های اصلی نمایش داده شوند. هر بخش که خالی باشد از منطق خودکار فروشگاه استفاده می‌کند."
      />

      {HOME_SLOTS.map((slot) => {
        const ids = selected[slot];
        const chosen = ids.map((id) => productMap.get(id)).filter(Boolean);
        return (
          <Card key={slot} className="min-w-0">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black">
                      {SLOT_META[slot].title}
                    </h2>
                    <Badge>{SLOT_META[slot].label}</Badge>
                  </div>
                  <p className="text-nova-muted mt-1 text-xs leading-6">
                    {SLOT_META[slot].description}
                  </p>
                </div>
                <Button
                  className="w-full shrink-0 sm:w-auto"
                  disabled={updatePlacement.isPending}
                  onClick={() => save(slot)}
                >
                  <Save size={16} /> ذخیره این بخش
                </Button>
              </div>

              {slot === 'HERO_PRODUCT' ? (
                <div className="mt-5 grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
                  <Combobox
                    className="h-full"
                    value={ids[0] ?? ''}
                    onChange={selectHero}
                    placeholder="استفاده از انتخاب خودکار (جدیدترین محصول)"
                    searchPlaceholder="جستجوی محصول برای Hero..."
                    clearable
                    options={publishedProducts.map((product) => ({
                      value: product.id,
                      label: product.name,
                    }))}
                    renderSelected={(option) => {
                      const product = productMap.get(option.value);
                      if (!product) return option.label;
                      return (
                        <span className="flex min-w-0 flex-1 items-center gap-3 text-right">
                          <span className="bg-nova-soft grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-nova-line">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt=""
                                width={64}
                                height={64}
                                className="size-full object-cover"
                              />
                            ) : (
                              <ProductImagePlaceholder compact label="" className="text-transparent" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">{product.name}</span>
                            <span className="text-nova-muted mt-1 block text-[11px]">انتخاب‌شده برای Hero</span>
                          </span>
                        </span>
                      );
                    }}
                    renderOption={({ option }) => {
                      const product = productMap.get(option.value);
                      if (!product) return option.label;
                      return (
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="bg-nova-soft grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-nova-line">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt=""
                                width={44}
                                height={44}
                                className="size-full object-cover"
                              />
                            ) : (
                              <ProductImagePlaceholder compact label="" className="text-transparent" />
                            )}
                          </span>
                          <span className="min-w-0 truncate text-sm font-semibold">{product.name}</span>
                        </span>
                      );
                    }}
                  />
                  {chosen[0] && (
                    <div className="bg-nova-hover flex min-h-0 min-w-0 items-center gap-3 rounded-2xl border p-3">
                      <span className="bg-nova-soft grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-nova-line">
                        {chosen[0].image ? (
                          <Image
                            src={chosen[0].image}
                            alt={chosen[0].name}
                            width={64}
                            height={64}
                            className="size-full object-cover"
                          />
                        ) : (
                          <ProductImagePlaceholder compact label="" className="text-transparent" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {chosen[0].name}
                        </p>
                        <p className="text-nova-muted mt-1 text-[11px]">
                          نمایش در Hero
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                    {publishedProducts.map((product) => {
                      const checked = ids.includes(product.id);
                      return (
                        <label
                          key={product.id}
                          className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border p-3 transition ${checked ? 'border-nova-ink bg-nova-hover' : 'hover:bg-nova-hover/60'}`}
                        >
                          <Checkbox
                            checked={checked}
                            onChange={() => toggle(slot, product.id)}
                          />
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="size-12 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="bg-nova-soft size-12 shrink-0 rounded-xl" />
                          )}
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                            {product.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="min-w-0 rounded-2xl border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold">ترتیب نمایش</p>
                        <p className="text-nova-muted mt-1 text-[11px]">
                          کارت را بگیر و جای جدید رها کن.
                        </p>
                      </div>
                      <Badge>{ids.length} انتخاب</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      {chosen.map(
                        (product, index) =>
                          product && (
                            <div
                              key={product.id}
                              draggable
                              onDragStart={() => startDrag(slot, index)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => drop(slot, index)}
                              onDragEnd={endDrag}
                              className={`flex min-w-0 cursor-grab touch-none items-center gap-2 rounded-xl border p-2 active:cursor-grabbing ${dragged?.slot === slot && dragged.index === index ? 'opacity-50' : ''}`}
                            >
                              <GripVertical
                                size={16}
                                className="text-nova-muted shrink-0"
                              />
                              <span className="bg-nova-surface grid size-7 shrink-0 place-items-center rounded-lg text-xs font-black">
                                {index + 1}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                                {product.name}
                              </span>
                            </div>
                          ),
                      )}
                      {!chosen.length && (
                        <p className="text-nova-muted py-6 text-center text-xs">
                          انتخابی ثبت نشده؛ منطق خودکار فعال است.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </main>
  );
}
