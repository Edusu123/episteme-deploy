'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { IReference, IReferenceList } from 'types/reference';
import { Reference } from './reference';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const referencesPerPage = 5;

interface IProps {
  references: IReferenceList[];
  offset: number;
  totalReferences: number;
  deleteAction: (id: string) => void;
}

export function ReferencesTable({
  references,
  offset,
  totalReferences,
  deleteAction
}: IProps) {
  let router = useRouter();

  function prevPage() {
    router.push(
      `/references/?offset=${offset - referencesPerPage < referencesPerPage ? referencesPerPage : offset - referencesPerPage}`,
      {
        scroll: false
      }
    );
  }

  function nextPage() {
    router.push(
      `/references/?offset=${offset + referencesPerPage > totalReferences ? totalReferences : offset + referencesPerPage}`,
      { scroll: false }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referências e Bibliografia</CardTitle>
        <CardDescription>
          Gerencie suas referências e bibliografia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autoria</TableHead>
              <TableHead className="hidden md:table-cell">Criado em</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {references.length === 0 ? (
              <TableRow>
                <td
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-lg font-medium">
                      Nenhum dado encontrado
                    </div>
                    <div className="text-sm">
                      Não há pessoas para exibir no momento.
                    </div>
                  </div>
                </td>
              </TableRow>
            ) : (
              references.map((r: IReferenceList) => (
                <Reference
                  deleteAction={deleteAction}
                  key={r.id}
                  reference={r}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <div className="text-xs text-muted-foreground">
          <div className="text-xs text-muted-foreground">
            Exibindo{' '}
            <strong>
              {Math.max(
                0,
                Math.min(offset - referencesPerPage, totalReferences) + 1
              )}
              -{offset}
            </strong>{' '}
            de
            <strong>{' ' + totalReferences}</strong> referências
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={prevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === referencesPerPage}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            onClick={nextPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset >= totalReferences}
          >
            Próxima
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
