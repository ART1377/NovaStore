// src/features/catalog/hooks/use-review-actions.ts
'use client';

import { getClientErrorMessage } from '@/lib/client-error';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewsService } from '../api/reviews.api';

export function useCreateReview(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.product(slug),
      });
      toast.success('امتیاز و نظر شما ثبت شد.');
    },
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'ثبت امتیاز انجام نشد.')),
  });
}

export function useCreateReviewReply(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      comment,
    }: {
      reviewId: string;
      comment: string;
    }) => reviewsService.reply(reviewId, { comment }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.product(slug),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.accountReviews,
      });
      toast.success('پاسخ شما ثبت شد.');
    },
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'ثبت پاسخ انجام نشد.')),
  });
}
