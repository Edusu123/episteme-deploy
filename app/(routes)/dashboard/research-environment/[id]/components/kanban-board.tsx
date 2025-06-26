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
import { arrayMove } from '@dnd-kit/sortable';
import { useState, useMemo, useEffect } from 'react';
import { KanbanColumn } from './kanban-column';
import { KanbanItem } from './kanban-item';
import { getResearchDefaultKanban, getPeople, updateResearchTask } from 'services/research';
import { useQuery } from '@tanstack/react-query';
import { KanbanTask, KanbanColumn as KanbanColumnType, KanbanBoardResponse } from 'types/Kanban';
import { ResearchEnvironment } from 'types/research';
import { toast } from 'sonner';

export type Task = KanbanTask;

type TasksByColumn = Record<string, Task[]>;

export function KanbanBoard({ researchId, researchData }: { researchId: string, researchData: ResearchEnvironment }) {
  const { data: kanbanResponse, refetch } = useQuery({
    queryKey: ['kanban', researchId],
    queryFn: async () => {
      const response = await getResearchDefaultKanban({ researchId });
      return response.data as KanbanBoardResponse;
    }
  });

  console.log({ kanbanResponse });

  // Organize tasks by boardColumnId
  const tasksByColumn = useMemo(() => {
    if (!kanbanResponse?.tasks || !kanbanResponse?.boardColumns) {
      return {};
    }

    const tasksMap: TasksByColumn = {};
    
    // Initialize empty arrays for each column
    kanbanResponse.boardColumns.forEach((column: KanbanColumnType) => {
      tasksMap[column.boardColumnId] = [];
    });

    // Populate tasks in their respective columns
    kanbanResponse.tasks.forEach((task: KanbanTask) => {
      if (tasksMap[task.boardColumnId]) {
        tasksMap[task.boardColumnId].push(task);
      }
    });

    return tasksMap;
  }, [kanbanResponse]);

  // Format users data for the modal
  const users = useMemo(() => {
    if (!researchData?.users) {
      return [];
    }

    return researchData.users.map((user: any) => ({
      id: user.userId,
      name: user.name,
      email: user.email,
      profileImageUrl: user.fileUrl
    }));
  }, [researchData]);

  const [tasks, setTasks] = useState<TasksByColumn>(tasksByColumn);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  // Update tasks when API data changes
  useEffect(() => {
    setTasks(tasksByColumn);
  }, [tasksByColumn]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5
      }
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveColumn(active.data.current?.columnId as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeColumn = active.data.current?.columnId as string;
    const overColumn = over.data.current?.columnId as string;

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      // Reorder within the same column
      const oldIndex = tasks[activeColumn]?.findIndex(
        (task) => task.taskId === active.id
      ) ?? -1;
      const newIndex = tasks[activeColumn]?.findIndex(
        (task) => task.taskId === over.id
      ) ?? -1;

      if (oldIndex !== -1 && newIndex !== -1) {
        setTasks((prev) => ({
          ...prev,
          [activeColumn]: arrayMove(prev[activeColumn], oldIndex, newIndex)
        }));
      }
    } else {
      // Move to a different column
      const task = tasks[activeColumn]?.find((task) => task.taskId === active.id);
      if (!task) return;

      // Optimistically update the UI
      setTasks((prev) => ({
        ...prev,
        [activeColumn]: prev[activeColumn]?.filter((t) => t.taskId !== active.id) ?? [],
        [overColumn]: [...(prev[overColumn] ?? []), { ...task, boardColumnId: overColumn }]
      }));

      // Make API call to update the task
      try {
        await updateResearchTask({
          task: {
            taskId: task.taskId,
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo,
            dueDate: new Date(task.dueDate),
            boardId: task.boardId,
            boardColumnId: overColumn
          },
          researchId: task.researchId
        });
        
        // Refresh data to ensure consistency
        refetch();
        toast.success('Tarefa movida com sucesso');
      } catch (error) {
        console.error('Error updating task:', error);
        
        // Revert the optimistic update on error
        setTasks((prev) => ({
          ...prev,
          [activeColumn]: [...(prev[activeColumn] ?? []), task],
          [overColumn]: prev[overColumn]?.filter((t) => t.taskId !== active.id) ?? []
        }));
        
        toast.error('Erro ao mover tarefa');
      }
    }

    setActiveId(null);
    setActiveColumn(null);
  }

  function handleCreateTask(columnId: string, taskData: Omit<Task, 'taskId' | 'boardColumnId' | 'createdAt' | 'updatedAt'>) {
    const newTask: Task = {
      ...taskData,
      taskId: crypto.randomUUID(),
      boardColumnId: columnId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => ({
      ...prev,
      [columnId]: [...(prev[columnId] ?? []), newTask]
    }));
  }

  if (!kanbanResponse?.boardColumns) {
    return <div>Loading...</div>;
  }

  // Sort columns by position
  const sortedColumns = [...kanbanResponse.boardColumns].sort((a, b) => a.position - b.position);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4">
        {sortedColumns.map((column) => (
          <KanbanColumn
            key={column.boardColumnId}
            id={column.boardColumnId}
            title={column.columnTitle}
            tasks={tasks[column.boardColumnId] ?? []}
            users={users}
            columns={kanbanResponse.boardColumns}
            refetch={refetch}
            researchId={researchId}
            boardId={kanbanResponse.researchBoard.boardId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && activeColumn && tasks[activeColumn] ? (
          <KanbanItem
            task={tasks[activeColumn].find((task) => task.taskId === activeId)!}
            columnId={activeColumn}
            isDragging
            users={users}
            columns={kanbanResponse.boardColumns}
            refetch={refetch}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
