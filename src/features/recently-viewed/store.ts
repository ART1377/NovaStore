// src/features/recently-viewed/store.ts
export type RecentlyViewedItem = {
  slug: string;
  name: string;
  image?: string;
  price: number;
};

export const RECENT_ITEMS_KEY = 'novastore-recent-items';
export const RECENT_ITEMS_EVENT = 'novastore-recent-items-change';
export const MAX_RECENT_ITEMS = 8;

const EMPTY: RecentlyViewedItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: RecentlyViewedItem[] = EMPTY;

/** Cached read: avoids re-parsing JSON on every subscriber callback. */
export function readRecentlyViewed(): RecentlyViewedItem[] {
  const raw = localStorage.getItem(RECENT_ITEMS_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    cachedItems = raw ? JSON.parse(raw) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

export function subscribeRecentlyViewed(callback: () => void) {
  window.addEventListener(RECENT_ITEMS_EVENT, callback);
  return () => window.removeEventListener(RECENT_ITEMS_EVENT, callback);
}

export function pushRecentlyViewed(item: RecentlyViewedItem) {
  try {
    const current = readRecentlyViewed();
    const next = [
      item,
      ...current.filter((entry) => entry.slug !== item.slug),
    ].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(RECENT_ITEMS_EVENT));
  } catch {}
}
