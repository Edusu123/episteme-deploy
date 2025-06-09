import { IUser } from 'types/user';
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
import { PersonRow } from './person-row';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IProps {
  people: IUser[];
  offset: number;
  total: number;
  peoplePerPage: number;
}

export function PeopleTable({ people, offset, total, peoplePerPage }: IProps) {
  let router = useRouter();

  function prevPage() {
    const previousOffset =
      offset - peoplePerPage < peoplePerPage
        ? peoplePerPage
        : offset - peoplePerPage;

    router.push(`/people?offset=${previousOffset}`, {
      scroll: false
    });
  }

  function nextPage() {
    const newOffset =
      offset + peoplePerPage > total ? total : offset + peoplePerPage;

    router.push(`/people?offset=${newOffset}`, { scroll: false });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pessoas</CardTitle>
        <CardDescription>Gerencie suas parcerias.</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>

              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Pesquisas</TableHead>
              <TableHead>Desde</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {people.map((p: IUser) => (
              <PersonRow key={p.id} person={p} />
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex flex-row justify-between">
        <div className="text-xs text-muted-foreground">
          <div className="text-xs text-muted-foreground">
            Exibindo{' '}
            <strong>
              {Math.max(0, Math.min(offset - peoplePerPage, total) + 1)}-
              {Math.min(offset, total)}
            </strong>{' '}
            de
            <strong>{' ' + total}</strong> pessoas
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={prevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === peoplePerPage}
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
