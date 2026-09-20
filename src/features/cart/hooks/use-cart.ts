// src/features/cart/hooks/use-cart.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { cartService } from '../api/cart.api';
import type { Cart } from '../types/cart-types';
import { QUERY_KEYS } from '@/lib/query-keys';
import { getClientErrorMessage } from '@/lib/client-error';

function message(error: unknown) {
  return getClientErrorMessage(error, 'عملیات سبد خرید انجام نشد.');
}

export function useCart() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: QUERY_KEYS.cart,
    queryFn: cartService.get,
    enabled: !!session,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCartItem(productId: string, variantId?: string) {
  const { data: cart } = useCart();
  return cart?.items.find((item) =>
    variantId
      ? item.productId === productId && item.variantId === variantId
      : item.productId === productId && !item.variantId,
  );
}

export function useCartQuantity(productId: string, variantId?: string) {
  const { data: cart } = useCart();
  return (
    cart?.items
      .filter(
        (item) =>
          item.productId === productId &&
          (!variantId || item.variantId === variantId),
      )
      .reduce((sum, item) => sum + item.quantity, 0) ?? 0
  );
}

export function useCartActions() {
  const qc = useQueryClient();
  const { data: session, status } = useSession();

  const refresh = async () => {
    const cart = await cartService.get();
    qc.setQueryData<Cart>(QUERY_KEYS.cart, cart);
    return cart;
  };

  const add = useMutation({
    mutationFn: (v: {
      productId: string;
      variantId: string;
      quantity: number;
    }) => cartService.add(v.productId, v.variantId, v.quantity),
    onSuccess: async () => {
      await refresh();
      toast.success('به سبد خرید اضافه شد');
    },
    onError: (error: unknown) => toast.error(message(error)),
  });

  const updateMutation = useMutation({
    mutationFn: (v: { itemId: string; quantity: number }) =>
      cartService.update(v.itemId, v.quantity),
    onSuccess: refresh,
    onError: (error: unknown) => toast.error(message(error)),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => cartService.remove(id),
    onSuccess: refresh,
    onError: async (error: unknown) => {
      await refresh();
      toast.error(message(error));
    },
  });

  return {
    add: (productId: string, variantId: string, quantity = 1) => {
      if (status === 'loading') return;
      if (!session?.user) {
        toast.error('برای افزودن محصول به سبد خرید ابتدا وارد حساب شوید.');
        return;
      }
      add.mutate({ productId, variantId, quantity });
    },
    addAsync: async (productId: string, variantId: string, quantity = 1) => {
      if (status === 'loading') return;
      if (!session?.user) {
        toast.error('برای افزودن محصول به سبد خرید ابتدا وارد حساب شوید.');
        return;
      }
      return add.mutateAsync({ productId, variantId, quantity });
    },
    isAdding: add.isPending,
    isAddingFor: (productId: string, variantId: string) =>
      add.isPending &&
      add.variables?.productId === productId &&
      add.variables?.variantId === variantId,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    isUpdatingFor: (itemId: string) =>
      updateMutation.isPending && updateMutation.variables?.itemId === itemId,
    remove: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    isRemovingFor: (itemId: string) =>
      removeMutation.isPending && removeMutation.variables === itemId,
  };
}
