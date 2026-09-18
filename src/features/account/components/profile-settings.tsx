// src/features/account/components/profile-settings.tsx
'use client';

import { KeyRound, UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { MIN_PASSWORD_LENGTH } from '@/constants/constants';
import { useProfileSettings } from '../hooks/use-profile-settings';

export function ProfileSettings() {
  const settings = useProfileSettings();
  const { session, profile, password, name, currentPassword, newPassword, passwordErrors, setPasswordErrors, setName, setCurrentPassword, setNewPassword, saveProfile, changePassword, canSaveProfile, canChangePassword } = settings;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="bg-nova-ink grid size-11 place-items-center rounded-2xl text-white"><UserRound size={20} /></div>
            <div><h2 className="text-lg font-black">اطلاعات شخصی</h2><p className="text-nova-muted text-xs">اطلاعات پایه حساب کاربری</p></div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">نام کامل<Input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="grid gap-2 text-sm font-semibold">ایمیل<Input value={session?.user.email ?? ''} disabled /></label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button disabled={profile.isPending || !canSaveProfile} onClick={saveProfile}>{profile.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</Button>
            <span className="text-nova-muted text-xs">ایمیل از طریق حساب احراز هویت مدیریت می‌شود.</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="bg-nova-hover text-nova-primary grid size-11 place-items-center rounded-2xl"><KeyRound size={20} /></div>
            <div><h2 className="text-lg font-black">امنیت حساب</h2><p className="text-nova-muted text-xs">تغییر رمز عبور حساب</p></div>
          </div>
          <div className="mt-5 space-y-4">
            <label className="grid gap-2 text-sm font-semibold">
              رمز فعلی
              <PasswordInput value={currentPassword} aria-invalid={!!passwordErrors.currentPassword} onBlur={() => { if (!currentPassword) setPasswordErrors((current) => ({ ...current, currentPassword: 'رمز فعلی را وارد کنید.' })); }} onChange={(event) => { setCurrentPassword(event.target.value); setPasswordErrors((current) => ({ ...current, currentPassword: '' })); }} />
              <span className="text-nova-danger min-h-5 text-xs font-medium">{passwordErrors.currentPassword ?? ''}</span>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              رمز جدید
              <PasswordInput value={newPassword} aria-invalid={!!passwordErrors.newPassword} onBlur={() => { if (newPassword.length < MIN_PASSWORD_LENGTH) setPasswordErrors((current) => ({ ...current, newPassword: `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد.` })); else if (currentPassword === newPassword) setPasswordErrors((current) => ({ ...current, newPassword: 'رمز جدید باید با رمز فعلی متفاوت باشد.' })); }} onChange={(event) => { setNewPassword(event.target.value); setPasswordErrors((current) => ({ ...current, newPassword: '' })); }} />
              <span className="text-nova-danger min-h-5 text-xs font-medium">{passwordErrors.newPassword ?? ''}</span>
            </label>
            <Button disabled={password.isPending || !canChangePassword} onClick={changePassword}>{password.isPending ? 'در حال تغییر...' : 'تغییر رمز عبور'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
