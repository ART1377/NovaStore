// src/features/catalog/components/review-thread.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate, formatNumber } from '@/lib/utils';
import { ChevronDown, MessageCircle, Send, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useCreateReviewReply } from '../hooks/use-review-actions';
import type { Product } from '../types/catalog-types';

type Review = NonNullable<Product['reviews']>[number];

export function ReviewThread({
  review,
  slug,
}: {
  review: Review;
  slug: string;
}) {
  const { data: session } = useSession();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyFormOpen, setReplyFormOpen] = useState(false);
  const [reply, setReply] = useState('');

  const mutation = useCreateReviewReply(slug);

  const replies = review.replies ?? [];
  const replyCount = replies.length;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">
                {review.user?.name ?? 'کاربر'}
              </span>
              {review.user?.role === 'ADMIN' ? (
                <span className="bg-nova-primary/10 text-nova-primary rounded-full px-2 py-0.5 text-[10px] font-bold">
                  پشتیبانی
                </span>
              ) : null}
            </div>
            <p className="text-nova-muted mt-1 text-[11px]">
              {review.createdAt ? formatDate(review.createdAt) : ''}
            </p>
          </div>
          <div
            className="text-nova-accent flex shrink-0 items-center gap-0.5"
            aria-label={`امتیاز ${review.rating} از ۵`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={14}
                fill={index < review.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>

        <p className="text-nova-primary mt-4 text-sm leading-7">
          {review.comment}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {replyCount > 0 ? (
            <button
              type="button"
              onClick={() => setReplyOpen((value) => !value)}
              className="bg-nova-hover text-nova-primary hover:bg-nova-soft inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition"
              aria-expanded={replyOpen}
            >
              <MessageCircle size={15} /> {formatNumber(replyCount)} پاسخ
              <ChevronDown
                size={14}
                className={
                  replyOpen
                    ? 'rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />
            </button>
          ) : (
            <span className="text-nova-muted text-xs">
              هنوز پاسخی ثبت نشده است.
            </span>
          )}
          {session ? (
            <button
              type="button"
              onClick={() => {
                setReplyFormOpen((value) => !value);
                setReplyOpen(true);
              }}
              className="text-nova-primary hover:bg-nova-hover inline-flex items-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold transition"
            >
              <MessageCircle size={15} /> پاسخ به این نظر
            </button>
          ) : null}
        </div>

        {replyOpen && replyCount > 0 ? (
          <div className="border-nova-line bg-nova-hover/35 mt-3 max-h-60 space-y-2 overflow-y-auto overscroll-contain rounded-2xl border p-2 pl-1">
            {replies.map((item) => (
              <div key={item.id} className="bg-nova-surface rounded-xl p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold">
                    {item.user?.name ?? 'کاربر'}
                  </span>
                  {item.user?.role === 'ADMIN' ? (
                    <span className="bg-nova-primary/10 text-nova-primary rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                      پشتیبانی
                    </span>
                  ) : null}
                  <span className="text-nova-muted text-[10px]">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-nova-primary mt-2 text-xs leading-6">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {replyFormOpen && session ? (
          <div className="bg-nova-hover/50 mt-3 flex gap-2 rounded-2xl p-2">
            <Input
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="پاسخ خود را بنویسید..."
              maxLength={1000}
              autoFocus
            />
            <Button
              size="icon"
              className="shrink-0"
              disabled={mutation.isPending || reply.trim().length < 2}
              onClick={() =>
                mutation.mutate({ reviewId: review.id, comment: reply })
              }
              aria-label="ارسال پاسخ"
            >
              <Send size={16} />
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
