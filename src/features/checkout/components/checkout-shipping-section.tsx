// src/features/checkout/components/checkout-shipping-section.tsx
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COSTS } from '@/constants/constants';
import { CheckoutSectionTitle } from './checkout-section-title';
import type { ShippingMethod } from '../types/checkout-types';

const SHIPPING_OPTIONS: Array<{
  id: ShippingMethod;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'STANDARD',
    title: 'ارسال استاندارد',
    description: '۳ تا ۵ روز کاری',
    icon: '🚚',
  },
  {
    id: 'EXPRESS',
    title: 'ارسال اکسپرس',
    description: '۱ تا ۲ روز کاری',
    icon: '⚡',
  },
  {
    id: 'FREE',
    title: 'ارسال رایگان',
    description: `برای سفارش بالای ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
    icon: '🎁',
  },
];

export function CheckoutShippingSection({
  shippingMethod,
  hasFreeShipping,
  onChange,
}: {
  shippingMethod: ShippingMethod;
  hasFreeShipping: boolean;
  onChange: (method: ShippingMethod) => void;
}) {
  return (
    <Card className="rounded-3xl border shadow-sm">
      <CardContent className="p-5 md:p-7">
        <CheckoutSectionTitle number="۲" title="روش ارسال" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {SHIPPING_OPTIONS.map((option) => {
            const isFreeUnavailable = option.id === 'FREE' && !hasFreeShipping;
            const isSelected = shippingMethod === option.id;
            const price =
              option.id === 'FREE' && hasFreeShipping
                ? 0
                : SHIPPING_COSTS[option.id];
            return (
              <button
                key={option.id}
                type="button"
                disabled={isFreeUnavailable}
                onClick={() => onChange(option.id)}
                className={`rounded-2xl border p-4 text-right transition ${isSelected ? 'border-primary bg-primary/5 ring-primary/10 ring-2' : 'hover:border-foreground/20'} ${isFreeUnavailable ? 'cursor-not-allowed opacity-45' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xl">{option.icon}</span>
                  {isSelected && <Check className="text-primary size-5" />}
                </div>
                <p className="mt-3 font-bold">{option.title}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {option.description}
                </p>
                <p className="mt-3 text-sm font-black">{formatPrice(price)}</p>
              </button>
            );
          })}
        </div>
        {!hasFreeShipping && (
          <p className="text-muted-foreground mt-3 text-xs">
            برای فعال شدن ارسال رایگان، مبلغ نهایی کالاها باید حداقل{' '}
            {formatPrice(FREE_SHIPPING_THRESHOLD)} باشد.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
