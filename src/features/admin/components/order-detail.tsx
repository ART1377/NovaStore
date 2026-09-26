// src/features/admin/components/order-detail.tsx
'use client';
import { QueryError } from '@/components/shared/query-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type {
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from '@/constants/constants';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUSES,
  SHIPPING_STATUS_LABELS,
  SHIPPING_STATUSES,
} from '@/constants/constants';
import { formatDateTime, formatPrice } from '@/lib/utils';
import { ArrowRight, PackageCheck, Save, Truck, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useAdminOrderDetail } from '../hooks/use-admin-order-detail';
import { AdminDetailSkeleton } from './admin-detail-skeleton';
import { OrderInfo } from './order-info';
export function AdminOrderDetail({ id }: { id: string }) {
  const {
    data,
    isLoading,
    error,
    update,
    status,
    payment,
    shipping,
    tracking,
    trackingError,
    setStatus,
    setPayment,
    setShipping,
    setTracking,
    submitUpdate,
  } = useAdminOrderDetail(id);

  if (isLoading) return <AdminDetailSkeleton />;
  if (error || !data)
    return <QueryError message="این سفارش پیدا نشد یا دریافت آن ناموفق بود." />;
  return (
    <main className="w-full min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="text-nova-primary inline-flex items-center gap-1 text-xs"
          >
            <ArrowRight size={14} />
            بازگشت به سفارش‌ها
          </Link>
          <h1 className="mt-2 text-2xl font-black break-words sm:text-3xl">
            {data.orderNumber}
          </h1>
          <p className="text-nova-primary mt-1 text-sm">
            {formatDateTime(data.createdAt)}
          </p>
        </div>
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-bold">اقلام سفارش</h2>
              <div className="mt-4 divide-y">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-nova-primary mt-1 text-xs">
                        {item.variant?.name ?? 'مدل اصلی'} · {item.quantity} عدد
                      </p>
                    </div>
                    <span className="font-bold">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <UserRound size={17} />
                <h2 className="font-bold">مشتری و آدرس</h2>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <OrderInfo label="مشتری" value={data.user.name ?? 'بدون نام'} />
                <OrderInfo label="ایمیل" value={data.user.email ?? '—'} />
                <OrderInfo label="گیرنده" value={data.address.recipient} />
                <OrderInfo label="تلفن" value={data.address.phone} />
                <OrderInfo
                  label="استان / شهر"
                  value={`${data.address.state} / ${data.address.city}`}
                />
                <OrderInfo label="کدپستی" value={data.address.postalCode} />
                <div className="sm:col-span-2">
                  <OrderInfo label="نشانی" value={data.address.street} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-bold">مبلغ</h2>
              <div className="mt-4 space-y-3 text-sm">
                <OrderInfo
                  label="جمع محصولات"
                  value={formatPrice(data.subtotal)}
                />
                <OrderInfo
                  label="تخفیف"
                  value={`- ${formatPrice(data.discount)}`}
                />
                <OrderInfo
                  label="ارسال"
                  value={formatPrice(data.shippingCost)}
                />
                <div className="border-t pt-3">
                  <OrderInfo
                    label="مبلغ نهایی"
                    value={formatPrice(data.total)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <PackageCheck size={17} />
                <h2 className="font-bold">عملیات سفارش</h2>
              </div>
              <div className="mt-4 space-y-3">
                <label className="grid gap-2 text-xs font-semibold">
                  وضعیت سفارش
                  <Select
                    disabled={update.isPending}
                    value={status ?? data.orderStatus}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="grid gap-2 text-xs font-semibold">
                  وضعیت پرداخت
                  <Select
                    disabled={update.isPending}
                    value={payment ?? data.paymentStatus}
                    onChange={(e) =>
                      setPayment(e.target.value as PaymentStatus)
                    }
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {PAYMENT_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="grid gap-2 text-xs font-semibold">
                  وضعیت ارسال
                  <Select
                    disabled={update.isPending}
                    value={shipping ?? data.shippingStatus}
                    onChange={(e) =>
                      setShipping(e.target.value as ShippingStatus)
                    }
                  >
                    {SHIPPING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {SHIPPING_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="grid gap-2 text-xs font-semibold">
                  <span className="flex items-center gap-2">
                    <Truck size={14} />
                    کد رهگیری
                  </span>
                  <Input
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="اختیاری"
                    aria-invalid={!!trackingError}
                  />
                  <p className="text-nova-danger min-h-5 text-xs font-medium">
                    {trackingError}
                  </p>
                </label>
                <Button
                  className="w-full"
                  disabled={update.isPending}
                  onClick={submitUpdate}
                >
                  <Save size={15} />
                  {update.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
