// src/features/admin/components/product-images-card.tsx
import { Card, CardContent } from '@/components/ui/card';
import { CloudinaryUpload } from '@/components/shared/cloudinary-upload';
import { type CloudinaryImageValue } from '@/components/shared/cloudinary-types';

export function ProductImagesCard({
  images,
  onChange,
}: {
  images: CloudinaryImageValue[];
  onChange: (images: CloudinaryImageValue[]) => void;
}) {
  return (
    <Card>
      <CardContent>
        <div>
          <h2 className="font-bold">گالری تصاویر</h2>
          <p className="text-nova-primary mt-1 text-xs">
            تصویر اول به‌عنوان تصویر اصلی استفاده می‌شود.
          </p>
        </div>
        <div className="mt-4">
          <CloudinaryUpload value={images} onChange={onChange} />
        </div>
      </CardContent>
    </Card>
  );
}
