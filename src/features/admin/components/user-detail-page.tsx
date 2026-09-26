// src/features/admin/components/user-detail-page.tsx
'use client';
import { QueryError } from '@/components/shared/query-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatPrice } from '@/lib/utils';
import { ArrowRight, Mail, MapPin, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useAdminUser } from '../hooks/use-admin';
import { AdminDetailSkeleton } from './admin-detail-skeleton';
export function UserDetailPage({ id }: { id: string }) {
  const { data, isLoading } = useAdminUser(id);
  if (isLoading) return <AdminDetailSkeleton />;
  if (!data) return <QueryError message="این مشتری پیدا نشد." />;
  return (
    <main className="w-full min-w-0">
      <Link
        href="/admin/users"
        className="text-nova-primary inline-flex items-center gap-1 text-xs"
      >
        <ArrowRight size={14} />
        بازگشت
      </Link>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-nova-muted text-xs">مشتری</p>
          <h1 className="mt-1 text-2xl font-black break-words sm:text-3xl">
            {data.name ?? 'بدون نام'}
          </h1>
          <p className="text-nova-primary mt-1 text-sm break-all">
            {data.email}
          </p>
        </div>
        <Badge>{data.role === 'ADMIN' ? 'مدیر' : 'کاربر'}</Badge>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <ShoppingCart size={16} />
            <p className="text-nova-primary mt-2 text-xs">سفارش‌ها</p>
            <b>{data._count.orders}</b>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Star size={16} />
            <p className="text-nova-primary mt-2 text-xs">نظرات</p>
            <b>{data._count.reviews}</b>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Mail size={16} />
            <p className="text-nova-primary mt-2 text-xs">اعلان‌ها</p>
            <b>{data._count.notifications}</b>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="font-bold">سفارش‌های اخیر</h2>
            <div className="mt-4 space-y-2">
              {!data.orders.length && (
                <p className="text-nova-muted py-6 text-center text-xs">
                  این مشتری هنوز سفارشی ثبت نکرده است.
                </p>
              )}
              {data.orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="hover:bg-nova-hover flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3"
                >
                  <span>
                    <b>{o.orderNumber}</b>
                    <span className="text-nova-primary mr-2 text-xs">
                      {formatDate(o.createdAt)}
                    </span>
                  </span>
                  <span className="text-sm">{formatPrice(o.total)}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-bold">آدرس‌ها</h2>
            <div className="mt-4 space-y-3">
              {!data.addresses.length && (
                <p className="text-nova-muted py-6 text-center text-xs">
                  آدرسی برای این مشتری ثبت نشده است.
                </p>
              )}
              {data.addresses.map((a) => (
                <div key={a.id} className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <MapPin size={15} />
                    {a.title}
                    {a.isDefault && <Badge>پیش‌فرض</Badge>}
                  </div>
                  <p className="mt-2 text-sm text-[#475569]">
                    {a.recipient} · {a.phone}
                  </p>
                  <p className="text-nova-primary mt-1 text-sm">
                    {a.state}، {a.city}، {a.street}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardContent>
          <h2 className="font-bold">نظرات ثبت‌شده</h2>
          <div className="mt-4 space-y-3">
            {!data.reviews.length && (
              <p className="text-nova-muted py-6 text-center text-xs">
                این مشتری هنوز نظری ثبت نکرده است.
              </p>
            )}
            {data.reviews.map((r) => (
              <div key={r.id} className="rounded-xl border p-4">
                <Link
                  href={`/products/${r.product.slug}`}
                  className="font-semibold"
                >
                  {r.product.name}
                </Link>
                <p className="mt-2 text-sm">{'★'.repeat(r.rating)} </p>
                <p className="mt-2 text-sm leading-6 text-[#475569]">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
