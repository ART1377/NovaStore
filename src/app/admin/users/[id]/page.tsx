// src/app/admin/users/[id]/page.tsx
import { UserDetailPage } from '@/features/admin/components/user-detail-page';
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <UserDetailPage id={(await params).id} />;
}
