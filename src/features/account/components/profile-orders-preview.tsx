// src/features/account/components/profile-orders-preview.tsx
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ORDER_STATUS_LABELS,
  SHIPPING_STATUS_LABELS,
} from '@/constants/constants';
import type { Order } from '@/features/orders/api/orders.api';
import { formatDate, formatPrice } from '@/lib/utils';
import { ArrowLeft, Heart, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { QuickAccountCard } from './quick-account-card';

const RECENT_ORDER_LIMIT = 4;
const ORDER_SKELETON_COUNT = 3;

export function ProfileOrdersPreview({
  orders,
  isLoading,
}: {
  orders: Order[];
  isLoading: boolean;
}) {
  const recentOrders = orders.slice(0, RECENT_ORDER_LIMIT);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_310px]">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">آخرین سفارش‌ها</h2>
              <p className="text-nova-muted mt-1 text-xs">
                چهار سفارش اخیر را سریع ببین.
              </p>
            </div>
            <Link
              href="/account/orders"
              className="text-nova-primary inline-flex items-center gap-1 text-xs font-bold"
            >
              همه سفارش‌ها <ArrowLeft size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: ORDER_SKELETON_COUNT }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-2xl" />
              ))}
            </div>
          ) : recentOrders.length ? (
            <div className="mt-5 divide-y">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="hover:bg-nova-hover flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{order.orderNumber}</p>
                      <Badge>
                        {ORDER_STATUS_LABELS[order.orderStatus] ??
                          order.orderStatus}
                      </Badge>
                    </div>
                    <p className="text-nova-muted mt-1 text-xs">
                      {formatDate(order.createdAt)} · {order.items.length} قلم ·{' '}
                      {SHIPPING_STATUS_LABELS[order.shippingStatus] ??
                        order.shippingStatus}
                    </p>
                  </div>
                  <strong className="shrink-0 text-sm">
                    {formatPrice(order.total)}
                  </strong>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="هنوز سفارشی ثبت نکرده‌اید."
              description="اولین خریدت را شروع کن تا سابقه سفارش‌ها اینجا نمایش داده شود."
              action={{ label: 'رفتن به فروشگاه', href: '/products' }}
              className="border-0 px-2 py-10 shadow-none"
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <QuickAccountCard
          icon={MapPin}
          title="آدرس‌ها"
          description="مدیریت آدرس‌های ارسال"
          href="/account/profile"
        />
        <QuickAccountCard
          icon={Heart}
          title="علاقه‌مندی‌ها"
          description="محصولات ذخیره‌شده"
          href="/account/wishlist"
        />
        <QuickAccountCard
          icon={Package}
          title="پیگیری سفارش"
          description="جزئیات و وضعیت ارسال"
          href="/account/orders"
        />
      </div>
    </section>
  );
}
