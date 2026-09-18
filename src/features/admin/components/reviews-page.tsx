// src/features/admin/components/reviews-page.tsx
'use client';
import { Star, Trash2 } from 'lucide-react';
import { useAdminReviews, useAdminReviewActions } from '../hooks/use-admin';
import { useDeleteConfirmation } from '../hooks/use-delete-confirmation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/utils';
import { AdminListSkeleton } from './admin-list-skeleton';
import { QueryEmpty } from '@/components/shared/query-state';
import { AdminPageHeader } from './admin-page-header';
export function ReviewsPage() {
  const { data = [], isLoading } = useAdminReviews();
  const { remove } = useAdminReviewActions();
  const { confirmId, requestDelete, cancel, confirm } = useDeleteConfirmation(
    remove.mutate,
  );
  if (isLoading)
    return <AdminListSkeleton rows={4} withToolbar={false} withThumbnail={false} />;
  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow="مدیریت / نظرات"
        title="مدیریت نظرات"
        description="بررسی و مدیریت بازخورد مشتری‌ها درباره محصولات."
      />
      <div className="mt-7 space-y-3">
        {data.map((r) => (
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
                        className={i < r.rating ? 'fill-black' : ''}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">
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
        {!data.length && (
          <QueryEmpty
            title="هنوز نظری ثبت نشده است"
            description="نظرات مشتری‌ها برای محصولات، اینجا نمایش داده می‌شود."
          />
        )}
      </div>
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
