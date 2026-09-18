// src/lib/form-errors.ts
import { ZodError } from 'zod';
import { ApiClientError } from '@/lib/api-client';

export type FieldErrors = Record<string, string>;

export function zodFieldErrors(error: ZodError): FieldErrors {
  return error.issues.reduce<FieldErrors>((result, issue) => {
    const key = issue.path.join('.');
    if (key && !result[key]) result[key] = issue.message;
    return result;
  }, {});
}

export function apiFieldErrors(error: unknown): FieldErrors {
  if (error instanceof ApiClientError) {
    const data = error.data;
    if (
      data &&
      typeof data === 'object' &&
      'fieldErrors' in data &&
      typeof data.fieldErrors === 'object' &&
      data.fieldErrors !== null
    ) {
      return Object.fromEntries(
        Object.entries(data.fieldErrors).filter(
          (entry): entry is [string, string] =>
            typeof entry[0] === 'string' && typeof entry[1] === 'string',
        ),
      );
    }
  }
  return {};
}
