// src/features/admin/components/product-variants-editor.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { NumericInput } from '@/components/ui/numeric-input';
import type { FieldErrors } from '@/lib/form-errors';
import { formatNumber } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { emptyVariant, type Variant } from '../types/product-editor-types';
import { totalVariantStock } from '../utils/product-editor-utils';

export function ProductVariantsEditor({
  variants,
  errors,
  setVariants,
  setVariantValue,
  onRequestDelete,
}: {
  variants: Variant[];
  errors: FieldErrors;
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
  setVariantValue: <K extends keyof Variant>(
    index: number,
    key: K,
    value: Variant[K],
  ) => void;
  onRequestDelete: (index: number) => void;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">تنوع‌ها و موجودی</h2>
            <p className="text-nova-primary mt-1 text-xs">
              SKU، قیمت و موجودی مستقل برای هر تنوع.
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            size="sm"
            variant="outline"
            onClick={() =>
              setVariants((current) => [...current, emptyVariant()])
            }
          >
            <Plus size={15} />
            افزودن تنوع
          </Button>
        </div>
        <div className="mt-5 space-y-3">
          {variants.map((variant, index) => (
            <div
              key={variant.id ?? index}
              className="bg-nova-hover/60 rounded-2xl border p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <FormField label="SKU" error={errors[`variants.${index}.sku`]}>
                  <Input
                    value={variant.sku}
                    onChange={(event) =>
                      setVariantValue(index, 'sku', event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label="عنوان"
                  error={errors[`variants.${index}.name`]}
                >
                  <Input
                    value={variant.name}
                    onChange={(event) =>
                      setVariantValue(index, 'name', event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label="قیمت اختصاصی"
                  error={errors[`variants.${index}.price`]}
                >
                  <NumericInput
                    value={variant.price}
                    onValueChange={(value) =>
                      setVariantValue(index, 'price', value)
                    }
                    placeholder="اختیاری"
                  />
                </FormField>
                <FormField
                  label="رنگ"
                  error={errors[`variants.${index}.color`]}
                >
                  <Input
                    value={variant.color}
                    onChange={(event) =>
                      setVariantValue(index, 'color', event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label="سایز"
                  error={errors[`variants.${index}.size`]}
                >
                  <Input
                    value={variant.size}
                    onChange={(event) =>
                      setVariantValue(index, 'size', event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label="موجودی"
                  error={errors[`variants.${index}.stock`]}
                >
                  <NumericInput
                    value={variant.stock}
                    onValueChange={(value) =>
                      setVariantValue(index, 'stock', value)
                    }
                  />
                </FormField>
              </div>
              {variants.length > 1 && (
                <Button
                  size="sm"
                  variant="danger"
                  className="mt-3"
                  onClick={() => onRequestDelete(index)}
                >
                  <Trash2 size={14} />
                  حذف
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="bg-nova-ink mt-4 rounded-xl p-4 text-sm text-white">
          موجودی کل: <b>{formatNumber(totalVariantStock(variants))}</b> عدد
        </div>
      </CardContent>
    </Card>
  );
}
