// src/features/account/hooks/use-profile-settings.ts
'use client';

import { MIN_PASSWORD_LENGTH } from '@/constants/constants';
import { getClientErrorMessage } from '@/lib/client-error';
import { zodFieldErrors, type FieldErrors } from '@/lib/form-errors';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { passwordSchema } from '../validation/auth.schema';
import { useProfileMutations } from './use-profile-mutations';

const MIN_NAME_LENGTH = 2;

export function useProfileSettings() {
  const { data: session, update: updateSession } = useSession();
  const { profile, password } = useProfileMutations();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});

  const serverName = session?.user.name ?? '';
  const [name, setName] = useState(serverName);
  const [lastServerName, setLastServerName] = useState(serverName);
  if (serverName !== lastServerName) {
    setLastServerName(serverName);
    setName(serverName);
  }

  const saveProfile = () =>
    profile.mutate(
      { name: name.trim() },
      { onSuccess: () => void updateSession() },
    );

  const validatePassword = () => {
    const next: FieldErrors = {};
    if (!currentPassword) next.currentPassword = 'رمز فعلی را وارد کنید.';
    const parsed = passwordSchema.safeParse(newPassword);
    if (!parsed.success) {
      next.newPassword =
        zodFieldErrors(parsed.error)[''] ??
        parsed.error.issues[0]?.message ??
        'رمز جدید نامعتبر است.';
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      next.newPassword = 'رمز جدید باید با رمز فعلی متفاوت باشد.';
    }
    setPasswordErrors(next);
    return Object.keys(next).length === 0;
  };

  const changePassword = () => {
    if (!validatePassword()) return;
    password.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: async () => {
          setCurrentPassword('');
          setNewPassword('');
          setPasswordErrors({});
          await signOut({ callbackUrl: '/login' });
        },
        onError: (error) => {
          setPasswordErrors({
            currentPassword: getClientErrorMessage(
              error,
              'رمز فعلی صحیح نیست.',
            ),
          });
        },
      },
    );
  };

  return {
    session,
    profile,
    password,
    name,
    currentPassword,
    newPassword,
    passwordErrors,
    setPasswordErrors,
    setName,
    setCurrentPassword,
    setNewPassword,
    saveProfile,
    changePassword,
    canSaveProfile: name.trim().length >= MIN_NAME_LENGTH,
    canChangePassword:
      Boolean(currentPassword) && newPassword.length >= MIN_PASSWORD_LENGTH,
  };
}
