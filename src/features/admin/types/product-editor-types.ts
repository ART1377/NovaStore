// src/features/admin/types/product-editor-types.ts
export type Variant = {
  id?: string;
  sku: string;
  name: string;
  color: string;
  size: string;
  price: string;
  stock: string;
};

export type FormState = {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  brandId: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featured: boolean;
};

export const emptyVariant = (): Variant => ({
  sku: '',
  name: 'مدل اصلی',
  color: '',
  size: '',
  price: '',
  stock: '0',
});

export const initialFormState: FormState = {
  name: '',
  description: '',
  price: '',
  compareAtPrice: '',
  categoryId: '',
  brandId: '',
  status: 'PUBLISHED',
  featured: false,
};
