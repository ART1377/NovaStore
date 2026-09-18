// src/features/catalog/components/product-detail.tsx
'use client';

import Link from 'next/link';
import {
  Star,
  Truck,
  ShieldCheck,
  GitCompareArrows,
  CheckCircle2,
  MessageSquare,
  PackageX,
} from 'lucide-react';
import type { Product } from '../types/catalog-types';
import { formatPrice, formatNumber } from '@/lib/utils';
import { useProductDetail } from '../hooks/use-product-detail';
import { Button } from '@/components/ui/button';
import { ProductCartActions } from '@/features/cart/components/product-cart-actions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewForm } from './review-form';
import { ProductImageGallery } from './product-image-gallery';
import { ProductGrid } from './product-grid';
import { WishlistToggle } from '@/features/wishlist/components/wishlist-toggle';
import { ReviewThread } from './review-thread';
import { ProductInfoCard } from './product-info-card';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductDetail({
  slug,
  initialProduct,
}: {
  slug: string;
  initialProduct: Product;
}) {
  const detail = useProductDetail(slug, initialProduct);
  const reducedMotion = useReducedMotion() === true;
  const reveal = (delay = 0) =>
    reducedMotion
      ? { opacity: 1, x: 0, y: 0, scale: 1 }
      : { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.72, delay, ease } };
  const hidden = reducedMotion
    ? { opacity: 1, x: 0, y: 0, scale: 1 }
    : { opacity: 0, x: 0, y: 26, scale: 0.985 };
  const { product, variant, cartItem, isLoading, error, isFetching, compareActive, toggleCompare, price, discounted, average, ratingCount, ratingDistribution, available, cartQuantity } = detail;

  if (isLoading || !product)
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="bg-nova-soft aspect-square animate-pulse rounded-3xl" />
          <div className="space-y-4">
            <div className="bg-nova-soft h-5 w-32 animate-pulse rounded" />
            <div className="bg-nova-soft h-12 w-3/4 animate-pulse rounded" />
            <div className="bg-nova-soft h-32 animate-pulse rounded" />
          </div>
        </div>
      </main>
    );
  if (error || !product)
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center">
        <PackageX size={44} strokeWidth={1.7} className="text-nova-muted mx-auto" />
        <h1 className="mt-4 text-3xl font-black">محصول پیدا نشد</h1>
        <p className="text-nova-primary mt-2 text-sm">
          این محصول حذف شده یا آدرس آن اشتباه است.
        </p>
        <Link href="/products">
          <Button className="mt-5">بازگشت به فروشگاه</Button>
        </Link>
      </main>
    );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {isFetching && initialProduct ? (
        <div className="text-nova-muted mb-4 flex items-center gap-2 text-xs">
          <span className="bg-nova-hover h-2 w-2 animate-pulse rounded-full" />{' '}
          در حال به‌روزرسانی موجودی و قیمت…
        </div>
      ) : null}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={reveal(0)} className="text-nova-muted mb-5 flex items-center gap-2 text-xs">
        <Link href="/products" className="hover:text-nova-ink">
          فروشگاه
        </Link>
        <span>/</span>
        <span>{product.category.name}</span>
        <span>/</span>
        <span className="text-[#475569]">{product.name}</span>
      </motion.div>
      <div className="grid gap-8 lg:grid-cols-[1.02fr_.98fr]">
        <motion.div initial={{ opacity: 0, x: 42, scale: 0.97 }} animate={reveal(0.08)} whileHover={reducedMotion ? undefined : { y: -6, scale: 1.01 }} transition={{ duration: 0.75, ease }} className="min-w-0">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </motion.div>
        <motion.div className="min-w-0 lg:py-3" initial={hidden} animate={reveal(0.14)}>
          <motion.div className="flex items-center justify-between gap-3" initial={{ opacity: 0, y: 16 }} animate={reveal(0.18)}>
            <div className="text-nova-primary flex items-center gap-2 text-sm">
              <span>{product.brand?.name ?? 'بدون برند'}</span>
              <span>•</span>
              <span>{product.category.name}</span>
            </div>
            <button
              type="button"
              onClick={toggleCompare}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${compareActive ? 'bg-nova-primary text-white' : ''}`}
            >
              <GitCompareArrows size={15} />
              مقایسه
            </button>
          </motion.div>
          <motion.h1
            className="mt-4 text-3xl leading-tight font-black sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.82, delay: 0.22, ease }}
          >
            {product.name}
          </motion.h1>
          <motion.div className="mt-4 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 16 }} animate={reveal(0.28)}>
            <div className="flex items-center gap-1 rounded-full bg-[#fff0ee] px-3 py-1.5 text-sm font-bold text-[#d84f47]">
              <Star size={15} fill="currentColor" />
              {average ? average.toFixed(1) : 'بدون امتیاز'}
            </div>
            <span className="text-nova-primary text-sm">
              {formatNumber(ratingCount)} نظر مشتریان
            </span>
          </motion.div>
          <motion.div className="mt-7 flex flex-wrap items-end gap-3" initial={{ opacity: 0, y: 16 }} animate={reveal(0.36)}>
            <span className="text-3xl font-black">{formatPrice(price)}</span>
            {discounted ? (
              <span className="text-nova-muted text-sm line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            ) : null}
          </motion.div>
          {discounted ? (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={reveal(0.42)} className="text-nova-accent mt-1 text-sm font-bold">
              {Math.round((1 - price / product.compareAtPrice!) * 100)}٪ تخفیف
            </motion.p>
          ) : null}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={reveal(0.48)} className="mt-6 text-sm leading-8 text-[#475569]">
            {product.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={reveal(0.56)} className="border-nova-line bg-nova-surface mt-7 rounded-[22px] border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">انتخاب مدل</p>
              <span className="text-nova-muted text-xs">
                {variant?.stock ?? 0} عدد موجود
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((item) => (
                <button
                  type="button"
                  disabled={item.stock === 0}
                  key={item.id}
                  onClick={() => detail.selectVariant(item.id)}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${variant?.id === item.id ? 'border-nova-primary bg-nova-primary text-white' : 'hover:bg-nova-hover'} disabled:cursor-not-allowed disabled:opacity-35`}
                >
                  {item.name}
                  {item.color ? ` · ${item.color}` : ''}
                  {item.size ? ` · ${item.size}` : ''}
                </button>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={reveal(0.64)} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <div className="sr-only" aria-live="polite">
              {cartQuantity > 0
                ? `${cartQuantity} عدد از این محصول در سبد خرید شماست`
                : 'این محصول در سبد شما نیست'}
            </div>
            <ProductCartActions
              productId={product.id}
              variantId={variant?.id}
              stock={variant?.stock ?? 0}
              className="h-12 w-full flex-1"
            />
            <WishlistToggle
              productId={product.id}
              className="grid h-12 w-12 shrink-0 place-items-center p-0"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={reveal(0.72)} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ProductInfoCard
              icon={<Truck size={19} />}
              title="ارسال سریع"
              text="انتخاب روش ارسال در تسویه"
            />
            <ProductInfoCard
              icon={<ShieldCheck size={19} />}
              title="خرید مطمئن"
              text="قیمت و موجودی از سرور"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={reveal(0.8)} whileHover={reducedMotion ? undefined : { y: -2 }} className="bg-nova-surface mt-4 rounded-2xl p-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
              <div>
                <b>موجودی واقعی</b>
                <p className="text-nova-primary mt-1">
                  رزرو موجودی هنگام ثبت سفارش با تراکنش دیتابیس انجام می‌شود.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.section initial={{ opacity: 0, y: 30 }} animate={reveal(0.88)} className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-nova-muted text-xs">اعتماد مشتری</p>
            <h2 className="mt-1 text-2xl font-black">نظرات کاربران</h2>
          </div>
          <Badge>{formatNumber(ratingCount)} نظر</Badge>
        </div>
        <div className="border-nova-line bg-nova-surface mt-5 rounded-3xl border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-nova-muted text-xs">امتیاز خرید</p>
              <h3 className="mt-1 text-lg font-black">رضایت مشتریان</h3>
            </div>
            <div className="text-3xl font-black text-[#172033]">
              {average ? average.toFixed(1) : '—'}
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = ratingDistribution[String(score)] ?? 0;
              const percent = ratingCount
                ? Math.round((count / ratingCount) * 100)
                : 0;
              return (
                <div key={score} className="flex items-center gap-2 text-xs">
                  <span className="text-nova-primary w-8">{score}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                    <div
                      className="bg-nova-accent h-full rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-nova-muted w-8 text-left">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {product.reviews?.length ? (
            product.reviews.map((review) => (
              <ReviewThread key={review.id} review={review} slug={slug} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <MessageSquare
                  size={30}
                  strokeWidth={1.7}
                  className="text-nova-muted"
                />
                <p className="text-nova-primary text-sm">
                  هنوز نظری برای این محصول ثبت نشده است.
                </p>
                <p className="text-nova-muted text-xs">
                  اولین نفری باش که تجربه‌اش را با دیگران به اشتراک می‌گذارد.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="mt-6">
          <ReviewForm productId={product.id} slug={slug} />
        </div>
      </motion.section>
      {product.relatedFrom?.length ? (
        <motion.section initial={{ opacity: 0, y: 30 }} animate={reveal(1.02)} className="mt-16">
          <p className="text-nova-muted text-xs">پیشنهاد برای شما</p>
          <h2 className="mt-1 text-2xl font-black">محصولات مرتبط</h2>
          <div className="mt-5">
            <ProductGrid
              products={product.relatedFrom.map((item) => item.toProduct)}
            />
          </div>
        </motion.section>
      ) : null}
    </main>
  );
}
