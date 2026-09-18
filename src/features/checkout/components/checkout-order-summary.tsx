// src/features/checkout/components/checkout-order-summary.tsx
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { CheckoutPriceRow } from './checkout-price-row';
import type { Cart } from '@/features/cart/types/cart-types';

export function CheckoutOrderSummary({
  cart,
  subtotal,
  discount,
  shippingCost,
  total,
  canSubmit,
  isSubmitting,
  onSubmit,
}: {
  cart: Cart;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <Card className="rounded-3xl border shadow-sm">
        <CardContent className="p-5 md:p-6">
          <h2 className="text-lg font-black">خلاصه سفارش</h2>
          <div className="mt-5 max-h-64 space-y-4 overflow-auto pl-1">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <div className="min-w-0">
                  <p className="leading-6 font-bold">{item.product.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.variant?.name} × {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-bold">
                  {formatPrice(
                    (item.variant?.price ?? item.product.price) * item.quantity,
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-border my-5 h-px" />
          <div className="space-y-3 text-sm">
            <CheckoutPriceRow label="جمع کالاها" value={subtotal} />
            <CheckoutPriceRow
              label="تخفیف"
              value={-discount}
              positive={discount > 0}
            />
            <CheckoutPriceRow label="هزینه ارسال" value={shippingCost} />
          </div>
          <div className="bg-border my-5 h-px" />
          <div className="flex items-center justify-between">
            <span className="font-bold">مبلغ قابل پرداخت</span>
            <span className="text-2xl font-black">{formatPrice(total)}</span>
          </div>
          <div className="bg-muted/60 text-muted-foreground mt-4 rounded-2xl p-3 text-xs leading-6">
            پرداخت این نسخه آزمایشی است؛ قیمت، موجودی، تخفیف و هزینه ارسال در
            سمت سرور دوباره بررسی می‌شوند.
          </div>
          <Button
            className="mt-5 w-full rounded-xl"
            size="lg"
            disabled={!canSubmit || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? 'در حال ثبت سفارش...' : 'تأیید و ثبت سفارش'}
            <ChevronLeft className="mr-2 size-4" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
