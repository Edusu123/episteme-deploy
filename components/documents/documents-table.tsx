'use client';

import { IDocument } from 'types/document';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { DocumentRow } from './document-row';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface IProps {
  documents: IDocument[];
  offset: number;
  total: number;
  perPage: number;
}

export function DocumentsTable({ documents, offset, total, perPage }: IProps) {
  let router = useRouter();

  function prevPage() {
    const previousOffset =
      offset - perPage < perPage ? perPage : offset - perPage;

    router.push(`/documents?offset=${previousOffset}`, {
      scroll: false
    });
  }

  function nextPage() {
    const newOffset = offset + perPage > total ? total : offset + perPage;

    router.push(`/documents?offset=${newOffset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>Gerencie seus arquivos e documentos.</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Documento</TableHead>
              <TableHead>Enviado por</TableHead>
              <TableHead>Data de Upload</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {documents.map((d: IDocument) => (
              <DocumentRow document={d} key={d.id} />
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex flex-row justify-between">
        <div className="text-xs text-muted-foreground">
          <div className="text-xs text-muted-foreground">
            Exibindo{' '}
            <strong>
              {Math.max(0, Math.min(offset - perPage, total) + 1)}-
              {Math.min(offset, total)}
            </strong>{' '}
            de
            <strong>{' ' + total}</strong> documentos
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={prevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === perPage}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            onClick={nextPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset >= total}
          >
            Próxima
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
