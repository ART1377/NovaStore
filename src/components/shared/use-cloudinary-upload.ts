// src/components/shared/use-cloudinary-upload.ts
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api-client';
import { getClientErrorMessage } from '@/lib/client-error';
import { formatNumber } from '@/lib/utils';
import type { CloudinaryImageValue } from './cloudinary-types';

export function useCloudinaryUpload(
  value: CloudinaryImageValue[],
  onChange: (images: CloudinaryImageValue[]) => void,
  multiple: boolean,
) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const upload = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const signature = await api.post('/cloudinary/signature');
      const config = signature.data as {
        timestamp: number;
        signature: string;
        cloudName: string;
        apiKey: string;
        folder: string;
      };
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const body = new FormData();
          body.append('file', file);
          body.append('api_key', config.apiKey);
          body.append('timestamp', String(config.timestamp));
          body.append('signature', config.signature);
          body.append('folder', config.folder);
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
            { method: 'POST', body },
          );
          if (!response.ok) throw new Error('آپلود تصویر ناموفق بود.');
          const result = (await response.json()) as {
            secure_url: string;
            public_id: string;
            bytes: number;
          };
          return { url: result.secure_url, publicId: result.public_id, bytes: result.bytes };
        }),
      );
      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(0, 1));
      toast.success(`${formatNumber(uploaded.length)} تصویر با موفقیت در Cloudinary ذخیره شد.`);
    } catch (error) {
      toast.error(getClientErrorMessage(error, 'آپلود تصویر ناموفق بود.'));
    } finally {
      setUploading(false);
    }
  };

  const remove = async (index: number) => {
    const image = value[index];
    if (!image) return;
    setDeletingIndex(index);
    try {
      if (image.publicId || /(?:res\.cloudinary\.com|cloudinary\.com)/i.test(image.url)) {
        await api.delete('/cloudinary/image', {
          data: { publicId: image.publicId ?? null, url: image.url },
        });
      }
      const next = value.filter((_, current) => current !== index);
      toast.success(
        index === 0 && next.length
          ? 'تصویر اصلی حذف شد؛ تصویر بعدی به‌عنوان اصلی انتخاب شد.'
          : image.publicId || /(?:res\.cloudinary\.com|cloudinary\.com)/i.test(image.url)
            ? 'تصویر و فایل Cloudinary با موفقیت حذف شدند.'
            : 'تصویر محصول با موفقیت حذف شد.',
      );
      onChange(next);
    } catch (error) {
      toast.error(getClientErrorMessage(error, 'حذف تصویر از Cloudinary ناموفق بود.'));
    } finally {
      setDeletingIndex(null);
    }
  };

  const setMain = (index: number) => {
    if (index === 0 || !value[index]) return;
    const next = [...value];
    const [main] = next.splice(index, 1);
    if (!main) return;
    next.unshift(main);
    onChange(next);
    toast.success('تصویر اصلی تغییر کرد.');
  };

  return { uploading, deletingIndex, upload, remove, setMain };
}
