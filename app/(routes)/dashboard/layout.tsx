'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

interface IProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: IProps) {
  const searchParams = useSearchParams()!;

  useEffect(() => {
    if (searchParams.get('showResearchCreationSuccess'))
      toast.success('Novo ambiente criado com sucesso!');
  }, []);

  return <div>{children}</div>;
}
