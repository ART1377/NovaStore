// src/lib/api-client.ts
import axios from 'axios';
import { API_TIMEOUT_MS } from '@/constants/constants';

export class ApiClientError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly data: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      data?: unknown;
    } = {},
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.data = options.data;
  }
}

const api = axios.create({
  baseURL: '/api',
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const responseError = error.response?.data?.error;
      const message =
        typeof responseError === 'string'
          ? responseError
          : error.code === 'ECONNABORTED'
            ? 'زمان پاسخ‌گویی سرور تمام شد.'
            : error.response
              ? 'ارتباط با سرور برقرار نشد.'
              : 'ارتباط با سرور برقرار نشد.';

      return Promise.reject(
        new ApiClientError(message, {
          status: error.response?.status,
          code: error.code,
          data: error.response?.data,
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default api;
