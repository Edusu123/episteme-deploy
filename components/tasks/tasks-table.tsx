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
    const previousOffset = Math.max(0, offset - perPage);
    router.push(`/tasks?offset=${previousOffset}`, {
      scroll: false
    });
  }

  function nextPage() {
    const newOffset = Math.min(total, offset + perPage);
    router.push(`/tasks?offset=${newOffset}`, { scroll: false });
  }

  // Calculate the correct display range
  const startItem = offset + 1;
  const endItem = Math.min(offset + tasks.length, total);

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
              {startItem}-{endItem}
            </strong>{' '}
            de
            <strong>{' ' + total}</strong> atividades
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={prevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            onClick={nextPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset + perPage >= total}
          >
            Próxima
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
