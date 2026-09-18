// src/app/products/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <Skeleton className="h-44 rounded-[30px]" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-[620px] rounded-3xl" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    </main>
  );
}
