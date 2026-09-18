// src/features/catalog/types/catalog-types.ts
export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  images: { id: string; url: string; alt: string | null }[];
  variants: {
    id: string;
    sku: string;
    name: string;
    color: string | null;
    size: string | null;
    price: number | null;
    stock: number;
  }[];
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string };
  _count?: { reviews: number };
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    createdAt?: string;
    updatedAt?: string;
    user: { id?: string; name: string | null; role?: string };
    replies?: {
      id: string;
      comment: string;
      createdAt: string;
      user: { id?: string; name: string | null; role?: string };
    }[];
  }[];
  relatedFrom?: { toProduct: Product }[];
  ratingAverage?: number;
  ratingCount?: number;
  ratingDistribution?: Record<string, number>;
};
export type ProductFilters = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: number;
  available?: string;
  discounted?: string;
  rating?: string;
};

export type CatalogOption = { id: string; name: string; slug: string };
export type ProductList = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  categories: CatalogOption[];
  brands: CatalogOption[];
};
