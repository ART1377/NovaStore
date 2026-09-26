// src/features/checkout/components/checkout-coupon-section.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { Tag, X } from 'lucide-react';
import type { CouponPreview } from '../types/checkout-types';
import { CheckoutSectionTitle } from './checkout-section-title';

export function CheckoutCouponSection({
  couponCode,
  onCodeChange,
  coupon,
  message,
  messageType,
  isPending,
  onApply,
  onClear,
}: {
  couponCode: string;
  onCodeChange: (value: string) => void;
  coupon: CouponPreview | null;
  message: string;
  messageType: 'success' | 'error' | '';
  isPending: boolean;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <Card className="rounded-3xl border shadow-sm">
      <CardContent className="p-5 md:p-7">
        <CheckoutSectionTitle number="۳" title="کد تخفیف" />
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Tag className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
            <Input
              value={couponCode}
              disabled={isPending}
              onChange={(event) =>
                onCodeChange(event.target.value.toUpperCase())
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') onApply();
              }}
              placeholder="مثلاً WELCOME20"
              className="pr-10 pl-10"
            />
            {couponCode && (
              <button
                type="button"
                onClick={onClear}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={onApply}
            className="sm:w-28"
          >
            {isPending ? 'بررسی...' : 'اعمال'}
          </Button>
        </div>
        {message && (
          <p
            className={`mt-3 text-sm font-medium ${messageType === 'success' ? 'text-emerald-600' : 'text-nova-danger'}`}
          >
            {message}
          </p>
        )}
        {coupon && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>تخفیف {coupon.code}</span>
            <span className="font-black">{formatPrice(coupon.discount)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
