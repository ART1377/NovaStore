// src/features/account/hooks/use-auth.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { authService, type RegisterPayload } from '../api/auth.api';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      callbackUrl,
    }: {
      email: string;
      password: string;
      callbackUrl?: string | null;
    }) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error('ایمیل یا رمز عبور اشتباه است.');
      }

      const session = await getSession();
      const destination =
        session?.user.role === 'ADMIN'
          ? '/admin'
          : callbackUrl &&
              callbackUrl !== '/admin' &&
              !callbackUrl.startsWith('/admin/')
            ? callbackUrl
            : '/';

      return destination;
    },
    onSuccess: (destination) => {
      router.replace(destination);
      router.refresh();
    },
  });
}

export function useRegisterAndLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await authService.register(payload);
      const result = await signIn('credentials', {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error('ورود خودکار ناموفق بود.');
      }
    },
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });
}
