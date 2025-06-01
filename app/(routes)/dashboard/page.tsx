'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { ResearchTable } from './research-table';
import { useSearchParams } from 'next/navigation';
import RedirectButton from '@/components/ui/custom/redirect-button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getResearches } from 'services/research';
import { IResearch } from 'types/research';
import { AxiosResponse } from 'axios';
import { useSession } from 'next-auth/react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const session = useSession();

  const [researches, setResearches] = useState<IResearch[]>([]);

  const getAllResearches = async () => {
    getResearches().then((r: AxiosResponse | null) => {
      if (r) setResearches(r.data.researches);
    });
  };

  useEffect(() => {
    getAllResearches();

    if (searchParams.get('showResearchCreationSuccess'))
      toast.success('Novo ambiente criado com sucesso!');
  }, [, session]);

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
          researchEnvironments={researches}
          offset={0}
          totalResearchEnvironments={researches.length}
        />
      </TabsContent>
    </Tabs>
  );
}
