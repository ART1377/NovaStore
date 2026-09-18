// src/app/account/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-3 h-10 w-56" />
      <Skeleton className="mt-8 h-24 rounded-3xl" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
      <Skeleton className="mt-6 h-72 rounded-3xl" />
    </main>
  );
}
