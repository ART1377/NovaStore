// src/features/orders/components/order-tracking-page.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { AccountOrderDetail } from '../api/orders-server.api';

const ORDER_TRACKING_STEPS = [
  'ثبت سفارش',
  'پرداخت تایید شد',
  'در حال پردازش',
  'ارسال شد',
  'تحویل شد',
] as const;

const ORDER_STATUS_INDEX: Partial<Record<string, number>> = {
  PENDING: 0,
  PAID: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
};

export function OrderTrackingPage({ order }: { order: AccountOrderDetail }) {
  const currentStep = ORDER_STATUS_INDEX[order.orderStatus] ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-nova-primary text-xs">نووا / رهگیری سفارش</p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="mt-2 text-4xl font-black">پیگیری سفارش</h1>
        <Badge>{order.orderNumber}</Badge>
      </div>
      <Card className="mt-8">
        <CardContent>
          <h2 className="font-bold">وضعیت سفارش</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-5">
            {ORDER_TRACKING_STEPS.map((step, index) => (
              <div key={step} className="text-center">
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${index <= currentStep ? 'bg-nova-ink text-white' : 'bg-nova-soft text-nova-muted'}`}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-sm">{step}</p>
                {index < ORDER_TRACKING_STEPS.length - 1 && (
                  <div
                    className={`mx-auto mt-3 h-1 max-w-24 rounded ${index < currentStep ? 'bg-nova-ink' : 'bg-nova-soft'}`}
                  />
                )}
              </div>
            ))}
          </div>
          {order.orderStatus === 'CANCELLED' && (
            <div className="bg-nova-danger-soft text-nova-danger mt-6 rounded-xl p-4 text-sm">
              این سفارش لغو شده است.
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent>
            <h2 className="font-bold">اقلام سفارش</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-3 text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <b>{formatPrice(item.unitPrice * item.quantity)}</b>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-bold">خلاصه پرداخت</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>جمع کالا</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>تخفیف</span>
                <span>{formatPrice(order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>ارسال</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="bg-nova-soft h-px" />
              <div className="flex justify-between font-bold">
                <span>مجموع</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
            <p className="text-nova-primary mt-5 text-xs">
              کد رهگیری:{' '}
              {order.shipment?.trackingNumber ?? 'پس از ارسال ایجاد می‌شود'}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
