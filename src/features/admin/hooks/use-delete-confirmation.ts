// src/features/admin/hooks/use-delete-confirmation.ts
import { useState } from 'react';

/**
 * Wires up the id-based "click delete, confirm in a dialog, then run the
 * mutation" flow shared by every admin list page (coupons, products,
 * resources, reviews, ...), so each page only supplies its own delete
 * mutation instead of re-declaring the confirm-id state and callbacks.
 */
export function useDeleteConfirmation<TId>(
  onConfirm: (id: TId, options: { onSuccess: () => void }) => void,
) {
  const [confirmId, setConfirmId] = useState<TId | null>(null);

  return {
    confirmId,
    requestDelete: setConfirmId,
    cancel: () => setConfirmId(null),
    confirm: () => {
      if (confirmId !== null)
        onConfirm(confirmId, { onSuccess: () => setConfirmId(null) });
    },
  };
}
