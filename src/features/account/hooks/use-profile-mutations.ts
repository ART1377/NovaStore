// src/features/account/hooks/use-profile-mutations.ts
'use client';

import { getClientErrorMessage } from '@/lib/client-error';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileService } from '../api/profile.api';

export function useProfileMutations() {
  const profile = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => toast.success('اطلاعات پروفایل ذخیره شد'),
    onError: (error) =>
      toast.error(
        getClientErrorMessage(error, 'ذخیره اطلاعات پروفایل انجام نشد.'),
      ),
  });

  const password = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => toast.success('رمز عبور تغییر کرد'),
    onError: (error) =>
      toast.error(getClientErrorMessage(error, 'تغییر رمز عبور انجام نشد.')),
  });

  return { profile, password };
}
