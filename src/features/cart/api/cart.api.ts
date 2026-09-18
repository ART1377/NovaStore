// src/features/cart/api/cart.api.ts
import api from '@/lib/api-client';
import type { Cart } from '../types/cart-types';

export const cartService = {
  get: async (): Promise<Cart> => (await api.get<Cart>('/cart')).data,
  add: async (productId: string, variantId: string, quantity: number) =>
    (await api.post<Cart>('/cart', { productId, variantId, quantity })).data,
  update: async (itemId: string, quantity: number) =>
    (await api.patch<Cart>('/cart', { itemId, quantity })).data,
  remove: async (itemId: string) =>
    (await api.delete<Cart>('/cart', { params: { itemId } })).data,
};
