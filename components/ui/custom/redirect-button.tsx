'use client';

import React from 'react';
import { Button } from '../button';
import { redirect } from 'next/navigation';

export default function RedirectButton({
  children,
  route
}: {
  children: React.ReactNode;
  route: string;
}) {
  return (
    <Button
      size="sm"
      className="h-8 gap-1"
      onClick={() => {
        redirect(route);
      }}
    >
      {children}
    </Button>
  );
}
