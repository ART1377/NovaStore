// src/features/admin/components/product-general-fields.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NumericInput } from '@/components/ui/numeric-input';
import { Select } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { PRODUCT_STATUS_LABELS } from '@/constants/constants';
import type { FieldErrors } from '@/lib/form-errors';
import { AdminFormField } from './admin-form-field';
import type { FormState } from '../types/product-editor-types';

type CatalogOption = { id: string; name: string; isActive: boolean };

export function ProductGeneralFields({
  form,
  errors,
  setFormValue,
  activeCategories,
  activeBrands,
  optionsLoading,
}: {
  form: FormState;
  errors: FieldErrors;
  setFormValue: <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => void;
  activeCategories: CatalogOption[];
  activeBrands: CatalogOption[];
  optionsLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-5">
        <AdminFormField label="نام محصول" error={errors.name}>
          <Input
            value={form.name}
            onChange={(event) => setFormValue('name', event.target.value)}
            placeholder="مثلاً آیفون ۱۶ پرو"
          />
        </AdminFormField>
        <AdminFormField label="توضیحات" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(event) =>
              setFormValue('description', event.target.value)
            }
            className="focus:border-nova-primary min-h-40 w-full rounded-xl border p-3 text-sm leading-7 outline-none"
            placeholder="توضیحات کامل محصول..."
          />
        </AdminFormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField label="قیمت" error={errors.price}>
            <NumericInput
              value={form.price}
              onValueChange={(value) => setFormValue('price', value)}
              placeholder="مثلاً 1,320,000"
            />
          </AdminFormField>
          <AdminFormField
            label="قیمت قبل از تخفیف"
            error={errors.compareAtPrice}
          >
            <NumericInput
              value={form.compareAtPrice}
              onValueChange={(value) => setFormValue('compareAtPrice', value)}
              placeholder="مثلاً 1,500,000"
            />
          </AdminFormField>
          <AdminFormField label="دسته‌بندی" error={errors.categoryId}>
            <Combobox
              value={form.categoryId}
              onChange={(value) => setFormValue('categoryId', value)}
              placeholder={
                optionsLoading ? 'در حال دریافت...' : 'انتخاب دسته‌بندی'
              }
              searchPlaceholder="جستجوی دسته‌بندی..."
              options={activeCategories.map((option) => ({
                value: option.id,
                label: option.name + (option.isActive ? '' : ' (غیرفعال)'),
              }))}
            />
          </AdminFormField>
          <AdminFormField label="برند">
            <Combobox
              value={form.brandId}
              onChange={(value) => setFormValue('brandId', value)}
              placeholder={optionsLoading ? 'در حال دریافت...' : 'بدون برند'}
              searchPlaceholder="جستجوی برند..."
              clearable
              options={activeBrands.map((option) => ({
                value: option.id,
                label: option.name + (option.isActive ? '' : ' (غیرفعال)'),
              }))}
            />
          </AdminFormField>
          <AdminFormField label="وضعیت">
            <Select
              value={form.status}
              onChange={(event) =>
                setFormValue(
                  'status',
                  event.target.value as FormState['status'],
                )
              }
            >
              {Object.entries(PRODUCT_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </AdminFormField>
        </div>
        <Checkbox
          checked={form.featured}
          onChange={(event) => setFormValue('featured', event.target.checked)}
          label="محصول شاخص"
          className="rounded-xl border p-3"
        />
      </CardContent>
    </Card>
  );
}
