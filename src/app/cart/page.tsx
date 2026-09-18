// src/app/cart/page.tsx
import type { Metadata } from 'next';
import { CartPage } from '@/features/cart/components/cart-page';
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Page() {
  return <CartPage />;
}
