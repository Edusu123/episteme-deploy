import { z } from 'zod';
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CustomTextArea } from '../ui/custom/custom-text-area';
import {
  TaskEditBody,
  researchPutTaskBody,
  updateResearchTask
} from 'services/research';

interface IProps {
  defaultValues?: TaskEditBody;
  isOpen: boolean;
  onClose: () => void;
  readOnly?: boolean;
  onSubmit: (data: TaskEditBody) => Promise<void>;
}

export default function TaskEdit({
  isOpen,
  onClose,
  defaultValues,
  readOnly = false,
  onSubmit: onSubmitCallback
}: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<TaskEditBody>({
    resolver: zodResolver(researchPutTaskBody),
    defaultValues
  });

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: TaskEditBody) => {
    await onSubmitCallback(data);
    reset();
    onClose();
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // Create date in local timezone to avoid timezone issues
      const [year, month, day] = dateValue.split('-').map(Number);
      const localDate = new Date(year, month - 1, day); // month is 0-indexed
      setValue('dueDate', localDate);
    } else {
      setValue('dueDate', undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Título
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Digite o título da tarefa"
              disabled={readOnly}
            />
            {errors.title && (
              <p className="text-sm text-red-500">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <CustomTextArea
              label="Descrição"
              {...register('description')}
              placeholder="Digite a descrição da tarefa"
              disabled={readOnly}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Data de vencimento
            </label>
            <Input
              id="dueDate"
              type="date"
              defaultValue={formatDateForInput(defaultValues?.dueDate)}
              onChange={handleDateChange}
              disabled={readOnly}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">
                {errors.dueDate.message as string}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Tarefa</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
