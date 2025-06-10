'use client';

import { DocumentsTable } from '@/components/documents/documents-table';
import UsersList from '@/components/ui/custom/users-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDocs } from 'app/api/seed/documents-mock';
import { researchEnvironments } from 'app/api/seed/mocks';
import { useSearchParams } from 'next/navigation';

const documentsPerPage = 5;

export default function page() {
  const searchParams = useSearchParams();

  const offset = Number(searchParams.get('offset') ?? documentsPerPage);

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
        </div>
      </div>
      <TabsContent value="all">
        <DocumentsTable
          documents={mockDocs.slice(offset - documentsPerPage, offset)}
          offset={offset}
          total={mockDocs.length}
          perPage={documentsPerPage}
        />

        <div className="grid grid-cols-3 justify-items-center mt-5">
          {researchEnvironments.map((env: any) => (
            <a
              className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              href="#"
              key={env.researchId}
            >
              <img
                className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                src={env.imageUrl}
                alt=""
              />
              <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {env.title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {env.description}
                </p>
                <UsersList
                  usersList={env.usersList.map((p: any) => ({
                    name: p.name,
                    profilePic: p.profilePic
                  }))}
                />
              </div>
            </a>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
