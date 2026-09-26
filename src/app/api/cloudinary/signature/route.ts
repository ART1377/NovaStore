// src/app/api/cloudinary/signature/route.ts
import { apiErrorResponse } from '@/lib/api-error';
import { requireAdmin } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
export async function POST() {
  try {
    await requireAdmin();
    if (
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_CLOUD_NAME
    )
      return NextResponse.json(
        { error: 'Cloudinary تنظیم نشده است.' },
        { status: 503 },
      );
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'novastore/products';
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET,
    );
    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (e) {
    const r = apiErrorResponse(e, 'ایجاد امضای آپلود انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
