// src/components/shared/cloudinary-upload.tsx
'use client';

import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';
import { Check, Loader2, Star, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
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

  return (
    <div className="space-y-3">
      <label className="bg-nova-hover/70 hover:bg-nova-hover flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6d0c5] px-4 text-center transition hover:border-[#a8b1c0]">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {value.map((image, index) => {
            const isMain = index === 0;
            const deleting = deletingIndex === index;
            return (
              <article
                key={`${image.url}-${index}`}
                className={`bg-nova-surface overflow-hidden rounded-3xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${isMain ? 'border-nova-ink ring-nova-ink/10 ring-2' : 'border-nova-line-strong'}`}
              >
                <div className="relative aspect-[4/3] bg-[#f4f2ed]">
                  <Image
                    src={image.url}
                    alt={`تصویر محصول ${index + 1}`}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 360px"
                  />
                  <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                    <span className="bg-nova-surface/95 inline-flex shrink-0 items-center rounded-full border px-2.5 py-1.5 text-[10px] font-bold shadow-sm">
                      تصویر {index + 1}
                    </span>
                    {isMain ? (
                      <span className="bg-nova-ink inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm">
                        <Star size={12} className="fill-current" /> اصلی
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-4 border-t p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-nova-hover rounded-2xl px-3 py-2.5">
                      <p className="text-nova-muted text-[10px] font-medium">
                        حجم فایل
                      </p>
                      <p className="mt-1 text-sm font-black tabular-nums">
                        {formatFileSize(image.bytes)}
                      </p>
                    </div>
                    <div className="bg-nova-hover rounded-2xl px-3 py-2.5">
                      <p className="text-nova-muted text-[10px] font-medium">
                        جایگاه
                      </p>
                      <p className="mt-1 text-sm font-black">
                        {isMain ? 'اولین تصویر کاربر' : `${index + 1} در گالری`}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 2xl:grid-cols-2">
                    <Button
                      type="button"
                      variant={isMain ? 'default' : 'outline'}
                      className="w-full min-w-0 justify-center text-center leading-5 whitespace-normal"
                      disabled={isMain}
                      onClick={() => setMain(index)}
                    >
                      {isMain ? (
                        <>
                          <Check size={15} /> تصویر اصلی
                        </>
                      ) : (
                        <>
                          <Star size={15} /> انتخاب به‌عنوان اصلی
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="w-full min-w-0 justify-center"
                      disabled={deleting}
                      onClick={() => void remove(index)}
                    >
                      {deleting ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <X size={15} />
                      )}{' '}
                      حذف
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
