// src/features/catalog/components/review-form.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCreateReview } from '../hooks/use-review-actions';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';

export function ReviewForm({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const mutation = useCreateReview(slug);

  if (!session) {
    return (
      <Card>
        <CardContent className="py-5 text-sm text-zinc-500">
          برای ثبت امتیاز و نظر، ابتدا وارد حساب کاربری شوید.
        </CardContent>
      </Card>
    );
  }

  const displayedRating = hoverRating || rating;

  return (
    <Card>
      <CardContent>
        <h3 className="font-black">تجربه خرید شما</h3>
        <p className="mt-1 text-sm text-zinc-500">
          فقط خریداران این محصول می‌توانند امتیاز ثبت کنند.
        </p>

        <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
          <p className="text-xs font-semibold text-zinc-500">امتیاز شما</p>
          <div className="mt-3 flex flex-row-reverse justify-end gap-1">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`امتیاز ${value} از ۵`}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(value)}
                className="rounded-lg p-1 transition hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    value <= displayedRating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-300'
                  }
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {rating ? `${formatNumber(rating)} از ۵` : 'یک امتیاز انتخاب کنید'}
          </p>
        </div>

        <Input
          className="mt-3"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="تجربه‌تان از خرید را بنویسید"
        />
        <Button
          className="mt-3"
          disabled={
            mutation.isPending || rating < 1 || comment.trim().length < 3
          }
          onClick={() => mutation.mutate({ productId, rating, comment })}
        >
          {mutation.isPending ? 'در حال ثبت...' : 'ثبت امتیاز و نظر'}
        </Button>
      </CardContent>
    </Card>
  );
}
