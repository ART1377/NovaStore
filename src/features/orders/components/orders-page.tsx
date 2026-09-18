// src/features/orders/components/orders-page.tsx
'use client';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '../hooks/use-orders';
import { formatPrice, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/shared';
import {
  ORDER_STATUS_LABELS,
  SHIPPING_STATUS_LABELS,
} from '@/constants/constants';
export function OrdersPage() {
  const { data, isLoading } = useOrders();
  if (isLoading)
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-56" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      </main>
    );
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-nova-primary text-xs">نووا / حساب کاربری</p>
      <h1 className="mt-2 text-4xl font-black">سفارش‌های من</h1>
      <div className="mt-8 space-y-4">
        {data?.map((o) => (
          <Link href={`/account/orders/${o.id}`} key={o.id} className="block">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-sm">
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-nova-primary text-sm">{o.orderNumber}</p>
                    <p className="mt-1 text-sm">{formatDate(o.createdAt)}</p>
                  </div>
                  <Badge>{ORDER_STATUS_LABELS[o.orderStatus]}</Badge>
                  <strong>{formatPrice(o.total)}</strong>
                </div>
                <div className="text-nova-primary mt-4 border-t pt-4 text-sm">
                  {o.items.length} قلم · وضعیت ارسال:{' '}
                  {SHIPPING_STATUS_LABELS[o.shippingStatus]}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!data?.length && (
          <EmptyState
            icon={Package}
            title="هنوز سفارشی ثبت نکرده‌اید."
            description="بعد از ثبت سفارش، وضعیت و جزئیات خریدهایتان را اینجا خواهید دید."
            action={{ label: 'رفتن به فروشگاه', href: '/products' }}
          />
        )}
      </div>
    </main>
  );
}
