// src/app/products/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsPage } from '@/features/catalog/components/products-page';

export const metadata: Metadata = {
  title: 'فروشگاه',
  description: 'همه محصولات نووا استور را جستجو، فیلتر و مقایسه کنید.',
  alternates: { canonical: '/products' },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-12" aria-busy="true">
          در حال بارگذاری محصولات...
        </main>
      }
    >
      <ProductsPage />
    </Suspense>
  );
}
