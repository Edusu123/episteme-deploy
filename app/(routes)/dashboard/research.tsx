import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, SquareArrowOutUpRight } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectProduct } from '@/lib/db';
import { deleteProduct } from './actions';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export function Product({ researchEnvironment }: { researchEnvironment: any }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={researchEnvironment.imageUrl}
          loader={() => researchEnvironment.imageUrl}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{researchEnvironment.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {researchEnvironment.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {researchEnvironment.description}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex -space-x-2 rtl:space-x-reverse">
          {researchEnvironment.people.map((x: any) => {
            return (
              <div className="hover:text-foreground" key={x.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      loader={() => x.profilePic}
                      className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                      src={x.profilePic}
                      alt=""
                      width="64"
                      height="64"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left">{x.name}</TooltipContent>
                </Tooltip>
                {/* <span className="sr-only">{x.name}</span> */}
              </div>
            );
          })}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {researchEnvironment.availableAt.toLocaleDateString('pt-br')}
      </TableCell>
      <TableCell>
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
                href={`/dashboard/research-environment/${researchEnvironment.id}`}
              >
                Acessar
                <SquareArrowOutUpRight size={15} />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteProduct}>
                <button type="submit">Arquivar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
