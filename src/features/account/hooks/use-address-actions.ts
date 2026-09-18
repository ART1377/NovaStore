// src/features/account/hooks/use-address-actions.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addressesService } from '../api/addresses.api';
import { QUERY_KEYS } from '@/lib/query-keys';
import { getClientErrorMessage } from '@/lib/client-error';
import type { Address } from '../types/address';

const invalidateAddresses = (queryClient: ReturnType<typeof useQueryClient>) =>
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.addresses });

export function useAddressActions() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: addressesService.create,
    onSuccess: () => {
      invalidateAddresses(queryClient);
      toast.success('آدرس با موفقیت اضافه شد.');
    },
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'افزودن آدرس انجام نشد.')),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      address,
    }: {
      id: string;
      address: Omit<Address, 'id'>;
    }) => addressesService.update(id, address),
    onSuccess: () => {
      invalidateAddresses(queryClient);
      toast.success('آدرس با موفقیت ویرایش شد.');
    },
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'ذخیره آدرس انجام نشد.')),
  });

  const remove = useMutation({
    mutationFn: addressesService.remove,
    onSuccess: () => {
      invalidateAddresses(queryClient);
      toast.success('آدرس حذف شد.');
    },
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'حذف آدرس انجام نشد.')),
  });

  const setDefault = useMutation({
    mutationFn: (address: Address) =>
      addressesService.update(address.id, { ...address, isDefault: true }),
    onSuccess: () => {
      invalidateAddresses(queryClient);
      toast.success('آدرس پیش‌فرض تغییر کرد.');
    },
    onError: (error) =>
      toast.error(
        getClientErrorMessage(error, 'تغییر آدرس پیش‌فرض انجام نشد.'),
      ),
  });

  return { create, update, remove, setDefault };
}
