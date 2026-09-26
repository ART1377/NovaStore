// src/features/admin/components/products-page.tsx
'use client';
import { SearchField } from '@/components/shared';
import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';
import { QueryEmpty } from '@/components/shared/query-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import {
  PRODUCT_STATUS_LABELS,
  type ProductStatus,
} from '@/constants/constants';
import { formatNumber, formatPrice } from '@/lib/utils';
import { Archive, Edit3, Plus, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAdminProductActions, useAdminProducts } from '../hooks/use-admin';
import { useDeleteConfirmation } from '../hooks/use-delete-confirmation';
import { AdminListSkeleton } from './admin-list-skeleton';
import { AdminFilterGrid, AdminPageHeader } from './admin-page-header';
import { AdminProductsError } from './admin-products-error';

export function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch, isFetching } = useAdminProducts({
    page,
  });
  const { archive, restore } = useAdminProductActions();
  const { confirmId, requestDelete, cancel, confirm } = useDeleteConfirmation(
    archive.mutate,
  );

  const list = (data?.items ?? []).filter(
    (product) =>
      (status === 'ALL' || product.status === status) &&
      product.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <AdminListSkeleton rows={6} withStats={false} />;
  if (error) return <AdminProductsError onRetry={() => refetch()} />;

  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow="مدیریت / محصولات"
        title="محصولات"
        description="کاتالوگ، قیمت، موجودی و وضعیت انتشار."
        action={
          <Link href="/admin/products/new">
            <Button className="w-full sm:w-auto">
              <Plus size={17} />
              محصول جدید
            </Button>
          </Link>
        }
        controls={
          <AdminFilterGrid>
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="جستجوی محصول..."
            />
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="PUBLISHED">منتشر شده</option>
              <option value="DRAFT">پیش‌نویس</option>
              <option value="ARCHIVED">آرشیو</option>
            </Select>
          </AdminFilterGrid>
        }
      />

      <Card className="mt-6">
        <CardContent className="p-0">
          <div
            className={`divide-y transition-opacity ${isFetching ? 'opacity-60' : ''}`}
          >
            {list.map((p) => {
              const stock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <div
                  key={p.id}
                  className="flex min-w-0 flex-col gap-4 p-4 lg:flex-row lg:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="bg-nova-soft relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      {p.images[0]?.url ? (
                        <Image
                          src={p.images[0].url}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <ProductImagePlaceholder compact label="بدون تصویر" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">{p.name}</p>
                        {p.featured && (
                          <Badge>
                            <Star size={11} className="ml-1 fill-current" />
                            شاخص
                          </Badge>
                        )}
                      </div>
                      <p className="text-nova-primary mt-1 text-xs">
                        {p.category.name} · {p.brand?.name ?? 'بدون برند'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-center text-xs sm:grid-cols-3 lg:w-72">
                    <div className="bg-nova-hover rounded-xl p-3">
                      <span className="text-nova-muted">قیمت</span>
                      <b className="mt-1 block">{formatPrice(p.price)}</b>
                    </div>
                    <div className="bg-nova-hover rounded-xl p-3">
                      <span className="text-nova-muted">موجودی</span>
                      <b
                        className={
                          stock <= 5
                            ? 'text-nova-danger mt-1 block'
                            : 'mt-1 block'
                        }
                      >
                        {formatNumber(stock)}
                      </b>
                    </div>
                    <div className="bg-nova-hover rounded-xl p-3">
                      <span className="text-nova-muted">نظرات</span>
                      <b className="mt-1 block">
                        {formatNumber(p._count.reviews)}
                      </b>
                    </div>
                  </div>
                  <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
                    <Badge>
                      {PRODUCT_STATUS_LABELS[p.status as ProductStatus] ??
                        p.status}
                    </Badge>
                    <Link href={`/admin/products/${p.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit3 size={14} />
                        ویرایش
                      </Button>
                    </Link>
                    {p.status === 'ARCHIVED' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={restore.isPending}
                        onClick={() => restore.mutate(p.id)}
                      >
                        <Archive size={14} />
                        بازگردانی
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={archive.isPending}
                        onClick={() => requestDelete(p.id)}
                      >
                        <Archive size={14} />
                        آرشیو
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!list.length && (
            <QueryEmpty
              title={
                search || status !== 'ALL'
                  ? 'محصولی با این مشخصات پیدا نشد'
                  : 'هنوز محصولی ثبت نشده است'
              }
              description={
                search || status !== 'ALL'
                  ? 'جستجو یا فیلتر وضعیت را تغییر بده.'
                  : 'اولین محصول را از دکمه «محصول جدید» اضافه کن.'
              }
            />
          )}
        </CardContent>
      </Card>

      {data && data.total > data.pageSize && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            قبلی
          </Button>
          <span className="bg-nova-surface min-w-20 rounded-xl px-4 py-2 text-center text-sm font-bold shadow-sm">
            {page}
          </span>
          <Button
            variant="outline"
            disabled={!data.hasMore || isFetching}
            onClick={() => setPage((current) => current + 1)}
          >
            بعدی
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="آرشیو محصول"
        description="آیا مطمئن هستید این محصول از ویترین فعال خارج شود؟"
        busy={archive.isPending}
        onClose={cancel}
        onConfirm={confirm}
      />
    </main>
  );
}
