// src/app/checkout/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-3 h-10 w-60" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
        <Skeleton className="h-[430px] rounded-3xl" />
      </div>
    </main>
  );
}
