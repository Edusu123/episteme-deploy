'use client';

import Link from 'next/link';
import {
  Bell,
  BookCopy,
  BookText,
  Calendar,
  CheckCheck,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PiggyBank,
  ShoppingCart,
  Users2
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Analytics } from '@vercel/analytics/react';
import { User } from './dashboard/user';
import { SearchInput } from './dashboard/search';
import ThemeSwitch from '@/components/ui/theme-switch';
import DesktopNav from '@/components/ui/nav-bar';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import api from 'services/base/api';
import { useTheme } from 'next-themes';
import { CardTitle } from '@/components/ui/card';

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      api.defaults.headers.Authorization = `Bearer ${session.data?.user.accessToken}`;
    }
  }, [session]);

  return (
    <main className="flex min-h-screen w-full flex-col bg-muted/40">
      <DesktopNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-end">
          <MobileNav />
          <DashboardBreadcrumb />
          <SearchInput />
          <User />
          <ThemeSwitch />
        </header>
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
          {children}
        </main>
      </div>
      <Analytics />
    </main>
  );
}

function MobileNav() {
  const { resolvedTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <SheetTitle>
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
            >
              <img
                className="mx-auto h-max w-auto"
                src={
                  resolvedTheme === 'dark'
                    ? '/episteme-dark-no-text-high-resolution-logo.webp'
                    : '/episteme-no-text-high-resolution-logo.webp'
                }
                alt="Your Company"
              />
              <span className="sr-only">Episteme</span>
            </Link>
          </SheetTitle>

          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Pessoas
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <BookCopy className="h-5 w-5" />
            Bibliografia e Referências
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Calendar className="h-5 w-5" />
            Calendário
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <CheckCheck className="h-5 w-5" />
            Atividade
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            Notificações
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <CardTitle className="text-mainblue text-xl dark:text-mainbeige">
        Episteme
      </CardTitle>
      {/* <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Tarefas</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Todas as Referências</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList> */}
    </Breadcrumb>
  );
}
