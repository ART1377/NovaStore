// src/features/home/components/home-product-section.tsx
import { ProductGrid } from '@/features/catalog/components/product-grid';
import type { ComponentProps } from 'react';
import { HomeSectionHeader } from './home-section-header';

type ProductGridProducts = ComponentProps<typeof ProductGrid>['products'];

export function HomeProductSection({
  label,
  title,
  href,
  products,
}: {
  label: string;
  title: string;
  href: string;
  products: ProductGridProducts;
}) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-7 sm:px-4 sm:py-10">
      <HomeSectionHeader label={label} title={title} href={href} />
      <ProductGrid products={products} />
    </section>
  );
}
