// src/hooks/use-close-on-outside-interaction.ts
import { useEffect, type RefObject } from 'react';

/**
 * Closes an open dropdown/menu when the user clicks (or taps) outside the
 * given container, or presses Escape. Used by every popover-style component
 * (Select, Combobox, ThemeSwitcher, ...) so the open/close-on-outside-click
 * behavior lives in exactly one place.
 */
export function useCloseOnOutsideInteraction(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, ref, onClose]);
}
