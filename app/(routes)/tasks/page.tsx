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
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

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

export type Task = {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
};

type Tasks = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

type ColumnId = keyof Tasks;

export default function page() {
  const [tasks, setTasks] = useState<Tasks>(mockTasks);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnId | null>(null);
  const [nextTaskId, setNextTaskId] = useState(
    Math.max(
      ...Object.values(mockTasks).flatMap((tasks) =>
        tasks.map((task) => task.id)
      ),
      0
    ) + 1
  );

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
    setActiveId(active.id as number);
    setActiveColumn(active.data.current?.columnId as ColumnId);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeColumn = active.data.current?.columnId as ColumnId;
    const overColumn = over.data.current?.columnId as ColumnId;

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      // Reorder within the same column
      const oldIndex = tasks[activeColumn].findIndex(
        (task) => task.id === active.id
      );
      const newIndex = tasks[activeColumn].findIndex(
        (task) => task.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        setTasks((prev) => ({
          ...prev,
          [activeColumn]: arrayMove(prev[activeColumn], oldIndex, newIndex)
        }));
      }
    } else {
      // Move to a different column
      const task = tasks[activeColumn].find((task) => task.id === active.id);
      if (!task) return;

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: prev[activeColumn].filter((t) => t.id !== active.id),
        [overColumn]: [...prev[overColumn], task]
      }));
    }

    setActiveId(null);
    setActiveColumn(null);
  }

  function handleCreateTask(columnId: ColumnId, taskData: Omit<Task, 'id'>) {
    const newTask: Task = {
      ...taskData,
      id: nextTaskId
    };

    setTasks((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newTask]
    }));

    setNextTaskId((prev) => prev + 1);
  }

  const columns: { id: ColumnId; title: string }[] = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'inProgress', title: 'Em Progresso' },
    { id: 'done', title: 'Concluído' }
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks[column.id]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && activeColumn && tasks[activeColumn] ? (
          <KanbanItem
            task={tasks[activeColumn].find((task) => task.id === activeId)!}
            columnId={activeColumn}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
