// src/features/admin/components/resource-manager.tsx
'use client';
import { SearchField } from '@/components/shared';
import { QueryEmpty } from '@/components/shared/query-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check, Plus, Power, Trash2, X } from 'lucide-react';
import { useResourceManager } from '../hooks/use-resource-manager';
import type { AdminResourceKind } from '../types/admin-types';
import { AdminListSkeleton } from './admin-list-skeleton';
import { AdminPageHeader } from './admin-page-header';
export function SimpleResourceManager({
  kind,
  title,
}: {
  kind: AdminResourceKind;
  title: string;
}) {
  const manager = useResourceManager(kind);
  const {
    resourceLabel,
    name,
    search,
    editing,
    formError,
    editError,
    list,
    isLoading,
    create,
    update,
    remove,
    setName,
    setSearch,
    startEdit,
    setEditingName,
    cancelEdit,
    addItem,
    saveItem,
    requestDelete,
    cancel,
    confirm,
    confirmId,
  } = {
    ...manager,
    resourceLabel: kind === 'categories' ? 'دسته‌بندی' : 'برند',
  };

  if (isLoading) return <AdminListSkeleton rows={5} withThumbnail={false} />;
  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow={`مدیریت / ${title}`}
        title={title}
        description="مدیریت نام، وضعیت و استفاده در کاتالوگ."
      />
      <Card className="mt-6">
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder={`نام ${title}`}
                aria-invalid={!!formError}
              />
              <p className="text-nova-danger mt-1 min-h-5 text-xs font-medium">
                {formError}
              </p>
            </div>
            <Button
              className="w-full sm:w-auto"
              disabled={create.isPending}
              onClick={addItem}
            >
              <Plus size={15} />
              افزودن
            </Button>
          </div>
          <div className="mt-4 max-w-3xl">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="جستجو..."
            />
          </div>
          <div className="mt-5 space-y-2">
            {list.map((item) =>
              editing?.id === item.id ? (
                <div
                  key={item.id}
                  className="bg-nova-hover flex flex-col gap-2 rounded-xl border p-3 sm:flex-row"
                >
                  <div className="min-w-0 flex-1">
                    <Input
                      value={editing.name}
                      onChange={(e) => {
                        setEditingName(e.target.value);
                      }}
                      aria-invalid={
                        editing.name.trim().length > 0 &&
                        editing.name.trim().length < 2
                      }
                    />
                    <p className="text-nova-danger mt-1 min-h-5 text-xs font-medium">
                      {editError ?? ''}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={update.isPending}
                    onClick={() => saveItem(editing)}
                  >
                    <Check size={14} />
                    ذخیره
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X size={14} />
                    لغو
                  </Button>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-nova-muted mt-1 text-xs">
                      {item.slug} · {item._count?.products ?? 0} محصول
                    </p>
                  </div>
                  <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                    <Badge
                      className={
                        item.isActive === false
                          ? 'bg-nova-soft text-nova-primary'
                          : 'bg-emerald-50 text-emerald-700'
                      }
                    >
                      {item.isActive === false ? 'غیرفعال' : 'فعال'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(item)}
                    >
                      ویرایش
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ ...item, isActive: !item.isActive })
                      }
                    >
                      <Power size={14} />
                      {item.isActive === false ? 'فعال‌سازی' : 'غیرفعال‌سازی'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => requestDelete(item.id)}
                    >
                      <Trash2 size={14} />
                      حذف
                    </Button>
                  </div>
                </div>
              ),
            )}
            {!list.length && (
              <QueryEmpty
                title={
                  search
                    ? 'موردی پیدا نشد'
                    : `هنوز ${resourceLabel}ای ثبت نشده است`
                }
                description={
                  search
                    ? 'عبارت جستجو را تغییر بده یا فیلتر را پاک کن.'
                    : `اولین ${resourceLabel} را از فرم بالا اضافه کن.`
                }
              />
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!confirmId}
        title={`حذف ${title}`}
        description="آیا از حذف این مورد مطمئن هستید؟ در صورت وجود محصول وابسته، عملیات انجام نمی‌شود."
        busy={remove.isPending}
        onClose={cancel}
        onConfirm={confirm}
      />
    </main>
  );
}
