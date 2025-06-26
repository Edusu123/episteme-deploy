'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { KanbanItem } from './kanban-item';
import type { Task } from './kanban-board';
import { KanbanColumn as KanbanColumnType } from 'types/Kanban';
import { useState } from 'react';
import TaskEditKanban from '@/components/modal/task-edit-kanban';
import { updateResearchTask } from 'services/research';
import { toast } from 'sonner';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  users?: Array<{
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  }>;
  columns?: KanbanColumnType[];
  refetch: () => void;
  researchId: string;
  boardId: string;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  users = [],
  columns = [],
  refetch,
  researchId,
  boardId
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      columnId: id
    }
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = async (data: any) => {
    try {
      await updateResearchTask({
        task: {
          title: data.title,
          description: data.description,
          assignedTo: data.assignedTo,
          dueDate: data.dueDate,
          boardId: boardId,
          boardColumnId: data.boardColumnId
        },
        researchId: researchId
      });

      refetch();
      toast.success('Tarefa criada com sucesso');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Erro ao criar tarefa');
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="min-h-[200px]">
          <SortableContext
            items={tasks.map((task) => task.taskId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {tasks.map((task) => (
                <KanbanItem
                  key={task.taskId}
                  task={task}
                  columnId={id}
                  users={users}
                  columns={columns}
                  refetch={refetch}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </CardContent>

      <TaskEditKanban
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreateTask}
        users={users}
        defaultValues={{
          boardId: boardId,
          boardColumnId: id
        }}
        columns={columns}
      />
    </Card>
  );
}
