// src/features/admin/components/inventory-page.tsx
'use client';
import { EmptyState, SearchField, Stat } from '@/components/shared';
import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';
import { QueryError } from '@/components/shared/query-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LOW_STOCK_THRESHOLD } from '@/constants/constants';
import { formatInputNumber, numericInputValue } from '@/lib/utils';
import { Boxes, PackageCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  useAdminInventory,
  useAdminInventoryActions,
} from '../hooks/use-admin';
import { AdminListSkeleton } from './admin-list-skeleton';
import { AdminPageHeader } from './admin-page-header';
import { AdminPagination } from './admin-pagination';

type InventoryFilter = 'ALL' | 'LOW' | 'OUT';

export function InventoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InventoryFilter>('ALL');
  const [page, setPage] = useState(1);
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});

  const { data, isLoading, isError, refetch, isFetching } = useAdminInventory({
    page,
  });
  const { update } = useAdminInventoryActions();

  const items = data?.items ?? [];
  const list = items.filter((variant) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'LOW' &&
        variant.stock > 0 &&
        variant.stock <= LOW_STOCK_THRESHOLD) ||
      (filter === 'OUT' && variant.stock === 0);
    const query = search.trim().toLowerCase();
    return (
      matchesFilter &&
      `${variant.product.name} ${variant.sku} ${variant.name}`
        .toLowerCase()
        .includes(query)
    );
  });

  const total = items.reduce((sum, item) => sum + item.stock, 0);
  const out = items.filter((item) => item.stock === 0).length;
  const low = items.filter(
    (item) => item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD,
  ).length;

  const saveStock = (variantId: string, value: string) => {
    const normalized = numericInputValue(value);
    if (!/^\d+$/.test(normalized) || Number(normalized) > 1_000_000) {
      setStockErrors((current) => ({
        ...current,
        [variantId]: 'موجودی باید عدد صحیح بین ۰ تا ۱٬۰۰۰٬۰۰۰ باشد.',
      }));
      return;
    }
    setStockErrors((current) => {
      const next = { ...current };
      delete next[variantId];
      return next;
    });
    update.mutate({ variantId, stock: Number(normalized) });
  };

  if (isLoading)
    return <AdminListSkeleton rows={6} withToolbar={false} withStats />;
  if (isError)
    return (
      <QueryError
        message="دریافت موجودی ناموفق بود."
        onRetry={() => refetch()}
      />
    );

  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow="مدیریت / موجودی"
        title="انبار و موجودی"
        description="مدیریت موجودی هر مدل و تشخیص کمبودها."
        action={
          <div className="grid grid-cols-3 gap-2 text-xs sm:min-w-[330px]">
            <Stat title="کل" value={total} />
            <Stat title="کم" value={low} />
            <Stat title="ناموجود" value={out} />
          </div>
        }
        controls={
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="جستجوی محصول یا SKU..."
              className="w-full lg:flex-1"
            />
            <div className="flex flex-wrap gap-2 lg:shrink-0">
              {(['ALL', 'LOW', 'OUT'] as const).map((key) => (
                <Button
                  key={key}
                  size="sm"
                  variant={filter === key ? 'default' : 'outline'}
                  onClick={() => setFilter(key)}
                  className="min-w-24"
                >
                  {key === 'ALL'
                    ? 'همه'
                    : key === 'LOW'
                      ? 'موجودی کم'
                      : 'ناموجود'}
                </Button>
              ))}
            </div>
          </div>
        }
      />
      <Card className="mt-6">
        <CardContent className="p-0">
          <div
            className={`divide-y transition-opacity ${isFetching ? 'opacity-60' : ''}`}
          >
            {list.map((variant) => (
              <div
                key={variant.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="bg-nova-soft relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    {variant.product.images[0]?.url ? (
                      <Image
                        src={variant.product.images[0].url}
                        alt={variant.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <ProductImagePlaceholder compact label="بدون تصویر" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {variant.product.name}
                    </p>
                    <p className="text-nova-primary mt-1 text-xs">
                      {variant.name} · {variant.sku}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      variant.stock === 0
                        ? 'bg-nova-danger-soft text-nova-danger'
                        : variant.stock <= LOW_STOCK_THRESHOLD
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-nova-soft'
                    }
                  >
                    {variant.stock === 0
                      ? 'ناموجود'
                      : variant.stock <= LOW_STOCK_THRESHOLD
                        ? 'موجودی کم'
                        : 'موجود'}
                  </Badge>
                  <InventoryStockInput
                    variantId={variant.id}
                    stock={variant.stock}
                    error={stockErrors[variant.id]}
                    disabled={update.isPending}
                    onSave={(value) => saveStock(variant.id, value)}
                  />
                </div>
              </div>
            ))}
          </div>
          {!list.length && (
            <EmptyState
              icon={Boxes}
              title="موردی پیدا نشد"
              description={
                search
                  ? 'جستجو را تغییر بده یا فیلتر موجودی را به «همه» برگردان.'
                  : 'موردی در این فیلتر موجودی وجود ندارد.'
              }
              className="border-0 shadow-none"
            />
          )}
        </CardContent>
      </Card>
      {data && (
        <AdminPagination
          page={data.page}
          hasMore={data.hasMore}
          isFetching={isFetching}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}

function InventoryStockInput({
  variantId,
  stock,
  error,
  disabled,
  onSave,
}: {
  variantId: string;
  stock: number;
  error?: string;
  disabled: boolean;
  onSave: (value: string) => void;
}) {
  const serverValue = formatInputNumber(String(stock));
  const [value, setValue] = useState(serverValue);
  const [lastServerValue, setLastServerValue] = useState(serverValue);
  if (serverValue !== lastServerValue) {
    setLastServerValue(serverValue);
    setValue(serverValue);
  }
  const commit = () => {
    if (value === serverValue) return;
    onSave(value);
  };

  return (
    <div>
      <Input
        aria-label={`موجودی ${variantId}`}
        className="w-full sm:w-24"
        value={value}
        inputMode="numeric"
        onChange={(event) => setValue(formatInputNumber(event.target.value))}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
        }}
        aria-invalid={!!error}
      />
      <p className="text-nova-danger mt-1 min-h-5 text-xs font-medium">
        {error ?? ''}
      </p>
      <Button
        size="sm"
        className="w-full sm:w-auto"
        onClick={commit}
        disabled={disabled}
      >
        <PackageCheck size={15} />
        ذخیره
      </Button>
    </div>
  );
}
