// src/features/catalog/components/quick-view.tsx
'use client';

import { ProductCartActions } from '@/features/cart/components/product-cart-actions';
import { useCartItem } from '@/features/cart/hooks/use-cart';
import { WishlistToggle } from '@/features/wishlist/components/wishlist-toggle';
import { formatNumber, formatPrice } from '@/lib/utils';
import { ArrowLeft, Star, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProduct } from '../hooks/use-catalog';
import type { Product } from '../types/catalog-types';
import { ProductImageGallery } from './product-image-gallery';

type QuickViewProps = {
  product: Product;
  onClose: () => void;
};

export function QuickView({ product, onClose }: QuickViewProps) {
  const productQuery = useProduct(product.slug);
  const viewProduct = productQuery.data ?? product;
  const variant = viewProduct.variants[0];
  const cartItem = useCartItem(viewProduct.id, variant?.id);
  const cartQuantity = cartItem?.quantity ?? 0;
  const isAvailable = Boolean(variant && variant.stock > 0);
  const rating = viewProduct.ratingAverage ?? 0;
  const ratingCount =
    viewProduct.ratingCount ?? viewProduct._count?.reviews ?? 0;
  const discounted = Boolean(
    viewProduct.compareAtPrice &&
    viewProduct.compareAtPrice > (variant?.price ?? viewProduct.price),
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="bg-nova-ink/70 fixed inset-0 z-120 overflow-y-auto p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`مشاهده سریع ${viewProduct.name}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="pointer-events-none flex min-h-full items-center justify-center">
        <div
          className="border-nova-line bg-nova-surface pointer-events-auto relative my-auto grid w-full max-w-4xl overflow-hidden rounded-[30px] border shadow-[0_30px_90px_-35px_rgba(15,23,42,.65)] md:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="border-nova-line bg-nova-paper/95 text-nova-ink hover:bg-nova-paper absolute top-3 left-3 z-20 grid size-10 place-items-center rounded-2xl border shadow-md backdrop-blur transition"
            aria-label="بستن"
          >
            <X size={19} />
          </button>

          <div className="bg-nova-bg-alt p-3 sm:p-4">
            <ProductImageGallery
              images={viewProduct.images}
              productName={viewProduct.name}
              compact
            />
          </div>

          <div className="flex min-w-0 flex-col p-5 sm:p-7">
            <div className="text-nova-muted flex items-center justify-between gap-3 pr-12 text-xs">
              <span className="truncate">
                {viewProduct.brand?.name ?? 'بدون برند'}
              </span>
              <span className="bg-nova-hover text-nova-primary shrink-0 rounded-full px-2.5 py-1 font-semibold">
                {viewProduct.category.name}
              </span>
            </div>

            <h2 className="text-nova-ink mt-3 text-xl leading-8 font-black sm:text-2xl">
              {viewProduct.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="bg-nova-accent/10 text-nova-accent inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold">
                <Star size={13} fill="currentColor" />
                {rating
                  ? rating.toLocaleString('fa-IR', { maximumFractionDigits: 1 })
                  : 'بدون امتیاز'}
              </span>
              <span className="text-nova-muted text-xs">
                {formatNumber(ratingCount)} نظر
              </span>
              {isAvailable ? (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  موجود
                </span>
              ) : (
                <span className="bg-nova-danger-soft text-nova-danger rounded-full px-2.5 py-1 text-xs font-bold">
                  ناموجود
                </span>
              )}
            </div>

            <p className="text-nova-primary mt-4 line-clamp-4 text-sm leading-7 sm:line-clamp-5">
              {viewProduct.description ||
                'برای مشاهده مشخصات کامل، تنوع‌ها و جزئیات بیشتر وارد صفحه محصول شوید.'}
            </p>

            <div className="border-nova-line bg-nova-hover/50 mt-6 rounded-2xl border p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-nova-muted text-[11px] font-semibold">
                    قیمت
                  </p>
                  <div className="text-nova-ink mt-1 text-2xl font-black tracking-[-.025em] break-words">
                    {formatPrice(variant?.price ?? viewProduct.price)}
                  </div>
                  {discounted ? (
                    <div className="text-nova-muted mt-1 text-xs line-through">
                      {formatPrice(viewProduct.compareAtPrice!)}
                    </div>
                  ) : null}
                </div>
                {variant ? (
                  <div className="text-nova-muted text-left text-[11px] leading-5">
                    <div>کد مدل: {variant.sku}</div>
                    <div>موجودی: {formatNumber(variant.stock)} عدد</div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <ProductCartActions
                  productId={viewProduct.id}
                  variantId={variant?.id}
                  stock={variant?.stock ?? 0}
                />
                <WishlistToggle
                  productId={viewProduct.id}
                  className="grid h-12 w-full place-items-center rounded-2xl p-0 sm:w-12"
                />
              </div>
              {cartQuantity > 0 ? (
                <p className="text-nova-muted mt-2 text-center text-[11px] font-semibold">
                  این محصول در سبد خرید شماست · {formatNumber(cartQuantity)} عدد
                </p>
              ) : null}

              <Link
                href={`/products/${viewProduct.slug}`}
                onClick={onClose}
                className="border-nova-line-strong bg-nova-surface text-nova-ink hover:bg-nova-hover mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition"
              >
                مشاهده جزئیات کامل
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
