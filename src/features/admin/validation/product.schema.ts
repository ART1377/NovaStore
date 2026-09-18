// src/features/admin/validation/product.schema.ts
import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().nullable().optional(),
  bytes: z.number().int().positive().nullable().optional(),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().trim().min(2).max(80),
  name: z.string().trim().min(1).max(80),
  color: z.string().trim().max(50).nullable().optional(),
  size: z.string().trim().max(50).nullable().optional(),
  price: z.number().int().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().max(1_000_000),
});

const baseProductSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(10000),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().nullable().optional(),
  categoryId: z.string().min(1),
  brandId: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  images: imageSchema.array().max(12).default([]),
  imageUrls: z.array(z.string().url()).optional(),
  variants: productVariantSchema.array().min(1).max(30),
});

export const createProductSchema = baseProductSchema.extend({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export const updateProductSchema = baseProductSchema.extend({
  compareAtPrice: z.number().int().positive().nullable(),
  featured: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

/** Falls back to legacy plain image URLs when the richer `images` array is empty. */
export function resolveProductImages(body: {
  images: Array<{
    url: string;
    publicId?: string | null;
    bytes?: number | null;
  }>;
  imageUrls?: string[];
}) {
  return body.images.length
    ? body.images
    : (body.imageUrls ?? []).map((url) => ({
        url,
        publicId: null,
        bytes: null,
      }));
}
