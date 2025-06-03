'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { IResearch } from 'types/research';
import { TableCell, TableRow } from '../ui/table';
import { IUser } from 'types/user';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ActionButton } from '../ui/custom/action-button';

interface IProps {
  research: IResearch;
  deleteAction: (id: string) => void;
}

export function ResearchRow({ research, deleteAction }: IProps) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Research image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={research.imageUrl}
          loader={() => research.imageUrl}
          width="64"
        />
      </TableCell>

      <TableCell className="font-medium">{research.title}</TableCell>

      <TableCell>
        <Badge variant="outline" className="capitalize">
          {research.status ? 'ativo' : 'arquivado'}
        </Badge>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="flex -space-x-2 rtl:space-x-reverse">
          {research.usersList.map((u: IUser) => {
            return (
              <div className="hover:text-foreground" key={u.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      loader={() => u.profilePic}
                      className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                      src={u.profilePic}
                      alt=""
                      width="64"
                      height="64"
                    />
                  </TooltipTrigger>

                  <TooltipContent side="left">{u.name}</TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        {research.createdAt.toLocaleDateString('pt-br')}
      </TableCell>

      <TableCell>
        <ActionButton
          itemId={research.researchId ?? ''}
          accessLink={`/dashboard/research-environment/${research.researchId}`}
          deleteAction={deleteAction}
        />
      </TableCell>
    </TableRow>
  );
}
