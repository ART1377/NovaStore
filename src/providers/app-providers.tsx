// src/providers/app-providers.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import { QueryProvider } from './query-provider';
import { RealtimeNotifications } from '@/features/notifications/components/realtime-notifications';
import { Toaster } from 'react-hot-toast';

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
