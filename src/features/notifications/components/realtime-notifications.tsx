// src/features/notifications/components/realtime-notifications.tsx
'use client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type PusherClient from 'pusher-js';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
export function RealtimeNotifications() {
  const { data: session, update } = useSession();
  const qc = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    if (!session?.user?.id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    let client: PusherClient | undefined;
    let channel: ReturnType<PusherClient['subscribe']> | undefined;
    void import('pusher-js').then(({ default: Pusher }) => {
      client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: '/api/pusher/auth',
      });
      channel = client.subscribe(`private-user-${session.user.id}`);
      channel.bind(
        'notification',
        (payload?: {
          type?: string;
          title?: string;
          message?: string;
          orderId?: string;
        }) => {
          void qc.refetchQueries({
            queryKey: QUERY_KEYS.notifications,
            type: 'active',
          });
          if (payload?.title) toast.success(payload.title);

          if (
            payload?.type === 'ORDER_UPDATED' ||
            payload?.type === 'ORDER_CREATED'
          ) {
            void qc.refetchQueries({
              queryKey: QUERY_KEYS.orders,
              type: 'active',
            });
            if (session.user.role === 'ADMIN') {
              void qc.refetchQueries({
                queryKey: QUERY_KEYS.adminOrders,
                type: 'active',
              });
              if (payload.orderId)
                void qc.refetchQueries({
                  queryKey: QUERY_KEYS.adminOrder(payload.orderId),
                  type: 'active',
                });
            }
            void router.refresh();
          }
          if (payload?.type === 'ROLE_UPDATED') {
            void update();
            router.refresh();
          }
        },
      );
    });
    return () => {
      channel?.unbind_all();
      client?.disconnect();
    };
  }, [session?.user?.id, session?.user?.role, qc, router, update]);
  return null;
}
