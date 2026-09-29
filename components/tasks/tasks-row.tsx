'use client';

import Image from 'next/image';
import { IDocument } from 'types/document';
import { TableCell, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Download, Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ITasks } from 'types/task';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useState } from 'react';
import TaskEdit from '@/components/modal/task-edit';
import { updateResearchTask } from 'services/research';
import { toast } from 'sonner';

interface IProps {
  task: ITasks;
  refetch: () => void;
}

export function TasksRow({ task, refetch }: IProps) {
  const currentUser = useCurrentUser();

  const [taskEditOpen, setTaskEditOpen] = useState<boolean>(false);

  return (
    <TableRow>
      <TableCell className="font-medium">{task.title}</TableCell>

      <TableCell>{task.description}</TableCell>

      <TableCell>
        <Badge className="capitalize" variant="secondary">
          <div className="flex flex-row items-center justify-between hover:text-foreground">
            <Image
              className="w-9 h-9 border-2 border-white object-contain rounded-full dark:border-gray-800"
              src={
                task.research?.fileUrl ?? '/default-image.svg'
              }
              alt=""
              width="64"
              height="64"
              unoptimized={true}
            />

            <span className="mx-2 text-base">{task.research?.title}</span>
          </div>
        </Badge>
      </TableCell>

      <TableCell>
        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
      </TableCell>

      <TableCell className="text-right">
        <Button variant="ghost" size="sm" onClick={() => setTaskEditOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>

      <TaskEdit
        isOpen={taskEditOpen}
        onClose={() => setTaskEditOpen(false)}
        defaultValues={{
          taskId: task.taskId,  
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo,
          dueDate: new Date(task.dueDate)
        }}
        onSubmit={async (data) => {
          try {
            console.log({ data });
            await updateResearchTask({
              task: data,
              researchId: task.research?.researchId ?? ''
            });
            refetch();
            toast.success('Tarefa atualizada com sucesso');
          } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar tarefa');
          }
        }}
      />
    </TableRow>
  );
}
