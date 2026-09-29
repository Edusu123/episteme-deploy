'use client';

import Image from 'next/image';
import { IDocument } from 'types/document';
import { TableCell, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface IProps {
  document: IDocument;
}

export function DocumentRow({ document }: IProps) {
  const session = useSession();

  return (
    <TableRow>
      <TableCell className="font-medium">{document.name}</TableCell>

      <TableCell>
        <Badge className="capitalize" variant="secondary">
          <div className="flex flex-row items-center justify-between hover:text-foreground">
            <Image
              loader={() => document.owner.profilePic ?? ''}
              className="w-9 h-9 border-2 border-white object-contain rounded-full dark:border-gray-800"
              src={document.owner.profilePic ?? ''}
              alt=""
              width="64"
              height="64"
              unoptimized={true}
            />

            <span className="mx-2 text-base">
              {document.owner.id == session.data?.user.id
                ? 'você'
                : document.owner.name}
            </span>
          </div>
        </Badge>
      </TableCell>

      <TableCell>{document.uploadDate.toLocaleDateString('pt-BR')}</TableCell>

      <TableCell className="text-right">
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
