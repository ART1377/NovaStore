// src/lib/client-error.ts
import { ApiClientError } from './api-client';

type ErrorPayload = { error?: unknown };

const STATUS_MESSAGES: Record<number, string> = {
  401: 'برای ادامه ابتدا وارد حساب شوید.',
  403: 'شما دسترسی لازم برای این عملیات را ندارید.',
  404: 'مورد موردنظر پیدا نشد.',
  409: 'این عملیات با وضعیت فعلی اطلاعات سازگار نیست.',
};

const TECHNICAL_MESSAGES = new Set([
  'Internal Server Error',
  'Request failed with status code 500',
  'Request failed with status code 502',
  'Request failed with status code 503',
  'Request failed with status code 504',
]);

const getRawMessage = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    const payload = error.data as ErrorPayload | undefined;
    if (typeof payload?.error === 'string') return payload.error;
    return error.message;
  }

  if (error instanceof Error) return error.message;
  return '';
};

export function getClientErrorMessage(
  error: unknown,
  fallback = 'انجام عملیات با مشکل مواجه شد.',
): string {
  const raw = getRawMessage(error).trim();
  if (raw && !TECHNICAL_MESSAGES.has(raw)) {
    if (raw === 'UNAUTHORIZED') return 'برای ادامه ابتدا وارد حساب شوید.';
    if (raw === 'FORBIDDEN') return 'شما دسترسی لازم برای این عملیات را ندارید.';
    return raw;
  }

  if (error instanceof ApiClientError && error.status) {
    const statusMessage = STATUS_MESSAGES[error.status];
    if (statusMessage) return statusMessage;
  }
  return fallback;
}
