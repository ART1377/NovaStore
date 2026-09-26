// src/features/admin/api/admin.api.ts
import api from '@/lib/api-client';
import type {
  AdminCoupon,
  AdminCouponPayload,
  AdminOrder,
  AdminOrderDetail,
  AdminPaginated,
  AdminProduct,
  AdminProductEditor,
  AdminProductOption,
  AdminProductPayload,
  AdminResource,
  AdminResourceKind,
  AdminReview,
  AdminStats,
  AdminHomeData,
  AdminHomePlacementSlot,
  AdminUser,
  AdminUserDetail,
  InventoryUpdate,
  InventoryVariant,
} from '../types/admin-types';
import type {
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from '@/constants/constants';

const resourceUrl = (kind: AdminResourceKind) => `/admin/${kind}`;

type ListParams = { page?: number; search?: string };

/** Unwraps the `{ items, total, page, pageSize, hasMore }` shape that
 * every paginated admin list endpoint returns. */
async function fetchPage<T>(
  url: string,
  params: ListParams = {},
): Promise<AdminPaginated<T>> {
  const response = await api.get<{
    items?: T[];
    products?: T[];
    orders?: T[];
    users?: T[];
    reviews?: T[];
    variants?: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }>(url, { params });

  const items =
    response.data.items ??
    response.data.products ??
    response.data.orders ??
    response.data.users ??
    response.data.reviews ??
    response.data.variants ??
    [];

  return {
    items,
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.pageSize,
    hasMore: response.data.hasMore,
  };
}

export const adminService = {
  getStats: async (): Promise<AdminStats> =>
    (await api.get<AdminStats>('/admin/stats')).data,

  getProducts: (params: ListParams = {}) =>
    fetchPage<AdminProduct>('/admin/products', params),
  getProduct: async (id: string): Promise<AdminProductEditor> =>
    (await api.get<AdminProductEditor>(`/admin/products/${id}`)).data,
  getProductOptions: async (): Promise<{
    categories: AdminProductOption[];
    brands: AdminProductOption[];
  }> => (await api.get('/admin/product-options')).data,
  createProduct: async (payload: AdminProductPayload) =>
    (await api.post('/admin/products', payload)).data,
  updateProduct: async (id: string, payload: AdminProductPayload) =>
    (await api.patch(`/admin/products/${id}`, payload)).data,
  archiveProduct: async (id: string) =>
    (await api.delete(`/admin/products/${id}`)).data,
  restoreProduct: async (id: string) =>
    (await api.post(`/admin/products/${id}/restore`)).data,
  getHomeSettings: async (): Promise<AdminHomeData> =>
    (await api.get<AdminHomeData>('/admin/home')).data,
  updateHomePlacement: async (payload: {
    slot: AdminHomePlacementSlot;
    productIds: string[];
  }) => (await api.put('/admin/home', payload)).data,

  getOrders: (params: ListParams = {}) =>
    fetchPage<AdminOrder>('/admin/orders', params),
  getOrder: async (id: string): Promise<AdminOrderDetail> =>
    (await api.get<AdminOrderDetail>(`/admin/orders/${id}`)).data,
  updateOrder: async (payload: {
    orderId: string;
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    shippingStatus?: ShippingStatus;
    trackingNumber?: string | null;
  }) => (await api.patch('/admin/orders', payload)).data,

  getUsers: (params: ListParams = {}) =>
    fetchPage<AdminUser>('/admin/users', params),
  getUser: async (id: string): Promise<AdminUserDetail> =>
    (await api.get<AdminUserDetail>(`/admin/users/${id}`)).data,
  updateUserRole: async (payload: {
    userId: string;
    role: AdminUser['role'];
  }) => (await api.patch('/admin/users', payload)).data,

  getReviews: (params: ListParams = {}) =>
    fetchPage<AdminReview>('/admin/reviews', params),
  removeReview: async (id: string) =>
    (await api.delete(`/admin/reviews/${id}`)).data,

  getInventory: (params: ListParams = {}) =>
    fetchPage<InventoryVariant>('/admin/inventory', params),
  updateInventory: async (payload: InventoryUpdate) =>
    (await api.patch('/admin/inventory', payload)).data,

  getCoupons: async (): Promise<AdminCoupon[]> =>
    (await api.get<AdminCoupon[]>('/admin/coupons')).data,
  createCoupon: async (payload: AdminCouponPayload) =>
    (await api.post<AdminCoupon>('/admin/coupons', payload)).data,
  updateCoupon: async (
    id: string,
    payload: {
      code?: string;
      type?: AdminCoupon['type'];
      value?: number;
      minOrder?: number;
      usageLimit?: number | null;
      expiresAt?: string | null;
      isActive?: boolean;
    },
  ) => (await api.patch<AdminCoupon>(`/admin/coupons/${id}`, payload)).data,
  deactivateCoupon: async (id: string) =>
    (await api.patch<AdminCoupon>(`/admin/coupons/${id}`, { isActive: false }))
      .data,
  deleteCoupon: async (id: string) =>
    (await api.delete(`/admin/coupons/${id}`)).data,

  getResources: async (kind: AdminResourceKind): Promise<AdminResource[]> =>
    (await api.get<AdminResource[]>(resourceUrl(kind))).data,
  createResource: async (kind: AdminResourceKind, name: string) =>
    (await api.post(resourceUrl(kind), { name })).data,
  updateResource: async (
    kind: AdminResourceKind,
    item: Pick<AdminResource, 'id' | 'name' | 'isActive'>,
  ) =>
    (
      await api.patch(`${resourceUrl(kind)}/${item.id}`, {
        name: item.name,
        isActive: item.isActive,
      })
    ).data,
  deleteResource: async (kind: AdminResourceKind, id: string) =>
    (await api.delete(`${resourceUrl(kind)}/${id}`)).data,
};
