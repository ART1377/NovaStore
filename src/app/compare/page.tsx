// src/app/compare/page.tsx
import type { Metadata } from 'next';
import { ComparePage } from '@/features/compare/components/compare-page';

export const metadata: Metadata = {
  title: 'مقایسه محصولات',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ComparePage />;
}
