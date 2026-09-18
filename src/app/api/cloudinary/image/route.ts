// src/app/api/cloudinary/image/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';
import { apiErrorResponse } from '@/lib/api-error';

const schema = z.object({
  publicId: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
});

function publicIdFromUrl(url?: string | null) {
  if (!url) return null;
  const marker = '/upload/';
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length);
  const segments = path.split('/');
  while (segments[0] && /^(v\d+|q_auto|f_auto|fl_[^/]+)$/.test(segments[0]))
    segments.shift();
  const joined = segments.join('/');
  return joined.replace(/\.[a-z0-9]+$/i, '') || null;
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const publicId = body.publicId ?? publicIdFromUrl(body.url);
    if (!publicId) {
      return NextResponse.json({ success: true, result: 'external-image' });
    }
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
    if (!['ok', 'not found'].includes(result.result))
      return NextResponse.json(
        { error: 'حذف تصویر از Cloudinary ناموفق بود.' },
        { status: 502 },
      );
    return NextResponse.json({ success: true, result: result.result });
  } catch (error) {
    const r = apiErrorResponse(error, 'حذف تصویر از Cloudinary انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
