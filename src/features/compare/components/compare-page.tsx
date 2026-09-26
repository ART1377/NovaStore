// src/features/compare/components/compare-page.tsx
'use client';

import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Scale, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCompare } from '../hooks/use-compare';
import { useCompareProducts } from '../hooks/use-compare-products';

export function ComparePage() {
  const { remove, clear } = useCompare();
  const { products, isLoading: loading } = useCompareProducts();

  if (loading)
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-9 w-56" />
        <Skeleton className="mt-8 h-80 rounded-3xl" />
      </main>
    );
  if (!products.length)
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={Scale}
          title="هنوز محصولی برای مقایسه انتخاب نکرده‌ای."
          description="از صفحه فروشگاه، چند محصول را برای مقایسه کنار هم اضافه کن."
          action={{ label: 'رفتن به فروشگاه', href: '/products' }}
        />
      </main>
    );

  const rows: [string, (product: (typeof products)[number]) => string][] = [
    ['برند', (product) => product.brand?.name || '—'],
    ['دسته‌بندی', (product) => product.category.name],
    [
      'قیمت',
      (product) => formatPrice(product.variants[0]?.price ?? product.price),
    ],
    ['تعداد مدل', (product) => String(product.variants.length)],
    [
      'موجودی',
      (product) =>
        String(
          Math.max(...product.variants.map((variant) => variant.stock), 0),
        ),
    ],
    [
      'امتیاز',
      (product) =>
        product.reviews?.length
          ? `${(product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)} از ۵`
          : 'بدون نظر',
    ],
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-nova-muted text-xs">نووا / مقایسه</p>
          <h1 className="mt-2 text-4xl font-black">مقایسه محصولات</h1>
          <p className="text-nova-primary mt-2 text-sm">
            مشخصات مهم را کنار هم ببین.
          </p>
        </div>
        <Button variant="outline" onClick={clear}>
          پاک کردن مقایسه
        </Button>
      </div>
      <div className="bg-nova-surface mt-8 overflow-x-auto rounded-3xl border shadow-sm">
        <table className="w-full min-w-[780px] text-right">
          <thead className="bg-nova-hover border-b">
            <tr>
              <th className="w-40 p-5 text-sm">مشخصه</th>
              {products.map((product) => (
                <th key={product.id} className="p-5 align-top">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold hover:underline"
                    >
                      {product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      className="text-nova-muted hover:bg-nova-line rounded-lg p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, getter]) => (
              <tr key={label} className="border-t">
                <td className="text-nova-primary p-5 text-sm font-semibold">
                  {label}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-5 text-sm font-bold">
                    {getter(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href="/products"
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline"
      >
        بازگشت به فروشگاه <ArrowLeft size={15} />
      </Link>
    </main>
  );
}
