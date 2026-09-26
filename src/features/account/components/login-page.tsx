// src/features/account/components/login-page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { useLoginForm } from '../hooks/use-login-form';

export function LoginPage() {
  const { login, email, password, errors, setEmail, setPassword, submit } =
    useLoginForm();
  return (
    <main className="mx-auto flex min-h-[72vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardContent className="p-7">
          <h1 className="text-3xl font-black">ورود به حساب</h1>
          <p className="text-nova-primary mt-2 text-sm">
            برای ادامه خرید و مشاهده سفارش‌ها وارد شوید.
          </p>
          <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
            <FormField label="ایمیل" required error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ایمیل"
                aria-invalid={!!errors.email}
              />
            </FormField>
            <FormField label="رمز عبور" required error={errors.password}>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="رمز عبور"
                aria-invalid={!!errors.password}
              />
            </FormField>
            {errors.form ? (
              <p
                role="alert"
                className="bg-nova-danger-soft text-nova-danger rounded-xl px-3 py-2 text-sm font-medium"
              >
                {errors.form}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? 'در حال ورود...' : 'ورود'}
            </Button>
          </form>
          <Link
            className="mt-5 block text-center text-sm underline underline-offset-4"
            href="/register"
          >
            ساخت حساب جدید
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
