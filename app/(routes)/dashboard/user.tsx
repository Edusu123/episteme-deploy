'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Route } from 'next';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProfileModal } from 'hooks/modal';
import { Pen } from 'lucide-react';
import { CustomInput } from '@/components/ui/custom/custom-input';
import ProfileEdit from '@/components/modal/profile-edit';

export function User() {
  const router = useRouter();
  const settingsModal = useProfileModal();

  const { data: session } = useSession();
  const user = session?.user;

  const logout = useCallback(() => {
    const accessToken = session?.user?.accessToken || undefined;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({ accessToken })
    })
      .then((res) => res.json())
      .then((data) => {
        // send log to the Sentry if the endpoint fails
        // if (!data.success)
        //     notifySentry("Could not log out!")
      })
      .catch((error) => {
        //send log to the Sentry if an error occurs notifySentry(error)
      })
      .finally(async () => {
        signOut({ redirect: false }).then(() => {
          router.push(`${window.location.origin}/login` as Route<string>);
        });
      });
  }, [router, session]);

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      // remember that error?
      // force the user to log out if the session has RefreshAccessTokenError
      logout();
    }
  }, [session, logout]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src={user?.image ?? 'https://i.ibb.co/twhxCjCs/images-1.jpg'}
              loader={() =>
                user?.image ?? 'https://i.ibb.co/twhxCjCs/images-1.jpg'
              }
              width="36"
              height="36"
              alt="Avatar"
              className="overflow-hidden rounded-full"
              style={{ width: 'auto', height: 'auto' }}
              unoptimized={true}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => settingsModal.setModal(true)}
          >
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>Suporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem>
              <form action={logout}>
                <button type="submit">Sair</button>
              </form>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Link href="/login">Sign In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={settingsModal.isOpen} onOpenChange={settingsModal.setModal}>
        <ProfileEdit />
      </Dialog>
    </div>
  );
}
