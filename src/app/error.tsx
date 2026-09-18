// src/app/error.tsx
'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-black">خطایی رخ داد</h1>
      <p className="text-nova-primary mt-3 text-sm">لطفاً دوباره تلاش کنید.</p>
      <Button className="mt-6" onClick={reset}>
        تلاش دوباره
      </Button>
    </main>
  );
}
