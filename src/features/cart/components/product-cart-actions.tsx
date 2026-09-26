// src/features/cart/components/product-cart-actions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { cn, formatNumber } from '@/lib/utils';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartActions, useCartItem } from '../hooks/use-cart';

type ProductCartActionsProps = {
  productId: string;
  variantId?: string;
  stock: number;
  compact?: boolean;
  iconOnlyWhenEmpty?: boolean;
  className?: string;
};

export function ProductCartActions({
  productId,
  variantId,
  stock,
  compact = false,
  iconOnlyWhenEmpty = false,
  className,
}: ProductCartActionsProps) {
  const { add, isAddingFor, update, remove, isUpdatingFor, isRemovingFor } =
    useCartActions();
  const item = useCartItem(productId, variantId);
  const quantity = item?.quantity ?? 0;
  const itemId = item?.id ?? '';
  const busy =
    isAddingFor(productId, variantId ?? '') ||
    isUpdatingFor(itemId) ||
    isRemovingFor(itemId);

  if (!variantId || stock < 1) {
    return (
      <Button
        type="button"
        disabled
        size={compact ? 'sm' : 'default'}
        className={cn(
          'shrink-0',
          compact && iconOnlyWhenEmpty && 'size-9 !p-0',
          compact && !iconOnlyWhenEmpty && 'h-9 px-3 text-xs',
          !compact && 'h-12 w-full',
          className,
        )}
        aria-label="ناموجود"
        title="ناموجود"
      >
        <ShoppingBag size={compact ? 15 : 17} />
        {iconOnlyWhenEmpty ? null : 'ناموجود'}
      </Button>
    );
  }

  const decrease = () => {
    if (!itemId || busy) return;
    if (quantity === 1) remove(itemId);
    else update({ itemId, quantity: quantity - 1 });
  };

  const increase = () => {
    if (!itemId || busy || quantity >= stock) return;
    update({ itemId, quantity: quantity + 1 });
  };

  if (quantity === 0) {
    return (
      <Button
        type="button"
        size={compact ? 'sm' : 'default'}
        className={cn(
          'shrink-0',
          compact && iconOnlyWhenEmpty && 'size-9 !p-0',
          compact && !iconOnlyWhenEmpty && 'h-9 px-3 text-xs',
          !compact && 'h-12 w-full',
          className,
        )}
        disabled={busy}
        onClick={() => add(productId, variantId)}
        aria-label="افزودن به سبد خرید"
        title="افزودن به سبد خرید"
      >
        {busy ? (
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <ShoppingBag size={compact ? 15 : 17} />
        )}
        {iconOnlyWhenEmpty ? null : busy ? 'در حال افزودن...' : 'افزودن به سبد'}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'border-nova-line bg-nova-surface inline-flex min-w-0 items-center overflow-hidden rounded-xl border',
        compact ? 'h-9 w-full' : 'h-12 w-full',
        className,
      )}
      dir="ltr"
      aria-label={`${formatNumber(quantity)} عدد در سبد خرید`}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={busy}
        aria-label={quantity === 1 ? 'حذف از سبد' : 'کاهش تعداد'}
        className="text-nova-ink hover:bg-nova-hover grid size-8 shrink-0 place-items-center transition disabled:cursor-wait disabled:opacity-40 sm:size-9"
      >
        {quantity === 1 ? (
          <Trash2 size={14} className="text-nova-danger" />
        ) : (
          <Minus size={14} />
        )}
      </button>
      <span
        className="text-nova-ink min-w-0 flex-1 px-1 text-center text-sm font-bold tabular-nums sm:min-w-10 sm:px-2"
        aria-live="polite"
      >
        {formatNumber(quantity)}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={busy || quantity >= stock}
        aria-label="افزایش تعداد"
        className="text-nova-ink hover:bg-nova-hover grid size-8 shrink-0 place-items-center transition disabled:cursor-not-allowed disabled:opacity-40 sm:size-9"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
