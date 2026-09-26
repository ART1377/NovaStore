// src/features/catalog/hooks/use-product-detail.ts
'use client';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useProduct } from './use-catalog';
import { useCartItem } from '@/features/cart/hooks/use-cart';
import { useCompare } from '@/features/compare/hooks/use-compare';
import { pushRecentlyViewed } from '@/features/recently-viewed/store';
import type { Product } from '../types/catalog-types';

export function useProductDetail(slug: string, initialProduct: Product) {
  const productQuery = useProduct(slug, initialProduct);
  const { toggle, has } = useCompare();
  const [variantId, setVariantId] = useState('');
  const product = productQuery.data;

  useEffect(() => {
    if (!product?.variants.length) {
      setVariantId('');
      return;
    }

    setVariantId((current) => {
      const currentVariant = product.variants.find(
        (item) => item.id === current,
      );
      if (currentVariant) return current;

      return (
        product.variants.find((item) => item.stock > 0)?.id ??
        product.variants[0].id
      );
    });
  }, [product?.variants]);
  const variant = useMemo(
    () =>
      product?.variants.find((item) => item.id === variantId) ??
      product?.variants.find((item) => item.stock > 0) ??
      product?.variants[0],
    [product?.variants, variantId],
  );
  const cartItem = useCartItem(product?.id ?? '', variant?.id);
  
  useEffect(() => {
    if (!product) return;
    pushRecentlyViewed({
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url,
      price: product.variants[0]?.price ?? product.price,
    });
  }, [product]);

  const selectVariant = (nextVariantId: string) => setVariantId(nextVariantId);
  const toggleCompare = () => {
    if (!product) return;
    const added = toggle(product.slug);
    if (added === false) toast.error('حداکثر ۴ محصول قابل مقایسه است');
    else
      toast.success(
        has(product.slug) ? 'از مقایسه حذف شد' : 'به مقایسه اضافه شد',
      );
  };

  return {
    ...productQuery,
    product,
    variant,
    cartItem,
    selectVariant,
    compareActive: product ? has(product.slug) : false,
    toggleCompare,
    price: variant?.price ?? product?.price ?? 0,
    discounted: Boolean(
      product?.compareAtPrice &&
      product.compareAtPrice > (variant?.price ?? product?.price ?? 0),
    ),
    average: product?.ratingAverage ?? 0,
    ratingCount: product?.ratingCount ?? 0,
    ratingDistribution: product?.ratingDistribution ?? {},
    available: Boolean(variant && variant.stock > 0),
    cartQuantity: cartItem?.quantity ?? 0,
  };
}
