// src/app/api/cloudinary/image/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { cloudinary, publicIdFromCloudinaryUrl } from '@/lib/cloudinary';

const schema = z.object({
  publicId: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
});

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const publicId = body.publicId ?? publicIdFromCloudinaryUrl(body.url);
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
