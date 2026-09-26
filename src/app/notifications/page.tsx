// src/app/notifications/page.tsx
import { NotificationsPage } from '@/features/notifications/components/notifications-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اعلان‌ها',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NotificationsPage />;
}
