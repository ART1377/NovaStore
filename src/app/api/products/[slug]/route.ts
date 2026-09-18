// src/app/api/products/[slug]/route.ts
import { NextResponse } from 'next/server';
import { getPublishedProduct } from '@/features/catalog/api/catalog-server.api';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product)
    return NextResponse.json({ error: 'محصول پیدا نشد' }, { status: 404 });
  return NextResponse.json(product);
}