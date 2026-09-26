// src/features/catalog/components/product-structured-data.tsx
import { siteConfig } from '@/lib/site';
import type { PublishedProduct } from '../api/catalog-server.api';

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function ProductStructuredData({
  product,
}: {
  product: PublishedProduct;
}) {
  const price = product.variants[0]?.price ?? product.price;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((image) => image.url),
    sku: product.variants[0]?.sku ?? product.sku ?? undefined,
    brand: product.brand
      ? { '@type': 'Brand', name: product.brand.name }
      : undefined,
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/products/${product.slug}`,
      price: Number((price * 10).toFixed(0)),
      priceCurrency: 'IRR',
      availability: product.variants.some((item) => item.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    ...(product.ratingCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.ratingAverage.toFixed(1)),
            reviewCount: product.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'فروشگاه',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'محصولات',
        item: `${siteConfig.url}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category.name,
        item: `${siteConfig.url}/products?category=${encodeURIComponent(product.category.slug)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${siteConfig.url}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbSchema) }}
      />
    </>
  );
}
