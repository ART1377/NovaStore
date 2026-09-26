// src/app/cart/page.tsx
import { CartPage } from '@/features/cart/components/cart-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سبد خرید',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartPage />;
}
