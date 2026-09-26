// src/features/admin/components/reviews-page.tsx
'use client';
import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useAdminReviews, useAdminReviewActions } from '../hooks/use-admin';
import { useDeleteConfirmation } from '../hooks/use-delete-confirmation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { SearchField } from '@/components/shared';
import { formatDateTime } from '@/lib/utils';
import { AdminListSkeleton } from './admin-list-skeleton';
import { QueryEmpty, QueryError } from '@/components/shared/query-state';
import { AdminPageHeader } from './admin-page-header';
import { AdminPagination } from './admin-pagination';

export function ReviewsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminReviews({
    page,
  });
  const { remove } = useAdminReviewActions();
  const { confirmId, requestDelete, cancel, confirm } = useDeleteConfirmation(
    remove.mutate,
  );

  const list = (data?.items ?? []).filter((review) =>
    `${review.product.name} ${review.user.name ?? ''} ${review.user.email ?? ''} ${review.comment}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (isLoading)
    return (
      <AdminListSkeleton rows={4} withToolbar={false} withThumbnail={false} />
    );
  if (isError)
    return (
      <QueryError
        message="دریافت نظرات ناموفق بود."
        onRetry={() => refetch()}
      />
    );

  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow="مدیریت / نظرات"
        title="مدیریت نظرات"
        description="بررسی و مدیریت بازخورد مشتری‌ها درباره محصولات."
        controls={
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="جستجو در نظرات، محصول یا کاربر..."
          />
        }
      />
      <div
        className={`mt-7 space-y-3 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
      >
        {list.map((r) => (
          <Card key={r.id}>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold">{r.product.name}</p>
                  <p className="text-nova-primary mt-1 text-xs">
                    {r.user.name ?? 'بدون نام'} · {r.user.email}
                  </p>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={
                          i < r.rating
                            ? 'fill-nova-accent text-nova-accent'
                            : 'text-nova-line'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-nova-muted mt-3 text-sm leading-7">
                    {r.comment}
                  </p>
                  <p className="text-nova-muted mt-2 text-xs">
                    {formatDateTime(r.createdAt)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => requestDelete(r.id)}
                >
                  <Trash2 size={14} />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!list.length && (
          <QueryEmpty
            title={
              search ? 'نظری با این مشخصات پیدا نشد' : 'هنوز نظری ثبت نشده است'
            }
            description={
              search
                ? 'جستجو را تغییر بده.'
                : 'نظرات مشتری‌ها برای محصولات، اینجا نمایش داده می‌شود.'
            }
          />
        )}
      </div>
      {data && (
        <AdminPagination
          page={data.page}
          hasMore={data.hasMore}
          isFetching={isFetching}
          onPageChange={setPage}
        />
      )}
      <ConfirmDialog
        open={!!confirmId}
        title="حذف نظر"
        description="آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست."
        busy={remove.isPending}
        onClose={cancel}
        onConfirm={confirm}
      />
    </main>
  );
}
