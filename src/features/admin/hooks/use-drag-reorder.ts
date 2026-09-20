// src/features/admin/hooks/use-drag-reorder.ts
'use client';

import { useState } from 'react';

type Dragged = { slot: string; index: number };

export function useDragReorder<TSlot extends string>(
  onReorder: (slot: TSlot, fromIndex: number, toIndex: number) => void,
) {
  const [dragged, setDragged] = useState<Dragged | null>(null);

  const startDrag = (slot: TSlot, index: number) => setDragged({ slot, index });

  const endDrag = () => setDragged(null);

  const drop = (slot: TSlot, toIndex: number) => {
    if (!dragged || dragged.slot !== slot || dragged.index === toIndex) {
      setDragged(null);
      return;
    }
    onReorder(slot, dragged.index, toIndex);
    setDragged(null);
  };

  return { dragged, startDrag, endDrag, drop };
}
