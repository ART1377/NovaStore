// src/features/orders/api/orders.api.ts
import api from '@/lib/api-client';
import type {
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from '@/constants/constants';

export type Order = {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingStatus: ShippingStatus;
  createdAt: string;
  items: { id: string; name: string; unitPrice: number; quantity: number }[];
  shipment: {
    method: string;
    trackingNumber: string | null;
    status: ShippingStatus;
  } | null;
};

export const ordersService = {
  get: async (): Promise<Order[]> => (await api.get<Order[]>('/orders')).data,
  getById: async (id: string): Promise<Order> =>
    (await api.get<Order>(`/orders/${id}`)).data,
};
