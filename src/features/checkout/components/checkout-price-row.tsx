// src/features/checkout/components/checkout-price-row.tsx
import { formatPrice } from '@/lib/utils';

export function CheckoutPriceRow({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={positive ? 'font-bold text-emerald-600' : 'font-medium'}>
        {value < 0 ? `− ${formatPrice(Math.abs(value))}` : formatPrice(value)}
      </span>
    </div>
  );
}
