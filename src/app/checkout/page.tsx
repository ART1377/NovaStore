// src/app/checkout/page.tsx
import { CheckoutPage } from '@/features/checkout/components/checkout-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تکمیل سفارش',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CheckoutPage />;
}
