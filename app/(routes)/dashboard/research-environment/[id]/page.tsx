'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import { KanbanBoard } from './components/kanban-board';
import { DocumentsTab } from './components/documents-tab';
import { useResearchEnvironment } from 'hooks/useResearchEnvironment';
import { use, useState } from 'react';
import { IFileList } from 'types/file';
import { ResearchMembersTab } from './components/research-members-tab';

export default function ResearchEnvironment({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: researchEnvironment,
    isLoading,
    error
  } = useResearchEnvironment({ researchId: id });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading research environment</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {researchEnvironment?.data.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Detalhes do ambiente de pesquisa
          </p>
        </div>
        {/* <Badge variant="outline" className="capitalize">
          {researchEnvironment?.data.status}
        </Badge> */}
      </div>

      <Tabs defaultValue="documents">
        <div className="flex items-center justify-between mt-2">
          <TabsList>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="kanban">Tarefas</TabsTrigger>
            <TabsTrigger value="calendar">Cronograma</TabsTrigger>
            <TabsTrigger value="people">Pessoas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="documents">
          <DocumentsTab researchId={id} />
        </TabsContent>

        <TabsContent value="kanban">
          {/* TODO: Support multiple boards */}
          <KanbanBoard
            researchId={id}
            researchData={researchEnvironment?.data?.research}
          />
        </TabsContent>

        <TabsContent value="calendar">
          {/* TODO: Fetch tasks and events */}
          {/* <CalendarTab tasks={mockTasks} /> */}
        </TabsContent>

        <TabsContent value="people">
          <ResearchMembersTab researchId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
