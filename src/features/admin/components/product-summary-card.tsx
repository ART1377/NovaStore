// src/features/admin/components/product-summary-card.tsx
import { Card, CardContent } from '@/components/ui/card';
import { PRODUCT_STATUS_LABELS } from '@/constants/constants';
import { formatNumber } from '@/lib/utils';
import { SummaryRow } from './summary-row';
import type { FormState, Variant } from '../types/product-editor-types';
import { totalVariantStock } from '../utils/product-editor-utils';

export function ProductSummaryCard({
  form,
  imagesCount,
  variants,
}: {
  form: FormState;
  imagesCount: number;
  variants: Variant[];
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-nova-primary text-sm">خلاصه</p>
        <div className="mt-3 space-y-3 text-sm">
          <SummaryRow
            label="وضعیت"
            value={PRODUCT_STATUS_LABELS[form.status]}
          />
          <SummaryRow
            label="محصول شاخص"
            value={form.featured ? 'بله' : 'خیر'}
          />
          <SummaryRow label="تصاویر" value={formatNumber(imagesCount)} />
          <SummaryRow label="SKUها" value={formatNumber(variants.length)} />
          <SummaryRow
            label="موجودی کل"
            value={formatNumber(totalVariantStock(variants))}
          />
        </div>
      </CardContent>
    </Card>
  );
}
