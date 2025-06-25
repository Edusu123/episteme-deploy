'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import RedirectButton from '@/components/ui/custom/redirect-button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getResearches } from 'services/research';
import { IResearch, IResearchList } from 'types/research';
import { AxiosResponse } from 'axios';
import { useSession } from 'next-auth/react';
import { ResearchesTable } from '@/components/researches/researches-table';
import { researchEnvironments } from 'app/api/seed/mocks';
import api from 'services/base/api';
import { IUserInfo } from 'types/user';

const researchesPerPage = 5;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const session = useSession();

  const offset = Number(searchParams.get('offset') ?? researchesPerPage);

  const [researches, setResearches] = useState<IResearchList[]>([]);
  const [filteredResearches, setFilteredResearches] = useState<IResearchList[]>(
    []
  );

  const getAllResearches = async () => {
    getResearches().then((r: AxiosResponse) => {
      const list = r.data.researches.map(
        (item: any): IResearchList => ({
          researchId: item.researchId,
          imageUrl: item.fileUrl,
          title: item.researchTitle,
          status: true,
          description: item.researchDescription,
          usersList:
            item.users.map(
              (user: any): IUserInfo => ({
                id: user.userId,
                name: user.name,
                profilePic: user.fileUrl
              })
            ) ?? [],
          createdAt: new Date(item.createdAt)
        })
      );

      setResearches(list);
      setFilteredResearches(list);
    });
  };

  useEffect(() => {
    if (api.defaults.headers.Authorization) getAllResearches();
  }, [session]);

  useEffect(() => {
    if (searchParams.get('showResearchCreationSuccess'))
      toast.success('Novo ambiente criado com sucesso!');

    if (searchParams.get('invitationAcceptanceSuccess'))
      toast.success('Convite aceito com sucesso!');
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';

    setFilteredResearches(
      researches.filter(
        (item: IResearchList) => q == '' || item.title?.includes(q)
      )
    );
  }, [searchParams]);

  return (
    <div>
      <div className="flex items-center mt-2">
        <div className="ml-auto flex items-center gap-2 mb-3">
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
      <ResearchesTable
        deleteAction={(id: string) => {}}
        offset={offset}
        researches={filteredResearches.slice(
          offset - researchesPerPage,
          offset
        )}
        researchesPerPage={researchesPerPage}
        total={researches.length}
      />
    </div>
  );
}
