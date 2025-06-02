'use client';

import { MoreHorizontal, SquareArrowOutUpRight } from 'lucide-react';
import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../dropdown-menu';
import Link from 'next/link';

interface IProps {
  itemId: string;
  accessLink: string;
  deleteAction: (id: string) => void;
}

export function ActionButton({ itemId, accessLink, deleteAction }: IProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link
            className="cursor-pointer flex flex-row justify-between"
            href={accessLink}
          >
            Acessar
            <SquareArrowOutUpRight size={15} />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => deleteAction(itemId)} type="submit">
            Arquivar
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
