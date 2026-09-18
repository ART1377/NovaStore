// src/lib/address-defaults.ts
import type { Prisma } from '@prisma/client';

/**
 * When an address is being saved as the default, every other address for
 * that user must have its default flag cleared first. Shared by both
 * address create and address update, inside their own transactions.
 */
export async function clearOtherDefaultAddresses(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  await tx.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });
}
