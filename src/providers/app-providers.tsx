// src/providers/app-providers.tsx
'use client';
import { RealtimeNotifications } from '@/features/notifications/components/realtime-notifications';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from './query-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <RealtimeNotifications />
        {children}
        <Toaster position="top-left" />
      </QueryProvider>
    </SessionProvider>
  );
}
