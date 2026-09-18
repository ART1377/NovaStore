// src/features/compare/hooks/use-compare.ts
'use client';

import { useSyncExternalStore } from 'react';

const KEY = 'novastore-compare';
const EVENT = 'novastore-compare-change';
const EMPTY: string[] = [];

let cachedRaw: string | null = null;
let cachedItems: string[] = EMPTY;

function readItems(): string[] {
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    cachedItems = raw ? JSON.parse(raw) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getServerSnapshot() {
  return EMPTY;
}

export function useCompare() {
  const items = useSyncExternalStore(subscribe, readItems, getServerSnapshot);

  const sync = (next: string[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  };

  const toggle = (id: string) => {
    if (items.includes(id)) {
      sync(items.filter((item) => item !== id));
      return true;
    }
    if (items.length >= 4) return false;
    sync([...items, id]);
    return true;
  };

  const remove = (id: string) => sync(items.filter((item) => item !== id));
  const clear = () => sync([]);
  return {
    items,
    toggle,
    remove,
    clear,
    has: (id: string) => items.includes(id),
  };
}
