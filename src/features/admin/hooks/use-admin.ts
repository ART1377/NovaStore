// src/features/admin/hooks/use-admin.ts
'use client';

import { getClientErrorMessage } from '@/lib/client-error';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { QueryKey } from '@tanstack/react-query';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { adminService } from '../api/admin.api';
import type {
  AdminCoupon,
  AdminCouponPayload,
  AdminProductPayload,
  AdminResourceKind,
  InventoryUpdate,
} from '../types/admin-types';

const showError = (error: unknown, fallback: string) =>
  toast.error(getClientErrorMessage(error, fallback));

function useAdminMutation<TVariables, TData>({
  mutationFn,
  invalidateKeys,
  successMessage,
  errorFallback,
  onSuccessExtra,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateKeys: (variables: TVariables) => QueryKey[];
  successMessage: string | ((variables: TVariables) => string);
  errorFallback: string;
  onSuccessExtra?: (data: TData, variables: TVariables) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      onSuccessExtra?.(data, variables);
      invalidateKeys(variables).forEach(
        (queryKey) => void queryClient.invalidateQueries({ queryKey }),
      );
      toast.success(
        typeof successMessage === 'function'
          ? successMessage(variables)
          : successMessage,
      );
    },
    onError: (error) => showError(error, errorFallback),
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: QUERY_KEYS.adminStats,
    queryFn: adminService.getStats,
    staleTime: 60_000,
  });
}

export function useAdminProducts(
  params: { page?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminProducts, params],
    queryFn: () => adminService.getProducts(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminProduct(id?: string) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.adminProduct(id) : ['admin-product', 'new'],
    queryFn: () => {
      if (!id) throw new Error('شناسه محصول مشخص نشده است.');
      return adminService.getProduct(id);
    },
    enabled: Boolean(id),
  });
}

export function useAdminProductOptions() {
  return useQuery({
    queryKey: QUERY_KEYS.adminProductOptions,
    queryFn: adminService.getProductOptions,
    staleTime: 5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useAdminProductActions() {
  const archive = useAdminMutation({
    mutationFn: (id: string) => adminService.archiveProduct(id),
    invalidateKeys: () => [
      QUERY_KEYS.adminProducts,
      QUERY_KEYS.adminHomeSettings,
      QUERY_KEYS.adminInventory,
      QUERY_KEYS.adminStats,
    ],
    successMessage: 'محصول با موفقیت آرشیو شد.',
    errorFallback: 'آرشیو محصول انجام نشد.',
  });
  const restore = useAdminMutation({
    mutationFn: (id: string) => adminService.restoreProduct(id),
    invalidateKeys: () => [
      QUERY_KEYS.adminProducts,
      QUERY_KEYS.adminHomeSettings,
      QUERY_KEYS.adminInventory,
      QUERY_KEYS.adminStats,
    ],
    successMessage: 'محصول با موفقیت از آرشیو خارج شد.',
    errorFallback: 'بازگردانی محصول انجام نشد.',
  });
  const save = useAdminMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminProductPayload;
    }) => adminService.updateProduct(id, payload),
    invalidateKeys: (variables) => [
      QUERY_KEYS.adminProducts,
      QUERY_KEYS.adminProduct(variables.id),
    ],
    successMessage: 'محصول با موفقیت ویرایش شد.',
    errorFallback: 'ذخیره محصول انجام نشد.',
  });
  const create = useAdminMutation({
    mutationFn: (payload: AdminProductPayload) =>
      adminService.createProduct(payload),
    invalidateKeys: () => [QUERY_KEYS.adminProducts],
    successMessage: 'محصول با موفقیت ایجاد شد.',
    errorFallback: 'ساخت محصول انجام نشد.',
  });

  return { archive, restore, save, create };
}

export function useAdminOrders(
  params: { page?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminOrders, params],
    queryFn: () => adminService.getOrders(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.adminOrder(id),
    queryFn: () => adminService.getOrder(id),
    enabled: Boolean(id),
  });
}

export function useAdminOrderActions() {
  const update = useAdminMutation({
    mutationFn: adminService.updateOrder,
    invalidateKeys: (variables) => [
      QUERY_KEYS.adminOrders,
      QUERY_KEYS.adminStats,
      QUERY_KEYS.orders,
      ...(variables.orderId
        ? [
            QUERY_KEYS.adminOrder(variables.orderId),
            QUERY_KEYS.order(variables.orderId),
          ]
        : []),
    ],
    successMessage: 'جزئیات سفارش با موفقیت به‌روزرسانی شد.',
    errorFallback: 'تغییر وضعیت سفارش انجام نشد.',
  });
  return { update };
}

export function useAdminUsers(params: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminUsers, params],
    queryFn: () => adminService.getUsers(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.adminUser(id),
    queryFn: () => adminService.getUser(id),
    enabled: Boolean(id),
  });
}

export function useAdminUserActions() {
  const { update: updateSession } = useSession();
  const updateRole = useAdminMutation({
    mutationFn: adminService.updateUserRole,
    invalidateKeys: (variables) => [
      QUERY_KEYS.adminUsers,
      QUERY_KEYS.adminUser(variables.userId),
    ],
    successMessage: 'نقش کاربر با موفقیت به‌روزرسانی شد.',
    errorFallback: 'تغییر نقش کاربر انجام نشد.',
    onSuccessExtra: async () => {
      await updateSession();
    },
  });
  return { updateRole };
}

export function useAdminReviews(
  params: { page?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminReviews, params],
    queryFn: () => adminService.getReviews(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminReviewActions() {
  const remove = useAdminMutation({
    mutationFn: (id: string) => adminService.removeReview(id),
    invalidateKeys: () => [QUERY_KEYS.adminReviews, QUERY_KEYS.accountReviews],
    successMessage: 'نظر با موفقیت حذف شد.',
    errorFallback: 'حذف نظر انجام نشد.',
  });
  return { remove };
}

export function useAdminInventory(
  params: { page?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminInventory, params],
    queryFn: () => adminService.getInventory(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminInventoryActions() {
  const update = useAdminMutation({
    mutationFn: (payload: InventoryUpdate) =>
      adminService.updateInventory(payload),
    invalidateKeys: () => [QUERY_KEYS.adminInventory, QUERY_KEYS.adminStats],
    successMessage: 'موجودی محصول با موفقیت به‌روزرسانی شد.',
    errorFallback: 'به‌روزرسانی موجودی انجام نشد.',
  });
  return { update };
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: QUERY_KEYS.adminCoupons,
    queryFn: adminService.getCoupons,
  });
}

type CouponUpdatePayload = {
  code?: string;
  type?: AdminCoupon['type'];
  value?: number;
  minOrder?: number;
  usageLimit?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
};

export function useAdminCouponActions() {
  const queryClient = useQueryClient();

  const patchCouponCache = (
    updater: (current: AdminCoupon[]) => AdminCoupon[],
  ) => {
    queryClient.setQueryData<AdminCoupon[]>(
      QUERY_KEYS.adminCoupons,
      (current = []) => updater(current),
    );
  };

  const create = useAdminMutation({
    mutationFn: (payload: AdminCouponPayload) =>
      adminService.createCoupon(payload),
    invalidateKeys: () => [QUERY_KEYS.adminCoupons],
    successMessage: 'کد تخفیف با موفقیت ایجاد شد.',
    errorFallback: 'ساخت کد تخفیف انجام نشد.',
    onSuccessExtra: (coupon) =>
      patchCouponCache((current) => [coupon, ...current]),
  });

  const update = useAdminMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CouponUpdatePayload;
    }) => adminService.updateCoupon(id, payload),
    invalidateKeys: () => [QUERY_KEYS.adminCoupons],
    successMessage: 'کد تخفیف با موفقیت به‌روزرسانی شد.',
    errorFallback: 'ذخیره تغییرات انجام نشد.',
    onSuccessExtra: (coupon) =>
      patchCouponCache((current) =>
        current.map((item) => (item.id === coupon.id ? coupon : item)),
      ),
  });

  const deactivate = useAdminMutation({
    mutationFn: (id: string) => adminService.deactivateCoupon(id),
    invalidateKeys: () => [QUERY_KEYS.adminCoupons],
    successMessage: 'کد تخفیف غیرفعال شد.',
    errorFallback: 'غیرفعال‌سازی کد تخفیف انجام نشد.',
    onSuccessExtra: (coupon) =>
      patchCouponCache((current) =>
        current.map((item) => (item.id === coupon.id ? coupon : item)),
      ),
  });

  const remove = useAdminMutation({
    mutationFn: (id: string) => adminService.deleteCoupon(id),
    invalidateKeys: () => [QUERY_KEYS.adminCoupons],
    successMessage: 'کد تخفیف با موفقیت حذف شد.',
    errorFallback: 'حذف کد تخفیف انجام نشد.',
    onSuccessExtra: (_, id) =>
      patchCouponCache((current) => current.filter((item) => item.id !== id)),
  });

  return { create, update, deactivate, remove };
}

const RESOURCE_QUERY_KEYS: Record<AdminResourceKind, QueryKey> = {
  categories: QUERY_KEYS.adminCategories,
  brands: QUERY_KEYS.adminBrands,
};
const RESOURCE_LABELS: Record<AdminResourceKind, string> = {
  categories: 'دسته‌بندی',
  brands: 'برند',
};

export function useAdminResources(kind: AdminResourceKind) {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS[kind],
    queryFn: () => adminService.getResources(kind),
  });
}

export function useAdminResourceActions(kind: AdminResourceKind) {
  const queryKey = RESOURCE_QUERY_KEYS[kind];
  const label = RESOURCE_LABELS[kind];

  const create = useAdminMutation({
    mutationFn: (name: string) => adminService.createResource(kind, name),
    invalidateKeys: () => [queryKey],
    successMessage: `${label} اضافه شد.`,
    errorFallback: 'افزودن مورد انجام نشد.',
  });
  const update = useAdminMutation({
    mutationFn: (item: { id: string; name: string; isActive: boolean }) =>
      adminService.updateResource(kind, item),
    invalidateKeys: () => [queryKey],
    successMessage: `${label} با موفقیت ویرایش شد.`,
    errorFallback: 'ذخیره تغییرات انجام نشد.',
  });
  const remove = useAdminMutation({
    mutationFn: (id: string) => adminService.deleteResource(kind, id),
    invalidateKeys: () => [queryKey],
    successMessage: `${label} با موفقیت حذف شد.`,
    errorFallback: `حذف ${label} انجام نشد.`,
  });

  return { create, update, remove };
}

export function useAdminHomeSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.adminHomeSettings,
    queryFn: adminService.getHomeSettings,
    staleTime: 60_000,
    retry: 2,
  });
}

export function useAdminHomeActions() {
  const updatePlacement = useAdminMutation({
    mutationFn: adminService.updateHomePlacement,
    invalidateKeys: () => [QUERY_KEYS.adminHomeSettings],
    successMessage: 'جایگاه صفحه اصلی با موفقیت به‌روزرسانی شد.',
    errorFallback: 'به‌روزرسانی صفحه اصلی انجام نشد.',
  });
  return { updatePlacement };
}
