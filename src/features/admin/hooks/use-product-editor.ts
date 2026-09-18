// src/features/admin/hooks/use-product-editor.ts
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { CloudinaryImageValue } from '@/components/shared/cloudinary-types';
import { apiFieldErrors, type FieldErrors } from '@/lib/form-errors';
import { formatInputNumber } from '@/lib/utils';
import { useAdminProduct, useAdminProductActions, useAdminProductOptions } from './use-admin';
import { emptyVariant, initialFormState, type FormState, type Variant } from '../types/product-editor-types';
import { buildProductPayload } from '../utils/product-editor-utils';
import { validateProductForm } from '../validation/product-editor-validation';

type UseProductEditorParams = { id?: string };

export function useProductEditor({ id }: UseProductEditorParams) {
  const router = useRouter();
  const optionsQuery = useAdminProductOptions();
  const productQuery = useAdminProduct(id);
  const { save, create } = useAdminProductActions();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [variants, setVariants] = useState<Variant[]>([emptyVariant()]);
  const [images, setImages] = useState<CloudinaryImageValue[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [confirmVariantIndex, setConfirmVariantIndex] = useState<number | null>(null);
  const syncedProductData = useRef(productQuery.data);

  useEffect(() => {
    const productData = productQuery.data;
    if (!productData || productData === syncedProductData.current) return;

    syncedProductData.current = productData;
    setForm({
      name: productData.name,
      description: productData.description,
      price: formatInputNumber(String(productData.price)),
      compareAtPrice: productData.compareAtPrice ? formatInputNumber(String(productData.compareAtPrice)) : '',
      categoryId: productData.categoryId,
      brandId: productData.brandId ?? '',
      status: productData.status,
      featured: productData.featured,
    });
    setImages(productData.images.map((image) => ({ url: image.url, publicId: image.publicId, bytes: image.bytes })));
    setVariants(
      productData.variants.length
        ? productData.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            name: variant.name,
            color: variant.color ?? '',
            size: variant.size ?? '',
            price: variant.price == null ? '' : formatInputNumber(String(variant.price)),
            stock: formatInputNumber(String(variant.stock)),
          }))
        : [emptyVariant()],
    );
  }, [productQuery.data]);

  const activeCategories = useMemo(
    () => optionsQuery.data?.categories.filter((option) => option.isActive || option.id === productQuery.data?.categoryId) ?? [],
    [optionsQuery.data?.categories, productQuery.data?.categoryId],
  );
  const activeBrands = useMemo(
    () => optionsQuery.data?.brands.filter((option) => option.isActive || option.id === productQuery.data?.brandId) ?? [],
    [optionsQuery.data?.brands, productQuery.data?.brandId],
  );

  const setFormValue = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[String(key)];
      return next;
    });
  };

  const setVariantValue = <K extends keyof Variant>(index: number, key: K, value: Variant[K]) => {
    setVariants((current) => current.map((variant, currentIndex) => currentIndex === index ? { ...variant, [key]: value } : variant));
    setErrors((current) => {
      const next = { ...current };
      delete next[`variants.${index}.${String(key)}`];
      return next;
    });
  };

  const removeVariant = () => {
    if (confirmVariantIndex === null) return;
    setVariants((current) => current.filter((_, index) => index !== confirmVariantIndex));
    setConfirmVariantIndex(null);
  };

  const submit = () => {
    const validationErrors = validateProductForm(form, variants);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      toast.error('لطفاً خطاهای مشخص‌شده در فرم را برطرف کنید.');
      return;
    }

    const payload = buildProductPayload(form, variants, images);
    const onError = (error: unknown) => setErrors((current) => ({ ...current, ...apiFieldErrors(error) }));

    if (id) {
      save.mutate({ id, payload }, { onError });
      return;
    }

    create.mutate(payload, {
      onSuccess: () => router.push('/admin/products'),
      onError,
    });
  };

  return {
    form,
    variants,
    images,
    errors,
    setImages,
    setVariants,
    setFormValue,
    setVariantValue,
    confirmVariantIndex,
    setConfirmVariantIndex,
    removeVariant,
    activeCategories,
    activeBrands,
    optionsLoading: optionsQuery.isLoading,
    optionsError: optionsQuery.error,
    refetchOptions: optionsQuery.refetch,
    productLoading: productQuery.isLoading,
    productError: productQuery.error,
    refetchProduct: productQuery.refetch,
    isSaving: save.isPending || create.isPending,
    submit,
    goBack: () => router.push('/admin/products'),
  };
}
