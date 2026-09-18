// src/features/admin/components/inventory-page.tsx
'use client';
import { EmptyState, SearchField, Stat } from '@/components/shared';
import Image from 'next/image';
import { PackageCheck, AlertTriangle, Boxes } from 'lucide-react';
import { useInventoryPage } from '../hooks/use-inventory-page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatInputNumber } from '@/lib/utils';
import { LOW_STOCK_THRESHOLD } from '@/constants/constants';
import { AdminListSkeleton } from './admin-list-skeleton';
import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';
import { AdminPageHeader } from './admin-page-header';
export function InventoryPage() {
  const inventory = useInventoryPage();
  const { data, list, isLoading, update, search, filter, stockErrors, total, out, low, setSearch, setFilter, saveStock } = inventory;

  if (isLoading)
    return <AdminListSkeleton rows={6} withToolbar={false} withStats />;
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
              {(['ALL', 'LOW', 'OUT'] as const).map((x) => (
                <Button
                  key={x}
                  size="sm"
                  variant={filter === x ? 'default' : 'outline'}
                  onClick={() => setFilter(x)}
                  className="min-w-24"
                >
                  {x === 'ALL' ? 'همه' : x === 'LOW' ? 'موجودی کم' : 'ناموجود'}
                </Button>
              ))}
            </div>
          </div>
        }
      />
      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="divide-y">
            {list.map((v) => (
              <div
                key={v.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="bg-nova-soft relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    {v.product.images[0]?.url ? (
                      <Image
                        src={v.product.images[0].url}
                        alt={v.product.name}
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
                      {v.product.name}
                    </p>
                    <p className="text-nova-primary mt-1 text-xs">
                      {v.name} · {v.sku}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      v.stock === 0
                        ? 'bg-nova-danger-soft text-nova-danger'
                        : v.stock <= LOW_STOCK_THRESHOLD
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-nova-soft'
                    }
                  >
                    {v.stock === 0
                      ? 'ناموجود'
                      : v.stock <= LOW_STOCK_THRESHOLD
                        ? 'موجودی کم'
                        : 'موجود'}
                  </Badge>
                  <div>
                    <Input
                      aria-label="موجودی"
                      className="w-full sm:w-24"
                      defaultValue={v.stock}
                      type="text"
                      inputMode="numeric"
                      onChange={(e) => {
                        e.currentTarget.value = formatInputNumber(
                          e.currentTarget.value,
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')
                          saveStock(v.id, (e.target as HTMLInputElement).value);
                      }}
                      aria-invalid={!!stockErrors[v.id]}
                    />
                    <p className="text-nova-danger mt-1 min-h-5 text-xs font-medium">
                      {stockErrors[v.id] ?? ''}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement | null;
                      if (input) saveStock(v.id, input.value);
                    }}
                    disabled={update.isPending}
                  >
                    <PackageCheck size={15} />
                    ذخیره
                  </Button>
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
    </main>
  );
}
