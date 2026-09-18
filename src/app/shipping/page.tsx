// src/app/shipping/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'ارسال و مرجوعی',
  description: 'راهنمای روش‌های ارسال و بازگشت سفارش در نووا استور.',
  alternates: { canonical: '/shipping' },
};
export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-nova-muted text-xs">نووا / ارسال و مرجوعی</p>
      <h1 className="mt-2 text-4xl font-black">ارسال و مرجوعی</h1>
      <div className="border-nova-line bg-nova-surface mt-8 space-y-6 rounded-3xl border p-6 text-sm leading-8 text-[#475569]">
        <p>
          در مرحله تسویه می‌توانید روش ارسال مناسب را انتخاب کنید و هزینه آن پیش
          از ثبت نهایی سفارش نمایش داده می‌شود.
        </p>
        <p>
          قوانین مرجوعی در نسخه واقعی باید بر اساس سیاست فروشگاه، نوع کالا و
          قوانین محل فعالیت تکمیل شود.
        </p>
      </div>
    </main>
  );
}
