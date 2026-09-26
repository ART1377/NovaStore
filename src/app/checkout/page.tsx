// src/app/checkout/page.tsx
import type { Metadata } from 'next';
import { CheckoutPage } from '@/features/checkout/components/checkout-page';

export const metadata: Metadata = {
  title: 'تکمیل سفارش',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CheckoutPage />;
}
