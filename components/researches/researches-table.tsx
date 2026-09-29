import { IResearch, IResearchList } from 'types/research';
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
import { ResearchRow } from './research-row';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IProps {
  deleteAction: (id: string) => void;
  offset: number;
  researches: IResearchList[];
  researchesPerPage: number;
  total: number;
}

export function ResearchesTable({
  researches,
  offset,
  total,
  deleteAction,
  researchesPerPage
}: IProps) {
  let router = useRouter();

  function prevPage() {
    const previousOffset =
      offset - researchesPerPage < researchesPerPage
        ? researchesPerPage
        : offset - researchesPerPage;

    router.push(`/dashboard?offset=${previousOffset}`, {
      scroll: false
    });
  }

  function nextPage() {
    const newOffset =
      offset + researchesPerPage > total ? total : offset + researchesPerPage;

    router.push(`/dashboard?offset=${newOffset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ambientes de Pesquisa</CardTitle>

        <CardDescription>
          Gerencie suas pesquisas e colaborações.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>

              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Descrição</TableHead>
              <TableHead className="hidden md:table-cell">Pessoas</TableHead>
              <TableHead className="hidden md:table-cell">Criado em</TableHead>

              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {researches.length === 0 ? (
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
              researches.map((r: IResearchList) => (
                <ResearchRow
                  deleteAction={deleteAction}
                  key={r.researchId}
                  research={r}
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
              {Math.max(0, Math.min(offset - researchesPerPage, total) + 1)}-
              {Math.min(offset, total)}
            </strong>{' '}
            de
            <strong>{' ' + total}</strong> ambientes de pesquisa
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={prevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === researchesPerPage}
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
