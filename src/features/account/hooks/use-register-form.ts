// src/features/account/hooks/use-register-form.ts
'use client';

import { getClientErrorMessage } from '@/lib/client-error';
import { zodFieldErrors, type FieldErrors } from '@/lib/form-errors';
import { useState, type FormEvent } from 'react';
import { registerSchema } from '../validation/auth.schema';
import { useRegisterAndLogin } from './use-auth';

type RegisterForm = { name: string; email: string; password: string };

export function useRegisterForm() {
  const register = useRegisterAndLogin();
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateField = <K extends keyof RegisterForm>(
    key: K,
    value: RegisterForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [String(key)]: '' }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    register.mutate(parsed.data, {
      onError: (error) =>
        setErrors({
          form: getClientErrorMessage(
            error,
            'ثبت‌نام انجام نشد. لطفاً اطلاعات واردشده را بررسی کنید.',
          ),
        }),
    });
  };

  return { register, form, errors, updateField, submit };
}
