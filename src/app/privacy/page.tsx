// src/app/privacy/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'حریم خصوصی',
  description: 'نحوه استفاده نووا استور از اطلاعات حساب و سفارش.',
  alternates: { canonical: '/privacy' },
};
export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-nova-muted text-xs">نووا / حریم خصوصی</p>
      <h1 className="mt-2 text-4xl font-black">حریم خصوصی</h1>
      <div className="border-nova-line bg-nova-surface mt-8 space-y-6 rounded-3xl border p-6 text-sm leading-8 text-[#475569]">
        <p>
          این پروژه یک نمونه فروشگاه اینترنتی برای نمایش تجربه کاربری و معماری
          فول‌استک است.
        </p>
        <p>
          اطلاعات حساب و سفارش فقط برای ارائه قابلیت‌های همان حساب در نظر گرفته
          شده‌اند و برای استفاده واقعی باید سیاست حفظ حریم خصوصی نهایی کسب‌وکار
          جایگزین این متن شود.
        </p>
        <p>
          اطلاعات ورود، پرداخت و داده‌های حساس نباید در محیط نمایشی یا نسخه
          آزمایشی وارد شوند.
        </p>
      </div>
    </main>
  );
}
