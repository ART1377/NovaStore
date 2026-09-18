// src/features/notifications/api/notifications.api.ts
import api from '@/lib/api-client';
export type Notification = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};
export const notificationsService = {
  get: () =>
    api
      .get<{ items: Notification[]; unread: number }>('/notifications')
      .then((r) => r.data),
  read: async (id: string) =>
    (await api.patch<{ success: boolean }>('/notifications', { id })).data,
  readAll: async () =>
    (await api.patch<{ success: boolean }>('/notifications', { all: true }))
      .data,
};
