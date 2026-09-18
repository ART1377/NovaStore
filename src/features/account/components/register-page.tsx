// src/features/account/components/register-page.tsx
'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { useRegisterForm } from '../hooks/use-register-form';

export function RegisterPage() {
  const { register, form, errors, updateField, submit } = useRegisterForm();
  return (
    <main className="mx-auto flex min-h-[72vh] max-w-md items-center px-4">
      <Card className="w-full"><CardContent className="p-7">
        <h1 className="text-3xl font-black">ساخت حساب</h1>
        <p className="text-nova-primary mt-2 text-sm">برای شروع مشخصات خود را وارد کنید.</p>
        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          <FormField label="نام و نام خانوادگی" required error={errors.name}><Input id="name" name="name" autoComplete="name" value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="نام و نام خانوادگی" aria-invalid={!!errors.name} /></FormField>
          <FormField label="ایمیل" required error={errors.email}><Input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="ایمیل" aria-invalid={!!errors.email} /></FormField>
          <FormField label="رمز عبور" required hint="حداقل ۸ کاراکتر" error={errors.password}><PasswordInput id="register-password" name="password" autoComplete="new-password" value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="رمز عبور" aria-invalid={!!errors.password} /></FormField>
          {errors.form ? <p role="alert" className="bg-nova-danger-soft text-nova-danger rounded-xl px-3 py-2 text-sm font-medium">{errors.form}</p> : null}
          <Button type="submit" className="w-full" disabled={register.isPending}>{register.isPending ? 'در حال ساخت حساب...' : 'ساخت حساب'}</Button>
        </form>
        <Link className="mt-5 block text-center text-sm underline underline-offset-4" href="/login">قبلاً حساب داری؟ ورود</Link>
      </CardContent></Card>
    </main>
  );
}
