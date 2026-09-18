// src/features/account/api/reviews.api.ts
import api from '@/lib/api-client';

export type AccountReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: { url: string }[];
  };
  replies: {
    id: string;
    comment: string;
    createdAt: string;
    user: { id: string; name: string | null; role: string };
  }[];
};

export const accountReviewsService = {
  get: () =>
    api
      .get<AccountReview[]>('/account/reviews')
      .then((response) => response.data),
};
