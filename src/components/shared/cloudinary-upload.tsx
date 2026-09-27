'use client';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { formatFileSize } from '@/lib/utils';
import { Check, Loader2, Star, Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { CloudinaryImageValue } from './cloudinary-types';
import { useCloudinaryUpload } from './use-cloudinary-upload';

type CloudinaryUploadProps = {
  value: CloudinaryImageValue[];
  onChange: (images: CloudinaryImageValue[]) => void;
  multiple?: boolean;
  disabled?: boolean;
};

export function CloudinaryUpload({
  value,
  onChange,
  multiple = true,
  disabled = false,
}: CloudinaryUploadProps) {
  const { uploading, deletingIndex, upload, remove, setMain } =
    useCloudinaryUpload(value, onChange, multiple);
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

  const confirmDelete = () => {
    if (confirmIndex === null) return;
    void remove(confirmIndex).finally(() => setConfirmIndex(null));
  };

  return (
    <div className="space-y-3">
      <label className="bg-nova-hover/70 hover:bg-nova-hover flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6d0c5] px-4 text-center transition hover:border-[#a8b1c0]">
        {uploading ? (
          <Loader2 className="text-nova-primary animate-spin" />
        ) : (
          <UploadCloud className="text-nova-primary" />
        )}
        <span className="mt-2 text-sm font-semibold">
          {uploading ? 'در حال آپلود...' : 'انتخاب تصویر برای آپلود'}
        </span>
        <span className="text-nova-muted mt-1 text-xs">
          PNG، JPG یا WEBP · آپلود مستقیم به Cloudinary
        </span>
        <input
          className="hidden"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple={multiple}
          disabled={disabled || uploading}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            void upload(multiple ? files : files.slice(0, 1));
            event.currentTarget.value = '';
          }}
        />
      </label>

      {value.length > 0 ? (
        <div className="@container">
          <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4">
            {value.map((image, index) => {
              const isMain = index === 0;
              const deleting = deletingIndex === index;
              return (
                <article
                  key={`${image.url}-${index}`}
                  className={`bg-nova-surface overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    isMain
                      ? 'border-nova-ink ring-nova-ink/10 ring-2'
                      : 'border-nova-line-strong'
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-[#f4f2ed]">
                    <Image
                      src={image.url}
                      alt={`تصویر محصول ${index + 1}`}
                      fill
                      className="object-contain p-1.5"
                      sizes="(max-width:640px) 100vw, 220px"
                    />
                    <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-1.5">
                      <span className="bg-nova-surface/95 inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-sm">
                        {index + 1}
                      </span>
                      {isMain ? (
                        <span className="bg-nova-ink inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          <Star size={10} className="fill-current" /> اصلی
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-2 border-t p-2">
                    <p className="text-nova-muted text-center text-[10px] font-medium tabular-nums">
                      {formatFileSize(image.bytes)}
                    </p>
                    <div className="flex w-full gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={isMain ? 'default' : 'outline'}
                        className="flex-1 overflow-hidden"
                        disabled={isMain}
                        onClick={() => setMain(index)}
                        title={
                          isMain ? 'تصویر اصلی' : 'انتخاب به‌عنوان تصویر اصلی'
                        }
                      >
                        {isMain ? (
                          <>
                            <Check size={13} className="shrink-0" />
                            <span className="truncate">اصلی</span>
                          </>
                        ) : (
                          <>
                            <Star size={13} className="shrink-0" />
                            <span className="truncate">انتخاب اصلی</span>
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        className="px-2"
                        disabled={deleting}
                        onClick={() => setConfirmIndex(index)}
                        aria-label="حذف تصویر"
                        title="حذف تصویر"
                      >
                        {deleting ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmIndex !== null}
        title="حذف تصویر"
        description="این تصویر از گالری محصول حذف می‌شود. اگر تصویر اصلی باشد، تصویر بعدی جایگزین آن می‌شود."
        busy={deletingIndex !== null}
        onClose={() => setConfirmIndex(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
