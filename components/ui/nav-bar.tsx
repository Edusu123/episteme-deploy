'use client';

import { NavItem } from 'app/(routes)/dashboard/nav-item';
import Link from 'next/link';
import {
  Bell,
  BookCopy,
  BookText,
  Calendar,
  CheckCheck,
  Home,
  PiggyBank,
  Settings,
  Users2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';

export default function DesktopNav() {
  const { resolvedTheme } = useTheme();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 sm:py-5">
        <Link
          className="group flex shrink-0 items-center justify-center gap-2 font-semibold text-primary-foreground md:text-base"
          href="#"
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
        </Link>

        <NavItem href="/dashboard" label="Dashboard">
          <Home className="h-6 w-6" />
        </NavItem>

        <NavItem href="/documents" label="Documentos e Arquivos">
          <BookText className="h-5 w-5" />
        </NavItem>

        <NavItem href="/people" label="Pessoas">
          <Users2 className="h-5 w-5" />
        </NavItem>

        <NavItem href="/references" label="Bibliografia e Referências">
          <BookCopy className="h-5 w-5" />
        </NavItem>

        <NavItem href="/calendar" label="Calendário e Cronogramas">
          <Calendar className="h-5 w-5" />
        </NavItem>

        <NavItem href="/tasks" label="Atividades">
          <CheckCheck className="h-5 w-5" />
        </NavItem>

        <NavItem href="#" label="Financeiro">
          <PiggyBank className="h-5 w-5" />
        </NavItem>

        <NavItem href="#" label="Notificações">
          <Bell className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
