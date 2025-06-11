'use client';

import { AxiosResponse } from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { acceptInvitation } from 'services/research';

export default function page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();

  const accept = async () => {
    const token = searchParams.get('token');

    if (token) {
      acceptInvitation(token).then((r: AxiosResponse | null) => {
        if (r && r.status == 200) {
          router.push('/dashboard?invitationAcceptanceSuccess=true');
        } else {
          router.push('/dashboard?invitationAcceptanceFail=true');
        }
      });
    }
  };

  useEffect(() => {
    if (session.status == 'authenticated') accept();
  }, [session]);

  return <div></div>;
}
