// src/features/account/components/address-list-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function AddressListSkeleton() {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-40 rounded-3xl" />
      ))}
    </div>
  );
}
