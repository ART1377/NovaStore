// src/components/layout/theme-switcher.tsx
'use client';
import { useCloseOnOutsideInteraction } from '@/hooks/use-close-on-outside-interaction';
import {
  DEFAULT_THEME_ID,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  themes,
  type ThemeId,
} from '@/lib/themes';
import { Check, Palette } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

function readStoredTheme(): ThemeId {
  const saved = window.localStorage.getItem(
    THEME_STORAGE_KEY,
  ) as ThemeId | null;
  return themes.some((item) => item.id === saved) ? saved! : DEFAULT_THEME_ID;
}

function subscribe(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

export function ThemeSwitcher() {
  const theme = useSyncExternalStore(
    subscribe,
    readStoredTheme,
    () => DEFAULT_THEME_ID,
  );

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useCloseOnOutsideInteraction(ref, open, () => setOpen(false));
  const change = (next: ThemeId) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    setOpen(false);
  };
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="تغییر تم"
        title="تغییر تم"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="border-nova-line bg-nova-surface text-nova-ink hover:bg-nova-hover inline-flex rounded-2xl border p-2.5 transition"
      >
        <Palette size={18} />
      </button>
      {open && (
        <div
          role="menu"
          className="border-nova-line bg-nova-surface absolute top-[calc(100%+10px)] left-0 z-[60] w-72 rounded-3xl border p-3 shadow-xl"
        >
          <div className="text-nova-muted px-2 pb-2 text-xs font-bold">
            انتخاب رنگ فروشگاه
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitemradio"
                aria-checked={theme === item.id}
                onClick={() => change(item.id)}
                className="text-nova-ink hover:border-nova-line hover:bg-nova-hover flex items-center gap-2 rounded-2xl border border-transparent px-2.5 py-2 text-right text-xs font-medium transition"
              >
                <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
                  {item.colors.map((color, index) => (
                    <span
                      key={index}
                      className="size-4"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
                {theme === item.id && (
                  <Check size={15} className="text-nova-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
