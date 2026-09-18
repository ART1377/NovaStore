// src/features/notifications/hooks/use-notifications.ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { notificationsService } from '../api/notifications.api';
import { QUERY_KEYS } from '@/lib/query-keys';
export function useNotifications() {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: notificationsService.get,
    enabled: !!session,
  });
  const read = useMutation({
    mutationFn: notificationsService.read,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications }),
  });
  const readAll = useMutation({
    mutationFn: notificationsService.readAll,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications }),
  });
  return {
    ...query,
    items: query.data?.items ?? [],
    unread: query.data?.unread ?? 0,
    read: (id: string) => read.mutate(id),
    readAll: () => readAll.mutate(),
  };
}
