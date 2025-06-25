'use client';

import { AxiosError, AxiosResponse } from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { acceptInvitation } from 'services/research';
import { toast } from 'sonner';

export default function page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();

  const accept = async () => {
    const token = searchParams.get('token');

    if (token) {
      acceptInvitation(token)
        .then((r: AxiosResponse | null) => {
          if (r && r.status == 200) {
            router.push('/dashboard?invitationAcceptanceSuccess=true');
          } else {
            router.push('/dashboard?invitationAcceptanceFail=true');
          }
        })
        .catch((error) => {
          console.error(error);
          if (
            error instanceof AxiosError &&
            error.status &&
            error.status >= 400 &&
            error.status < 500 &&
            error.status !== 401
          ) {
            const data = error.response?.data as { message: string };
            toast.error(data.message || 'Erro ao aceitar convite');
          }
        });
    }
  };

  useEffect(() => {
    if (session.status == 'authenticated') accept();
  }, [session]);

  return <div></div>;
}
