import { NextAuthProvider } from '@/components/providers/NextAuthProvider';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { NextThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';

export const metadata = {
  title: 'episteme'
  // description:
  //   'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/episteme-no-text-high-resolution-logo.ico"
          sizes="any"
        />
      </head>
      <body className="flex min-h-screen w-full flex-col">
        <ReactQueryProvider>
          <NextAuthProvider>
            <NextThemeProvider>
              <ToastProvider>
                <TooltipProvider>{children}</TooltipProvider>
              </ToastProvider>
            </NextThemeProvider>
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
      <Analytics />
    </html>
  );
}
