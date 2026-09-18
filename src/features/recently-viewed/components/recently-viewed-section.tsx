// src/features/recently-viewed/components/recently-viewed-section.tsx
'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock3 } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';
import { formatPrice } from '@/lib/utils';

type Item = { slug: string; name: string; image?: string; price: number };

const RECENT_ITEMS_KEY = 'novastore-recent-items';
const emptyItems: Item[] = [];

let cachedRaw: string | null = null;
let cachedItems: Item[] = emptyItems;

function readRecentItems(): Item[] {
  const raw = localStorage.getItem(RECENT_ITEMS_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    cachedItems = raw ? JSON.parse(raw) : emptyItems;
  } catch {
    cachedItems = emptyItems;
  }
  return cachedItems;
}

const noopSubscribe = () => () => {};

export function RecentlyViewedSection() {
  const items = useSyncExternalStore(
    noopSubscribe,
    readRecentItems,
    () => emptyItems,
  );
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <SectionHeading eyebrow="بازدیدهای اخیر" title="جایی که آخرین بار بودی" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.slug}
            href={`/products/${item.slug}`}
            className="group bg-nova-surface overflow-hidden rounded-2xl border"
          >
            <div className="bg-nova-soft relative aspect-square overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="25vw"
                />
              ) : (
                <ProductImagePlaceholder compact label="بدون تصویر" />
              )}
            </div>
            <div className="p-3">
              <div className="text-nova-muted flex items-center gap-1 text-[10px]">
                <Clock3 size={11} />
                اخیراً دیده شده
              </div>
              <h3 className="mt-1 line-clamp-2 text-sm font-bold">
                {item.name}
              </h3>
              <p className="mt-2 text-sm font-black">
                {formatPrice(item.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/products"
        className="mt-5 inline-flex items-center gap-1 text-xs font-bold sm:hidden"
      >
        مشاهده فروشگاه <ArrowLeft size={14} />
      </Link>
    </section>
  );
}
