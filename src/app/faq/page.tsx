// src/app/faq/page.tsx
import { FAQPage } from '@/features/content/components/faq-page';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'سوالات متداول',
  description: 'پاسخ سوالات متداول درباره خرید، ارسال و سفارش در نووا استور.',
  alternates: { canonical: '/faq' },
};

export default function Page() {
  return <FAQPage />;
}
