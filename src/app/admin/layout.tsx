import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 items-start gap-3 overflow-x-clip px-3 py-3 sm:gap-5 sm:px-4 lg:gap-6 lg:py-7 xl:grid-cols-[15rem_minmax(0,1fr)]">
      <AdminSidebar />

      <main className="admin-main min-w-0 overflow-x-clip">
        {children}
      </main>
    </div>
  );
}
