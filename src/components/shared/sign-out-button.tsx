'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <LogOut size={16} aria-hidden="true" />
      خروج از حساب
    </Button>
  );
}
