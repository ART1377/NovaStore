// src/features/wishlist/components/wishlist-page.tsx
'use client';
import { EmptyState, ProductImagePlaceholder } from '@/components/shared';
import { QueryError } from '@/components/shared/query-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getClientErrorMessage } from '@/lib/client-error';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist, useWishlistActions } from '../hooks/use-wishlist';
export function WishlistPage() {
  const { data, isLoading, isError, error, refetch } = useWishlist();
  const { remove, moveToCart } = useWishlistActions();

  if (isLoading)
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-56" />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border">
              <Skeleton className="aspect-square rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <QueryError
          message={getClientErrorMessage(
            error,
            'دریافت علاقه‌مندی‌ها انجام نشد.',
          )}
          onRetry={() => refetch()}
        />
      </main>
    );
  }
  const items = data?.items ?? [];
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-nova-primary text-xs">نووا / علاقه‌مندی‌ها</p>
      <h1 className="mt-2 text-4xl font-black">علاقه‌مندی‌های من</h1>
      {!items.length ? (
        <div className="mt-8">
          <EmptyState
            icon={Heart}
            title="هنوز محصولی ذخیره نکرده‌ای."
            description="محصولات موردعلاقه‌ات را ذخیره کن تا بعداً سریع‌تر به آن‌ها برگردی."
            action={{ label: 'رفتن به فروشگاه', href: '/products' }}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-nova-surface overflow-hidden rounded-2xl border"
            >
              <Link href={`/products/${item.product.slug}`}>
                <div className="relative aspect-square">
                  {item.product.images[0]?.url ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  ) : (
                    <ProductImagePlaceholder compact label="بدون تصویر" />
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${item.product.slug}`}>
                  <h2 className="min-h-12 font-semibold">
                    {item.product.name}
                  </h2>
                </Link>
                <p className="mt-2 font-bold">
                  {formatPrice(
                    item.product.variants[0]?.price ?? item.product.price,
                  )}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={
                      !item.product.variants[0] ||
                      item.product.variants[0].stock < 1
                    }
                    onClick={() =>
                      moveToCart(item.product.id, item.product.variants[0].id)
                    }
                  >
                    <ShoppingBag size={15} />
                    افزودن به سبد
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(item.product.id)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
