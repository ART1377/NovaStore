// src/features/admin/components/admin-detail-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for admin detail/form pages (order detail, user detail,
 * product editor). Mirrors the two-column layout these pages share.
 */
export function AdminDetailSkeleton() {
  return (
    <main className="w-full min-w-0">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-8 w-56 max-w-full" />
      <Skeleton className="mt-2 h-4 w-36" />
      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </div>
    </main>
  );
}
