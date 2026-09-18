// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatPrice(amount: number) {
  return (
    new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(
      amount,
    ) + ' تومان'
  );
}
export function formatNumber(amount: number) {
  return new Intl.NumberFormat('fa-IR').format(amount);
}
export function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('fa-IR');
}
export function formatDateTime(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleString('fa-IR');
}
export function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
}

export function numericInputValue(value: string) {
  return toEnglishDigits(value).replace(/[,٬]/g, '').replace(/٫/g, '.');
}

export function formatInputNumber(value: string) {
  const normalized = numericInputValue(value).replace(/[^0-9]/g, '');
  return normalized
    ? new Intl.NumberFormat('en-US').format(Number(normalized))
    : '';
}

export function formatFileSize(bytes: number | null | undefined) {
  if (!bytes || bytes <= 0) return 'نامشخص';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
export function createOrderNumber() {
  return `NS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
