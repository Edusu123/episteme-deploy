import { MoreHorizontal, SquareArrowOutUpRight } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import Link from 'next/link';

interface IProps {
  personId: string;
  researchId: string;
  isOwner: boolean;
  accessLink: string;
  deleteResearchPerson: (personId: string, researchId: string) => void;
}

export function PersonActionButton({
  personId,
  researchId,
  isOwner,
  accessLink,
  deleteResearchPerson
}: IProps) {
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

        <DropdownMenuItem>
          <Button disabled={!isOwner} variant="destructive">
            Remover Usuário
          </Button>
          {/* <button
            className="text-red"
            
            onClick={() => deleteResearchPerson(personId, researchId)}
            type="submit"
          >
            Arquivar
          </button> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
