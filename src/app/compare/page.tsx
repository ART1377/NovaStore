// src/app/compare/page.tsx
import type { Metadata } from 'next';
import { ComparePage } from '@/features/compare/components/compare-page';
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <ComparePage />;
}
