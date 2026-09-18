// src/features/account/hooks/use-login-form.ts
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useLogin } from './use-auth';
import { loginSchema } from '../validation/auth.schema';
import { zodFieldErrors, type FieldErrors } from '@/lib/form-errors';
import { getClientErrorMessage } from '@/lib/client-error';

export function useLoginForm() {
  const searchParams = useSearchParams();
  const login = useLogin();
  const [email, setEmail] = useState('admin@shop.dev');
  const [password, setPassword] = useState('Admin123!');
  const [errors, setErrors] = useState<FieldErrors>({});
  const callback = searchParams.get('callbackUrl');
  const safeCallback = callback?.startsWith('/') && !callback.startsWith('//') ? callback : null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    login.mutate({ email: parsed.data.email, password, callbackUrl: safeCallback }, {
      onError: (error) => setErrors({ form: getClientErrorMessage(error, 'ورود انجام نشد. لطفاً اطلاعات ورود را بررسی کنید.') }),
    });
  };

  return { login, email, password, errors, setEmail, setPassword, submit };
}
