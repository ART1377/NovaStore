// src/features/cart/components/cart-quantity-controls.tsx
'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartActions } from '../hooks/use-cart';
import { cn, formatNumber } from '@/lib/utils';

export function CartQuantityControls({
  cartItemId,
  quantity,
  stock,
  className,
}: {
  cartItemId: string;
  quantity: number;
  stock: number;
  className?: string;
}) {
  const { update, remove, isUpdating, isRemoving } = useCartActions();
  const busy = isUpdating || isRemoving;

  const decrease = () => {
    if (!cartItemId) return;
    if (quantity <= 1) remove(cartItemId);
    else update({ itemId: cartItemId, quantity: quantity - 1 });
  };

  return (
    <div
      className={cn(
        'border-nova-line bg-nova-surface inline-flex h-10 items-center overflow-hidden rounded-xl border',
        className,
      )}
      dir="ltr"
    >
      <button
        type="button"
        aria-label={quantity <= 1 ? 'حذف از سبد' : 'کاهش تعداد'}
        onClick={decrease}
        disabled={busy}
        className="text-nova-ink hover:bg-nova-hover grid size-10 place-items-center transition disabled:opacity-40"
      >
        {quantity <= 1 ? (
          <Trash2 size={15} className="text-nova-danger" />
        ) : (
          <Minus size={15} />
        )}
      </button>
      <span
        aria-live="polite"
        className="text-nova-ink min-w-10 px-2 text-center text-sm font-bold"
      >
        {formatNumber(quantity)}
      </span>
      <button
        type="button"
        aria-label="افزایش تعداد"
        onClick={() =>
          cartItemId && update({ itemId: cartItemId, quantity: quantity + 1 })
        }
        disabled={busy || quantity >= stock}
        className="text-nova-ink hover:bg-nova-hover grid size-10 place-items-center transition disabled:opacity-40"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
