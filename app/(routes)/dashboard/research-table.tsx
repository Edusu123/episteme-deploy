'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Product } from './research';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResearchTable({
  researchEnvironments,
  offset,
  totalResearchEnvironments
}: {
  researchEnvironments: any[];
  offset: number;
  totalResearchEnvironments: number;
}) {
  let router = useRouter();
  let researchEnvironmentsPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ambientes de pesquisa</CardTitle>
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
            {researchEnvironments.map((researchEnvironment) => (
              <Product
                key={researchEnvironment.researchId}
                researchEnvironment={researchEnvironment}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            {/* Exibindo{" "}
            <strong>
              {Math.max(0, Math.min(offset - researchEnvironmentsPerPage, totalResearchEnvironments) + 1)}-{offset}
            </strong>{" "}
            de <strong>{totalResearchEnvironments}</strong> products */}
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={true} //{offset === researchEnvironmentsPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={true} //{ offset + researchEnvironmentsPerPage > totalResearchEnvironments }
            >
              Próxima
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
