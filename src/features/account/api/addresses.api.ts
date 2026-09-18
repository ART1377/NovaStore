// src/features/account/api/addresses.api.ts
import api from '@/lib/api-client';
import type { Address } from '../types/address';

export const addressesService = {
  get: async (): Promise<Address[]> =>
    (await api.get<Address[]>('/addresses')).data,
  create: async (address: Omit<Address, 'id'>) =>
    (await api.post<Address>('/addresses', address)).data,
  update: async (id: string, address: Omit<Address, 'id'>) =>
    (await api.patch<Address>(`/addresses/${id}`, address)).data,
  remove: async (id: string) => (await api.delete(`/addresses/${id}`)).data,
};
