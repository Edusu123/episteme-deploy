'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResearchTable } from './research-table';
import { redirect, useSearchParams } from 'next/navigation';
import RedirectButton from '@/components/ui/custom/redirect-button';
import {
  newOffset,
  totalResearchEnvironments,
  researchEnvironments
} from 'app/api/seed/mocks';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('showResearchCreationSuccess'))
      toast.success('Novo ambiente criado com sucesso!');
  }, []);

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
          {/* <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button> */}
          <RedirectButton route={'/dashboard/register-research-environment'}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Novo Ambiente de Pesquisa
            </span>
          </RedirectButton>
        </div>
      </div>
      <TabsContent value="all">
        <ResearchTable
          researchEnvironments={researchEnvironments}
          offset={newOffset ?? 0}
          totalResearchEnvironments={totalResearchEnvironments}
        />
      </TabsContent>
    </Tabs>
  );
}
