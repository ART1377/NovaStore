// src/lib/cart-subtotal.ts
import { db } from './prisma';

/**
 * Loads the user's cart with items and computes the subtotal, or returns
 * null when the cart is empty. Shared by checkout and coupon-preview so
 * "how do we price a cart" stays defined in one place.
 */
export async function getCartWithSubtotal(userId: string) {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true, variant: true } } },
  });
  if (!cart?.items.length) return null;

  const subtotal = cart.items.reduce(
    (sum, item) =>
      sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0,
  );
  return { cart, subtotal };
}
