'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RedirectButton from '@/components/ui/custom/redirect-button';
import { PlusCircle } from 'lucide-react';
import { ReferencesTable } from '@/components/references/references-table';
import { references } from 'app/api/seed/mocks';
import { useSearchParams } from 'next/navigation';

const referencesPerPage = 5;

export default function page() {
  const searchParams = useSearchParams();
  const offset = Number(searchParams.get('offset') ?? 5);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center mt-2">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Arquivados
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-2">
          <RedirectButton route={'/references/register-reference'}>
            <PlusCircle className="h-3.5 w-3.5" />

            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Nova Referência
            </span>
          </RedirectButton>
        </div>
      </div>

      <TabsContent value="all">
        <ReferencesTable
          references={references.slice(offset - referencesPerPage, offset)}
          offset={offset}
          totalReferences={references.length}
          deleteAction={(id: string) => {}}
        />
      </TabsContent>
    </Tabs>
  );
}
