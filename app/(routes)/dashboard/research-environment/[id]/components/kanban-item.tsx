"use client";

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from './kanban-board';

type ColumnId = 'todo' | 'inProgress' | 'done';

interface KanbanItemProps {
  task: Task;
  columnId: ColumnId;
  isDragging?: boolean;
}

export function KanbanItem({ task, columnId, isDragging }: KanbanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <h3 className="font-medium">{task.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">{task.assignee}</span>
        <Badge variant="outline">
          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
        </Badge>
      </div>
    </Card>
  );
} 