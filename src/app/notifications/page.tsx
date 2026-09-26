// src/app/notifications/page.tsx
import type { Metadata } from 'next';
import { NotificationsPage } from '@/features/notifications/components/notifications-page';

export const metadata: Metadata = {
  title: 'اعلان‌ها',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NotificationsPage />;
}
