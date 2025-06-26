'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from './kanban-board';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import TaskEdit from '@/components/modal/task-edit';
import TaskEditKanban from '@/components/modal/task-edit-kanban';
import { KanbanColumn } from 'types/Kanban';
import { updateResearchTask } from 'services/research';
import { toast } from 'sonner';

interface KanbanItemProps {
  task: Task;
  columnId: string;
  isDragging?: boolean;
  users?: Array<{
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  }>;
  columns?: KanbanColumn[];
  refetch: () => void;
}

export function KanbanItem({
  task,
  columnId,
  isDragging,
  users = [],
  columns = [],
  refetch
}: KanbanItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.taskId,
      data: {
        type: 'task',
        task,
        columnId
      }
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <TaskEditKanban
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        defaultValues={{
          taskId: task.taskId,
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate),
          assignedTo: task.assignedTo,
          boardId: task.boardId,
          boardColumnId: task.boardColumnId
        }}
        onSubmit={async (data) => {
          try {
            console.log({ data });
            await updateResearchTask({
              task: data,
              researchId: task.researchId
            });
            refetch();
            toast.success('Tarefa atualizada com sucesso');
          } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar tarefa');
          }
        }}
        users={users}
        columns={columns}
      />
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{task.title}</h3>
        <Pencil
          className="w-4 h-4"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setIsEditing(true);
          }}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
      <div className="flex items-center justify-between mt-4">
        <img
          src={task.assignedToProfileImageUrl}
          alt={task.assignedToName}
          width={20}
          height={20}
          className="rounded-full"
        />
        <span className="text-sm text-muted-foreground ml-2">
          {task.assignedToName}
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline">
            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
