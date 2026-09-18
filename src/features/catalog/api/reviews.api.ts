// src/features/catalog/api/reviews.api.ts
import api from '@/lib/api-client';

export type CreateReviewPayload = {
  productId: string;
  rating: number;
  comment: string;
};
export type ReplyPayload = { comment: string };

export const reviewsService = {
  create: async (payload: CreateReviewPayload) =>
    (await api.post('/reviews', payload)).data,
  reply: async (reviewId: string, payload: ReplyPayload) =>
    (await api.post(`/reviews/${reviewId}/replies`, payload)).data,
};
