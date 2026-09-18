// src/app/terms/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'قوانین استفاده',
  description: 'قوانین و شرایط استفاده از نووا استور.',
  alternates: { canonical: '/terms' },
};
export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-nova-muted text-xs">نووا / قوانین استفاده</p>
      <h1 className="mt-2 text-4xl font-black">قوانین استفاده</h1>
      <div className="border-nova-line bg-nova-surface mt-8 space-y-6 rounded-3xl border p-6 text-sm leading-8 text-[#475569]">
        <p>قیمت، موجودی و وضعیت سفارش در این نمونه توسط سرور کنترل می‌شوند.</p>
        <p>
          اطلاعات پرداخت واقعی در این نسخه شبیه‌سازی نشده است. برای انتشار تجاری
          باید شرایط فروش، پرداخت، لغو و استرداد مطابق کسب‌وکار واقعی تکمیل شود.
        </p>
      </div>
    </main>
  );
}
