// src/features/wishlist/components/wishlist-toggle.tsx
'use client';

import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useWishlist, useWishlistActions } from '../hooks/use-wishlist';

export function WishlistToggle({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const { data, isLoading } = useWishlist();
  const { status } = useSession();
  const { toggle, isToggling } = useWishlistActions();
  const wished =
    data?.items.some((item) => item.product.id === productId) ?? false;
  const busy = isLoading || isToggling(productId);

  const handleClick = () => {
    if (status !== 'authenticated') {
      toast('برای ذخیره محصول ابتدا وارد حساب شوید.');
      return;
    }
    toggle(productId, !wished);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === 'loading' || busy}
      aria-label={wished ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      aria-pressed={wished}
      title={wished ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      className={`rounded-2xl border p-2.5 transition hover:bg-[#f2efe8] disabled:cursor-wait disabled:opacity-50 ${wished ? 'text-nova-danger border-[#ffd2d2] bg-[#fff2f2]' : 'bg-nova-surface text-nova-ink border-[#e0dacf]'} ${className}`}
    >
      <Heart
        size={16}
        fill={wished ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  );
}
