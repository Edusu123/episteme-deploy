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
import { TasksRow } from './tasks-row';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ITasks } from 'types/task';

interface IProps {
  tasks: ITasks[];
  offset: number;
  total: number;
  perPage: number;
  refetch: () => void;
}

export function TasksTable({ tasks, offset, total, perPage, refetch }: IProps) {
  let router = useRouter();

  function prevPage() {
    const previousOffset =
      offset - perPage < perPage ? perPage : offset - perPage;

    router.push(`/tasks?offset=${previousOffset}`, {
      scroll: false
    });
  }

  function nextPage() {
    const newOffset = offset + perPage > total ? total : offset + perPage;

    router.push(`/tasks?offset=${newOffset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarefas</CardTitle>
        <CardDescription>Gerencie suas tarefas.</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Pesquisa</TableHead>
              <TableHead>Data limite</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((t: ITasks) => (
              <TasksRow task={t} key={t.taskId} refetch={refetch} />
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
