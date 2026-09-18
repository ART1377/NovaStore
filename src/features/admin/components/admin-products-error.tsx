// src/features/admin/components/admin-products-error.tsx
import { QueryError } from '@/components/shared/query-state';

export function AdminProductsError({ onRetry }: { onRetry?: () => void }) {
  return <QueryError message="دریافت محصولات ناموفق بود." onRetry={onRetry} />;
}
