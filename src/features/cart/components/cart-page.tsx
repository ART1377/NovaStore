// src/features/cart/components/cart-page.tsx
'use client';
import { EmptyState } from '@/components/shared/empty-state';
import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';
import { QueryError } from '@/components/shared/query-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getClientErrorMessage } from '@/lib/client-error';
import { formatNumber, formatPrice } from '@/lib/utils';
import { ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../hooks/use-cart';
import { CartQuantityControls } from './cart-quantity-controls';

export function CartPage() {
  const { data, isLoading, isError, error, refetch } = useCart();
  if (isLoading)
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-3xl" />
            ))}
          </div>
        </div>
      </main>
    );
  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <QueryError
          message={getClientErrorMessage(
            error,
            'دریافت اطلاعات سبد خرید انجام نشد.',
          )}
          onRetry={() => refetch()}
        />
      </main>
    );
  }
  const items = data?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0,
  );
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-nova-primary text-xs">نووا / سبد خرید</p>
          <h1 className="mt-2 text-4xl font-black">سبد خرید</h1>
        </div>
        <Link href="/products" className="text-nova-primary text-sm">
          ادامه خرید
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="سبد خرید خالی است"
            description="محصولات موردنظرت را به سبد اضافه کن و خریدت را ادامه بده."
            action={{ label: 'مشاهده محصولات', href: '/products' }}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex gap-4">
                  <div className="bg-nova-soft relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                    {item.product.images[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <ProductImagePlaceholder compact label="بدون تصویر" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-nova-primary mt-1 text-xs">
                      {item.variant?.name}
                    </p>
                    <p className="text-nova-muted mt-2 text-xs font-semibold">
                      تعداد در سبد: {formatNumber(item.quantity)} عدد
                    </p>
                    <p className="mt-2 font-bold">
                      {formatPrice(item.variant?.price ?? item.product.price)}
                    </p>
                    <CartQuantityControls
                      cartItemId={item.id}
                      quantity={item.quantity}
                      stock={item.variant?.stock ?? 0}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="h-fit">
            <CardContent>
              <h2 className="font-bold">خلاصه سفارش</h2>
              <div className="mt-5 flex justify-between text-sm">
                <span>مجموع کالاها</span>
                <b>{formatPrice(subtotal)}</b>
              </div>
              <div className="bg-nova-soft my-4 h-px" />
              <div className="flex justify-between">
                <span className="font-semibold">مبلغ قابل پرداخت</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <Link href="/checkout" className="mt-5 block">
                <Button className="w-full">
                  ادامه فرایند خرید <ArrowLeft size={16} />
                </Button>
              </Link>
              <div className="text-nova-primary mt-4 flex gap-2 text-xs">
                <ShieldCheck size={15} />
                محاسبه نهایی قیمت در سمت سرور انجام می‌شود.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
