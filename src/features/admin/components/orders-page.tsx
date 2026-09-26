// src/features/admin/components/orders-page.tsx
'use client';
import { SearchField } from '@/components/shared';
import { QueryEmpty, QueryError } from '@/components/shared/query-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { ORDER_STATUS_LABELS } from '@/constants/constants';
import { formatDateTime, formatPrice } from '@/lib/utils';
import { Eye, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAdminOrderActions, useAdminOrders } from '../hooks/use-admin';
import { AdminListSkeleton } from './admin-list-skeleton';
import { AdminPageHeader } from './admin-page-header';
import { AdminPagination } from './admin-pagination';

const STATUSES = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;
type Status = (typeof STATUSES)[number];

export function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | Status>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminOrders({
    page,
  });
  const { update } = useAdminOrderActions();

  const list = (data?.items ?? []).filter(
    (order) =>
      (status === 'ALL' || order.orderStatus === status) &&
      `${order.orderNumber} ${order.user.name ?? ''} ${order.user.email ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  if (isLoading) return <AdminListSkeleton rows={5} withThumbnail={false} />;
  if (isError)
    return (
      <QueryError
        message="دریافت سفارش‌ها ناموفق بود."
        onRetry={() => refetch()}
      />
    );

  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow="مدیریت / سفارش‌ها"
        title="سفارش‌ها"
        description="پیگیری وضعیت، پرداخت و ارسال."
        controls={
          <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_176px]">
            <SearchField
              value={search}
              onChange={setSearch}
              className="w-full"
              placeholder="شماره سفارش یا مشتری..."
            />
            <Select
              className="w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ALL' | Status)}
            >
              <option value="ALL">همه وضعیت‌ها</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
        }
      />
      <div
        className={`mt-6 space-y-3 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
      >
        {list.map((o) => (
          <Card key={o.id}>
            <CardContent>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{o.orderNumber}</p>
                    <Badge>
                      {ORDER_STATUS_LABELS[o.orderStatus] ?? o.orderStatus}
                    </Badge>
                  </div>
                  <p className="text-nova-primary mt-1 text-sm">
                    {o.user.name ?? 'بدون نام'} · {o.user.email}
                  </p>
                  <p className="text-nova-muted mt-1 text-xs">
                    {formatDateTime(o.createdAt)} · {o.items.length} قلم ·{' '}
                    {formatPrice(o.total)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={o.orderStatus === s ? 'default' : 'outline'}
                      disabled={update.isPending || o.orderStatus === s}
                      onClick={() =>
                        update.mutate({ orderId: o.id, orderStatus: s })
                      }
                    >
                      {ORDER_STATUS_LABELS[s]}
                    </Button>
                  ))}
                  <Link href={`/admin/orders/${o.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye size={14} />
                      جزئیات
                    </Button>
                  </Link>
                  {o.shipment?.trackingNumber && (
                    <span className="bg-nova-hover text-nova-primary inline-flex items-center gap-1 rounded-xl px-3 text-xs">
                      <Truck size={13} />
                      {o.shipment.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!list.length && (
          <QueryEmpty
            title={
              search || status !== 'ALL'
                ? 'سفارشی پیدا نشد'
                : 'هنوز سفارشی ثبت نشده است'
            }
            description={
              search || status !== 'ALL'
                ? 'جستجو یا فیلتر وضعیت را تغییر بده.'
                : 'با ثبت اولین سفارش مشتری‌ها، اینجا نمایش داده می‌شود.'
            }
          />
        )}
      </div>
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
