// src/features/wishlist/hooks/use-wishlist.ts
'use client';

import { useCartActions } from '@/features/cart/hooks/use-cart';
import { getClientErrorMessage } from '@/lib/client-error';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { wishlistService } from '../api/wishlist.api';

function getErrorMessage(error: unknown, fallback: string) {
  return getClientErrorMessage(error, fallback);
}
export function useWishlist() {
  const { data: session, status } = useSession();
  const userKey = session?.user?.email ?? 'guest';
  return useQuery({
    queryKey: [...QUERY_KEYS.wishlist, userKey],
    queryFn: wishlistService.get,
    enabled: status === 'authenticated' && !!session?.user,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useWishlistActions() {
  const queryClient = useQueryClient();
  const { addAsync } = useCartActions();
  const { status: sessionStatus } = useSession();

  const toggleMutation = useMutation({
    mutationFn: ({
      productId,
      wished,
    }: {
      productId: string;
      wished: boolean;
    }) => wishlistService.set(productId, wished),
    onSuccess: ({ wished }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
      toast.success(
        wished ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
      );
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, 'به‌روزرسانی علاقه‌مندی انجام نشد.')),
  });

  const removeMutation = useMutation({
    mutationFn: wishlistService.remove,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist }),
    onError: (error) =>
      toast.error(getErrorMessage(error, 'حذف علاقه‌مندی انجام نشد.')),
  });

  const moveMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId: string;
    }) => {
      await addAsync(productId, variantId);
      await wishlistService.remove(productId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      toast.success('محصول به سبد خرید منتقل شد');
    },
    onError: (error) =>
      toast.error(
        getErrorMessage(error, 'انتقال محصول به سبد خرید انجام نشد.'),
      ),
  });

  return {
    sessionStatus,
    toggle: (productId: string, wished: boolean) =>
      toggleMutation.mutate({ productId, wished }),
    isToggling: (productId: string) =>
      toggleMutation.isPending &&
      toggleMutation.variables?.productId === productId,
    remove: (productId: string) => removeMutation.mutate(productId),
    isRemoving: (productId: string) =>
      removeMutation.isPending && removeMutation.variables === productId,
    moveToCart: (productId: string, variantId: string) =>
      moveMutation.mutate({ productId, variantId }),
    isMovingToCart: (productId: string) =>
      moveMutation.isPending && moveMutation.variables?.productId === productId,
  };
}
