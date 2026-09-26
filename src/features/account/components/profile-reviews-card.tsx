// src/features/account/components/profile-reviews-card.tsx
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AccountReview } from '@/features/account/api/reviews.api';
import { formatDate, formatNumber } from '@/lib/utils';
import { Star } from 'lucide-react';
import Link from 'next/link';

const REVIEW_SKELETON_COUNT = 2;

export function ProfileReviewsCard({
  reviews,
  isLoading,
}: {
  reviews: AccountReview[];
  isLoading: boolean;
}) {
  return (
    <section className="mt-8">
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">نظرها و امتیازهای من</h2>
              <p className="text-nova-muted mt-1 text-xs">
                محصولاتی که درباره‌شان نظر داده‌اید و امتیازی که ثبت کرده‌اید.
              </p>
            </div>
            <Badge>{formatNumber(reviews.length)} ثبت</Badge>
          </div>

          {isLoading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: REVIEW_SKELETON_COUNT }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : reviews.length ? (
            <div className="mt-5 space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-nova-line bg-nova-hover/50 rounded-2xl border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="hover:text-nova-primary min-w-0 font-bold"
                    >
                      {review.product.name}
                    </Link>
                    <div className="text-nova-accent flex items-center gap-1 text-sm font-bold">
                      <Star size={15} fill="currentColor" />
                      {formatNumber(review.rating)} از ۵
                    </div>
                  </div>
                  <p className="text-nova-muted mt-2 text-xs">
                    {formatDate(review.createdAt)} ·{' '}
                    {formatNumber(review.replies.length)} پاسخ
                  </p>
                  <p className="text-nova-primary mt-3 text-sm leading-7">
                    {review.comment}
                  </p>
                  <Link
                    href={`/products/${review.product.slug}`}
                    className="text-nova-primary hover:text-nova-ink mt-3 inline-flex text-xs font-bold"
                  >
                    مشاهده نظر در صفحه محصول
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="هنوز نظری ثبت نکرده‌اید."
              description="بعد از خرید، امتیاز و تجربه‌تان را برای محصولات ثبت کنید تا اینجا ذخیره شود."
              action={{ label: 'مشاهده محصولات', href: '/products' }}
              className="mt-4 border-0 px-2 py-10 shadow-none"
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
