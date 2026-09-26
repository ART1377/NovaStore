// src/app/page.tsx
import { getHomePageData } from '@/features/home/api/home.api';
import { HomePage } from '@/features/home/components/home-page';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'خرید ساده‌تر، انتخاب بهتر',
  description:
    'نووا استور؛ فروشگاه اینترنتی مدرن با محصولات منتخب، قیمت شفاف و مسیر خرید ساده.',
  alternates: { canonical: '/' },
};

export default async function Page() {
  const data = await getHomePageData();
  return <HomePage data={data} />;
}
