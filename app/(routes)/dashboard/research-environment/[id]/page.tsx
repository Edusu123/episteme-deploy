import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import { researchEnvironments } from 'app/api/seed/mocks';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { KanbanBoard } from './components/kanban-board';
import { DocumentsTab } from './components/documents-tab';
import { CalendarTab } from './components/calendar-tab';

// Mock tasks data
const mockTasks = {
  todo: [
    {
      id: 1,
      title: 'Revisar metodologia',
      description: 'Revisar e validar a metodologia da pesquisa',
      assignee: 'João Silva',
      dueDate: '2025-05-23'
    },
    {
      id: 2,
      title: 'Coletar dados',
      description: 'Iniciar coleta de dados para análise',
      assignee: 'Maria Santos',
      dueDate: '2025-05-24'
    }
  ],
  inProgress: [
    {
      id: 3,
      title: 'Análise preliminar',
      description: 'Realizar análise preliminar dos dados coletados',
      assignee: 'Pedro Oliveira',
      dueDate: '2025-05-25'
    }
  ],
  done: [
    {
      id: 4,
      title: 'Definir objetivos',
      description: 'Definir objetivos e metas da pesquisa',
      assignee: 'João Silva',
      dueDate: '2025-05-26'
    }
  ]
};

async function getResearchEnvironment(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // For now, return mock data regardless of ID
  return researchEnvironments.find(
    (researchEnvironment) => researchEnvironment.id === Number(id)
  );
}

export default async function ResearchEnvironment({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const researchEnvironment = await getResearchEnvironment(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{researchEnvironment?.name}</h1>
          <p className="text-sm text-muted-foreground">
            Detalhes do ambiente de pesquisa
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {researchEnvironment?.status}
        </Badge>
      </div>

      <Tabs defaultValue="documents">
        <div className="flex items-center justify-between mt-2">
          <TabsList>
            <TabsTrigger value="documents">
              Documentos e bibliografias
            </TabsTrigger>
            <TabsTrigger value="kanban">Tarefas</TabsTrigger>
            <TabsTrigger value="calendar">Cronograma</TabsTrigger>
            <TabsTrigger value="people">Pessoas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="documents">
          <DocumentsTab />
        </TabsContent>

        <TabsContent value="kanban">
          <KanbanBoard initialTasks={mockTasks} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab tasks={mockTasks} />
        </TabsContent>

        <TabsContent value="people">
          <Card>
            <CardHeader>
              <CardTitle>Pessoas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da seção de Pessoas</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
