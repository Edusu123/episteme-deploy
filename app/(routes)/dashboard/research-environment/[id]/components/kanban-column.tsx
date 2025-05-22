"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { KanbanItem } from './kanban-item';
import type { Task } from './kanban-board';

type ColumnId = 'todo' | 'inProgress' | 'done';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      columnId: id,
    },
  });

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="min-h-[200px]">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {tasks.map((task) => (
                <KanbanItem key={task.id} task={task} columnId={id} />
              ))}
            </div>
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
} 