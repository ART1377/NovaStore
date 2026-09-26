// src/app/compare/page.tsx
import { ComparePage } from '@/features/compare/components/compare-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مقایسه محصولات',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ComparePage />;
}
