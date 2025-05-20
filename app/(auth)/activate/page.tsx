'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { activateAccount } from 'services/auth';
import { useEffect } from 'react';
import { AxiosResponse } from 'axios';

export default function page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activate = async () => {
    const activationToken = searchParams.get('activationToken');

    if (activationToken) {
      activateAccount(activationToken).then((r: AxiosResponse) => {
        if (r.status == 200) {
          router.push('/login?activationSuccess');
        } else {
          router.push('/login?activationFail');
        }
      });
    }
  };

  useEffect(() => {
    activate();
  }, []);

  return <div></div>;
}
