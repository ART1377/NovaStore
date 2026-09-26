// src/app/products/[slug]/page.tsx
import {
  getAdminProductForDetail,
  getPublishedProduct,
  getPublishedProductMeta,
} from '@/features/catalog/api/catalog-server.api';
import { ProductDetail } from '@/features/catalog/components/product-detail';
import { ProductStructuredData } from '@/features/catalog/components/product-structured-data';
import { getAuthSession } from '@/lib/auth';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductMeta(slug);
  if (!product) {
    return { title: 'محصول پیدا نشد', robots: { index: false, follow: false } };
  }

  const description = product.description.slice(0, 160);
  const image = product.images[0]?.url;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      type: 'website',
      title: product.name,
      description,
      url: `/products/${slug}`,
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = await getPublishedProduct(slug);
  if (!product) {
    const session = await getAuthSession();
    if (session?.user?.role === 'ADMIN')
      product = await getAdminProductForDetail(slug);
  }
  if (!product) notFound();

  return (
    <>
      <ProductStructuredData product={product} />
      <ProductDetail slug={slug} initialProduct={product} />
    </>
  );
}
