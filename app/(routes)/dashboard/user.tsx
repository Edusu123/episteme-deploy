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
import { useCallback, useEffect } from 'react';
import { Route } from 'next';

export function User() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={
              user?.image ??
              'https://assets.brasildefato.com.br/2024/09/image_processing20220512-20730-jb29gt.jpeg'
            }
            loader={() =>
              user?.image ??
              'https://assets.brasildefato.com.br/2024/09/image_processing20220512-20730-jb29gt.jpeg'
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
        <DropdownMenuItem>Configurações</DropdownMenuItem>
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
  );
}
