// src/features/admin/components/admin-list-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Row-based loading skeleton for admin list/table pages (products, orders,
 * users, inventory, reviews, resource manager). Mirrors the header +
 * toolbar + row layout these pages share so the transition into real
 * content doesn't jump around.
 */
export function AdminListSkeleton({
  rows = 6,
  withToolbar = true,
  withThumbnail = true,
  withStats = false,
}: {
  rows?: number;
  withToolbar?: boolean;
  withThumbnail?: boolean;
  withStats?: boolean;
}) {
  return (
    <main className="w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-64 max-w-full" />
        </div>
        {withStats && (
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-14 w-20 rounded-xl" />
            <Skeleton className="h-14 w-20 rounded-xl" />
            <Skeleton className="h-14 w-20 rounded-xl" />
          </div>
        )}
      </div>

      {withToolbar && (
        <div className="bg-nova-surface mt-6 rounded-2xl border p-3">
          <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        </div>
      )}

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: rows }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {withThumbnail && (
                    <Skeleton className="size-12 shrink-0 rounded-xl" />
                  )}
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-40 max-w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
