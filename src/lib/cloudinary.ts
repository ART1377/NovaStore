// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export { cloudinary };

export function publicIdFromCloudinaryUrl(url: string | null | undefined) {
  if (!url) return null;
  const marker = '/upload/';
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length);
  const parts = path.split('/');
  while (parts[0] && /^(v\d+|q_auto|f_auto|fl_[^/]+)$/.test(parts[0])) {
    parts.shift();
  }
  const joined = parts.join('/');
  return joined.replace(/\.[a-z0-9]+$/i, '') || null;
}
