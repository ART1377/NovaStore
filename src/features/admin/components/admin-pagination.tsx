// src/features/admin/components/admin-pagination.tsx
import { Button } from '@/components/ui/button';

export function AdminPagination({
  page,
  hasMore,
  isFetching,
  onPageChange,
}: {
  page: number;
  hasMore: boolean;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}) {
  if (page <= 1 && !hasMore) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button
        variant="outline"
        disabled={page <= 1 || isFetching}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        قبلی
      </Button>
      <span className="bg-nova-surface min-w-20 rounded-xl px-4 py-2 text-center text-sm font-bold shadow-sm">
        {page}
      </span>
      <Button
        variant="outline"
        disabled={!hasMore || isFetching}
        onClick={() => onPageChange(page + 1)}
      >
        بعدی
      </Button>
    </div>
  );
}
