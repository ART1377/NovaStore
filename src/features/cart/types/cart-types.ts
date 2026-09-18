// src/features/cart/types/cart-types.ts
export type CartItem = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
  variant: { price: number | null; stock: number; name: string } | null;
};
export type Cart = { id: string; items: CartItem[] };
