// src/features/catalog/components/product-card.tsx
'use client';

import { ProductCartActions } from '@/features/cart/components/product-cart-actions';
import { useCartItem } from '@/features/cart/hooks/use-cart';
import { useCompare } from '@/features/compare/hooks/use-compare';
import { WishlistToggle } from '@/features/wishlist/components/wishlist-toggle';
import { formatPrice } from '@/lib/utils';
import { ArrowUpLeft, GitCompareArrows, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import type { Product } from '../types/catalog-types';
import { ProductImagePlaceholder } from './product-image-placeholder';
import { QuickView } from './quick-view';

export const ProductCard = memo(function ProductCard({
  product,
}: {
  product: Product;
}) {
  const variant = product.variants[0];
  const cartItem = useCartItem(product.id, variant?.id);
  const cartQuantity = cartItem?.quantity ?? 0;
  const { toggle, has } = useCompare();
  const discounted = Boolean(
    product.compareAtPrice &&
    product.compareAtPrice > (variant?.price ?? product.price),
  );
  const compareActive = has(product.slug);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const price = variant?.price ?? product.price;

  return (
    <article className="group/card border-nova-line bg-nova-surface flex h-full min-w-0 flex-col overflow-hidden rounded-[26px] border shadow-[0_12px_40px_-30px_rgba(17,24,39,.35)] transition-shadow hover:shadow-[0_22px_55px_-30px_rgba(17,24,39,.45)]">
      <div className="bg-nova-soft relative aspect-[.94] shrink-0 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block h-full">
          {product.images[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt ?? product.name}
              fill
              className="object-cover transition duration-700 group-hover/card:scale-[1.045]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : (
            <ProductImagePlaceholder />
          )}
        </Link>
        <div className="absolute top-3 right-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
          {discounted ? (
            <span className="bg-nova-accent rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              پیشنهاد
            </span>
          ) : null}
          {variant?.stock && variant.stock <= 5 ? (
            <span className="bg-nova-surface/90 text-nova-danger rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur">
              موجودی محدود
            </span>
          ) : null}
        </div>
        <div className="absolute right-3 bottom-3 left-3 z-10 flex items-center gap-2 opacity-100 transition duration-200 md:translate-y-2 md:opacity-0 md:group-focus-within/card:translate-y-0 md:group-focus-within/card:opacity-100 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100">
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="bg-nova-surface text-nova-ink hover:bg-nova-paper min-w-0 flex-1 rounded-2xl shadow-lg transition"
          >
            <span className="flex h-9 items-center justify-center gap-1.5 px-3 text-sm font-semibold">
              مشاهده سریع <ArrowUpLeft size={14} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              const added = toggle(product.slug);
              if (added === false)
                toast.error('حداکثر ۴ محصول قابل مقایسه است');
              else
                toast.success(
                  compareActive ? 'از مقایسه حذف شد' : 'به مقایسه اضافه شد',
                );
            }}
            className={`grid size-9 shrink-0 place-items-center rounded-2xl border backdrop-blur ${compareActive ? 'border-nova-ink bg-nova-ink text-white' : 'border-nova-line bg-nova-surface/95 text-nova-ink'}`}
            aria-label="مقایسه"
            title="مقایسه"
          >
            <GitCompareArrows size={16} />
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="text-nova-muted flex min-w-0 items-center justify-between gap-3 text-[11px]">
          <div className="flex min-w-0 items-center gap-1.5 truncate">
            <span className="truncate">
              {product.brand?.name ?? 'بدون برند'}
            </span>
            <span aria-hidden="true">/</span>
            <span className="truncate">{product.category.name}</span>
          </div>

          {(product.ratingCount ?? product._count?.reviews ?? 0) > 0 &&
          product.ratingAverage != null ? (
            <span
              className="bg-nova-accent/10 text-nova-accent inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2 text-[11px] font-bold tabular-nums"
              aria-label={`${product.ratingCount ?? product._count?.reviews ?? 0} نظر ثبت شده`}
              title={`${product.ratingCount ?? product._count?.reviews ?? 0} نظر ثبت شده`}
            >
              <Star size={11} fill="currentColor" />
              {product.ratingAverage.toLocaleString('fa-IR', {
                maximumFractionDigits: 1,
              })}
            </span>
          ) : null}
        </div>
        <Link href={`/products/${product.slug}`} className="block min-w-0">
          <h3 className="text-nova-ink mt-2 line-clamp-2 min-h-12 text-sm leading-6 font-bold sm:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="mt-4 min-w-0">
          <div className="text-nova-ink text-[clamp(.95rem,1.8vw,1.125rem)] leading-6 font-black tracking-[-.02em] [overflow-wrap:anywhere]">
            {formatPrice(price)}
          </div>
          {discounted ? (
            <div className="text-nova-muted mt-0.5 text-xs [overflow-wrap:anywhere] line-through">
              {formatPrice(product.compareAtPrice!)}
            </div>
          ) : null}
        </div>

        <div className="mt-auto min-w-0 pt-4">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <WishlistToggle
              productId={product.id}
              className="grid size-9 shrink-0 place-items-center p-0"
            />
            <ProductCartActions
              productId={product.id}
              variantId={variant?.id}
              stock={variant?.stock ?? 0}
              compact
              iconOnlyWhenEmpty
              className={cartQuantity > 0 ? 'w-full' : 'size-9'}
            />
          </div>
        </div>
      </div>

      {quickViewOpen ? (
        <QuickView product={product} onClose={() => setQuickViewOpen(false)} />
      ) : null}
    </article>
  );
});
