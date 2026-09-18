// src/features/catalog/api/catalog.api.ts
import api from '@/lib/api-client';
import type {
  Product,
  ProductFilters,
  ProductList,
} from '../types/catalog-types';

export const catalogService = {
  getProducts: async (
    filters: ProductFilters,
    signal?: AbortSignal,
  ): Promise<ProductList> =>
    (await api.get<ProductList>('/products', { params: filters, signal })).data,
  getProduct: async (slug: string, signal?: AbortSignal): Promise<Product> =>
    (await api.get<Product>(`/products/${slug}`, { signal })).data,
};
