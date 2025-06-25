'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { KanbanColumn } from '../dashboard/research-environment/[id]/components/kanban-column';
import { KanbanItem } from '../dashboard/research-environment/[id]/components/kanban-item';
import { useEffect, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { researchEnvironments } from 'app/api/seed/mocks';
import UsersList from '@/components/ui/custom/users-list';
import { getSelfTasks } from 'services/user';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksTable } from '@/components/tasks/tasks-table';
import { ITasks } from 'types/task';

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

//TODO: Get tasks from API
//TODO: Add task editing
export default function page() {
  const {
    data: userTasks,
    error,
    refetch
  } = useQuery({
    queryKey: ['userTasks'],
    queryFn: getSelfTasks
  });

  console.log({ error, userTasks });

  const [formattedTasks, setFormattedTasks] = useState<ITasks[]>([]);
  const [researchEnvironments, setResearchEnvironments] = useState<
    Map<string, any>
  >(new Map());

  useEffect(() => {
    if (userTasks) {
      console.log({ userTasks });
      setFormattedTasks(
        userTasks.data.map((task: any) => ({
          taskId: task.taskId,
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          research: task.research
        }))
      );

      setResearchEnvironments(
        new Map(userTasks.data.map((env: any) => [env.researchId, env.research]))
      );
    }
  }, [userTasks]);

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
        <TasksTable
          tasks={formattedTasks}
          offset={0}
          total={formattedTasks?.length}
          perPage={10}
          refetch={refetch}
        />

        <div className="grid grid-cols-3 justify-items-center mt-5">
          {Array.from(researchEnvironments.values()).map((env: any, index: number) => {
            return (
              <a
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                href={`/dashboard/research-environment/${env?.researchId}`}
                key={index}
              >
                <img
                  className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                  src={env?.fileUrl ?? '/default-image.svg'}
                  alt=""
                />
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {env?.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {env?.description}
                  </p>
                  <UsersList
                    usersList={env?.users?.map((p: any) => ({
                      userId: p.userId,
                      name: p.name,
                      profilePic:
                        p?.fileUrl ?? 'https://ui.shadcn.com/placeholder.svg'
                    }))}
                  />
                </div>
              </a>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
