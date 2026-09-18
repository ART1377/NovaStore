// src/features/account/hooks/use-address-manager.ts
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAddresses } from './use-addresses';
import { useAddressActions } from './use-address-actions';
import type { Address } from '../types/address';
import type { FieldErrors } from '@/lib/form-errors';
import { zodFieldErrors } from '@/lib/form-errors';
import { addressSchemaWithDefault } from '../validation/address.schema';
import { numericInputValue } from '@/lib/utils';

type AddressForm = Omit<Address, 'id'>;

const EMPTY: AddressForm = {
  title: 'خانه',
  recipient: '',
  phone: '',
  city: 'تهران',
  state: 'تهران',
  postalCode: '',
  street: '',
  isDefault: false,
};

export function useAddressManager() {
  const { create, update, remove, setDefault } = useAddressActions();
  const addressesQuery = useAddresses();
  const { data = [], ...queryState } = addressesQuery;
  const [form, setForm] = useState<AddressForm>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(EMPTY);
    setErrors({});
    setEditingId(null);
  };

  const startCreate = () => {
    setForm(EMPTY);
    setErrors({});
    setEditingId(null);
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      title: address.title,
      recipient: address.recipient,
      phone: address.phone,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      street: address.street,
      isDefault: address.isDefault,
    });
    setErrors({});
    requestAnimationFrame(() => {
      document.getElementById('address-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const setField = <K extends keyof AddressForm>(key: K, value: AddressForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[String(key)];
      return next;
    });
  };

  const submit = () => {
    const normalizedForm = { ...form, phone: numericInputValue(form.phone), postalCode: numericInputValue(form.postalCode) };
    const parsed = addressSchemaWithDefault.safeParse(normalizedForm);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      toast.error('لطفاً خطاهای آدرس را برطرف کنید.');
      return;
    }
    setErrors({});
    if (editingId) {
      update.mutate({ id: editingId, address: parsed.data });
      return;
    }
    create.mutate(
      { ...parsed.data, isDefault: parsed.data.isDefault || data.length === 0 },
      { onSuccess: resetForm },
    );
  };

  const scrollToForm = () =>
    document.getElementById('address-form')?.scrollIntoView({ behavior: 'smooth' });

  return {
    addresses: data,
    form,
    errors,
    editingId,
    create,
    update,
    remove,
    setDefault,
    ...queryState,
    resetForm,
    startCreate,
    startEdit,
    setField,
    submit,
    scrollToForm,
  };
}
