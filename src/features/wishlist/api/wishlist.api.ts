// src/features/wishlist/api/wishlist.api.ts
import api from '@/lib/api-client';

export type WishlistItem = {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt: string | null }[];
    brand: { name: string } | null;
    category: { name: string };
    variants: {
      id: string;
      stock: number;
      price: number | null;
      name: string;
    }[];
  };
};

export type WishlistResponse = { items: WishlistItem[] };
export type WishlistMutationResponse = { wished: boolean };

export const wishlistService = {
  get: () =>
    api.get<WishlistResponse>('/wishlist').then((response) => response.data),
  set: (productId: string, wished: boolean) =>
    api
      .post<WishlistMutationResponse>('/wishlist', { productId, wished })
      .then((response) => response.data),
  remove: (productId: string) =>
    api
      .delete<{ success: boolean }>('/wishlist', { params: { productId } })
      .then((response) => response.data),
};
