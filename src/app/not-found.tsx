// src/app/not-found.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-nova-muted text-xs">۴۰۴</p>
      <h1 className="mt-2 text-4xl font-black">صفحه پیدا نشد</h1>
      <p className="text-nova-primary mt-3">آدرس مورد نظر وجود ندارد.</p>
      <Link href="/">
        <Button className="mt-6">بازگشت به فروشگاه</Button>
      </Link>
    </main>
  );
}
