// src/features/admin/hooks/use-resource-manager.ts
'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useAdminResourceActions, useAdminResources } from './use-admin';
import { useDeleteConfirmation } from './use-delete-confirmation';
import type { AdminResource, AdminResourceKind } from '../types/admin-types';

export function useResourceManager(kind: AdminResourceKind) {
  const { data = [], isLoading, isError, error, refetch } = useAdminResources(kind);
  const { create, update, remove } = useAdminResourceActions(kind);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<AdminResource | null>(null);
  const [formError, setFormError] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const { confirmId, requestDelete, cancel, confirm } = useDeleteConfirmation(remove.mutate);
  const resourceSchema = useMemo(() => z.string().trim().min(2, 'نام باید حداقل ۲ کاراکتر باشد.').max(80, 'نام نمی‌تواند بیشتر از ۸۰ کاراکتر باشد.'), []);
  const list = useMemo(() => data.filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase())), [data, search]);

  const addItem = () => {
    const result = resourceSchema.safeParse(name);
    if (!result.success) { setFormError(result.error.issues[0]?.message ?? 'نام نامعتبر است.'); return; }
    setFormError('');
    create.mutate(result.data, { onSuccess: () => setName('') });
  };

  const startEdit = (item: AdminResource) => { setEditing(item); setEditError(null); };
  const saveItem = (item: AdminResource) => {
    const result = resourceSchema.safeParse(editing?.name ?? item.name);
    if (!result.success) { setEditError(result.error.issues[0]?.message ?? 'نام نامعتبر است.'); return; }
    setEditError(null);
    update.mutate({ id: item.id, name: result.data, isActive: item.isActive }, { onSuccess: () => setEditing(null) });
  };
  const setEditingName = (value: string) => setEditing((current) => current ? { ...current, name: value } : current);
  const cancelEdit = () => { setEditing(null); setEditError(null); };

  return { data, list, isLoading, isError, error, refetch, name, search, editing, formError, editError, create, update, remove, confirmId, setName, setSearch, startEdit, setEditingName, cancelEdit, addItem, saveItem, requestDelete, cancel, confirm };
}
