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
import { useCallback, useEffect, useState } from 'react';
import { Route } from 'next';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProfileModal } from 'hooks/modal';
import ProfileEdit from '@/components/modal/profile-edit';
import api from 'services/base/api';
import { me } from 'services/user';
import { AxiosResponse } from 'axios';

export function User() {
  const router = useRouter();
  const settingsModal = useProfileModal();

  const { data: session } = useSession();
  const user = session?.user;

  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileImageURL, setProfileImageURL] = useState<string>('');

  const logout = useCallback(() => {
    const accessToken = session?.user?.accessToken || undefined;

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({ accessToken })
    })
      .then((res) => res.json())
      .then((data) => {})
      .catch((error) => {})
      .finally(async () => {
        signOut({ redirect: false }).then(() => {
          router.push(`${window.location.origin}/login` as Route<string>);
        });
      });
  }, [router, session]);

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') logout();
  }, [session, logout]);

  useEffect(() => {
    if (api.defaults.headers.Authorization) {
      me().then((r: AxiosResponse) => {
        setId(r.data.id);
        setName(r.data.name);
        setEmail(r.data.email);
        setProfileImageURL(r.data.fileUrl);
        settingsModal.setModal(false, r.data.fileUrl);
      });
    }
  }, [api.defaults.headers.Authorization]);

  const callback = async () => {
    if (api.defaults.headers.Authorization)
      me().then((r: AxiosResponse) => {
        setProfileImageURL(r.data.fileUrl);
        settingsModal.setModal(false, r.data.fileUrl);
      });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            {profileImageURL == '' ? (
              <></>
            ) : (
              <img
                key={profileImageURL}
                src={`${profileImageURL}?${Date.now()}`}
                width="36"
                height="36"
                alt="Avatar"
                className="overflow-hidden rounded-full"
                style={{ width: 'auto', height: 'auto' }}
                // unoptimized={true}
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => settingsModal.setModal(true, profileImageURL ?? '')}
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

      <Dialog
        open={settingsModal.isOpen}
        onOpenChange={(open: boolean) => {
          settingsModal.setModal(open, profileImageURL ?? '');
        }}
      >
        <ProfileEdit
          id={id}
          name={name}
          email={email}
          callbackAction={callback}
        />
      </Dialog>
    </div>
  );
}
