// src/app/cart/page.tsx
import type { Metadata } from 'next';
import { CartPage } from '@/features/cart/components/cart-page';

export const metadata: Metadata = {
  title: 'سبد خرید',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartPage />;
}
