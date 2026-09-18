// src/features/account/api/auth.api.ts
import api from '@/lib/api-client';

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  register: async (payload: RegisterPayload) =>
    (await api.post('/auth/register', payload)).data,
};
