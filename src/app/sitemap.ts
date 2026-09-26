// src/app/sitemap.ts
import { db } from '@/lib/prisma';
import { siteConfig } from '@/lib/site';
import type { MetadataRoute } from 'next';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true, publishedAt: true },
  });
  return [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${siteConfig.url}/products`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    { url: `${siteConfig.url}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: product.updatedAt ?? product.publishedAt ?? new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
