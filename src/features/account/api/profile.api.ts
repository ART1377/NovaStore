// src/features/account/api/profile.api.ts
import api from '@/lib/api-client';

export type AccountProfile = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type UpdateProfilePayload = { name: string };
export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const profileService = {
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<AccountProfile> =>
    (await api.patch<AccountProfile>('/account/profile', payload)).data,
  changePassword: async (
    payload: ChangePasswordPayload,
  ): Promise<{ success: true }> =>
    (await api.patch<{ success: true }>('/account/password', payload)).data,
};
