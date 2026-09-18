// src/features/admin/components/product-editor.tsx
'use client';

import { ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { useProductEditor } from '../hooks/use-product-editor';
import { ProductGeneralFields } from './product-general-fields';
import { ProductVariantsEditor } from './product-variants-editor';
import { ProductImagesCard } from './product-images-card';
import { ProductSummaryCard } from './product-summary-card';
import { AdminDetailSkeleton } from './admin-detail-skeleton';
import { QueryError } from '@/components/shared/query-state';

export function ProductEditor({ id }: { id?: string }) {
  const editor = useProductEditor({ id });

  if (id && editor.productLoading) return <AdminDetailSkeleton />;
  if (id && editor.productError) {
    return (
      <QueryError
        message="دریافت محصول ناموفق بود. دوباره تلاش کنید."
        onRetry={() => void editor.refetchProduct()}
      />
    );
  }

  const optionsErrorNotice = editor.optionsError ? (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
      <p className="font-semibold text-red-700">دریافت دسته‌بندی‌ها و برندها ناموفق بود.</p>
      <Button size="sm" variant="outline" className="mt-3" onClick={() => void editor.refetchOptions()}>تلاش مجدد</Button>
    </div>
  ) : null;

  return (
    <main className="w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-nova-muted text-xs">مدیریت / محصولات / {id ? 'ویرایش' : 'جدید'}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{id ? 'ویرایش محصول' : 'محصول جدید'}</h1>
        </div>
        <Button className="w-full sm:w-auto" variant="outline" onClick={editor.goBack}>
          <ArrowRight size={16} /> بازگشت
        </Button>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {optionsErrorNotice}
          <ProductGeneralFields
            form={editor.form}
            errors={editor.errors}
            setFormValue={editor.setFormValue}
            activeCategories={editor.activeCategories}
            activeBrands={editor.activeBrands}
            optionsLoading={editor.optionsLoading}
          />
          <ProductVariantsEditor
            variants={editor.variants}
            errors={editor.errors}
            setVariants={editor.setVariants}
            setVariantValue={editor.setVariantValue}
            onRequestDelete={editor.setConfirmVariantIndex}
          />
        </div>

        <div className="space-y-6">
          {optionsErrorNotice}
          <ProductImagesCard images={editor.images} onChange={editor.setImages} />
          <ProductSummaryCard form={editor.form} imagesCount={editor.images.length} variants={editor.variants} />
          <Button size="lg" className="w-full" disabled={editor.isSaving} onClick={editor.submit}>
            <Save size={18} /> {editor.isSaving ? 'در حال ذخیره...' : 'ذخیره محصول'}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={editor.confirmVariantIndex !== null}
        title="حذف Variant"
        description="آیا از حذف این تنوع مطمئن هستید؟"
        onClose={() => editor.setConfirmVariantIndex(null)}
        onConfirm={editor.removeVariant}
      />
    </main>
  );
}
