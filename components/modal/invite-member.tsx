'use client';

import { z } from 'zod';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { TagsInput } from '../ui/custom/tags-input';
import { toast } from 'sonner';
import { CgSpinner } from 'react-icons/cg';
import { InviteMemberFormData, inviteMemberSchema } from 'types/research';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  researchId: string;
  onSubmit: (data: InviteMemberFormData) => Promise<void>;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  onSubmit: onSubmitCallback
}: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      emails: []
    }
  });

  const emails = watch('emails') || [];

  const onSubmit = async (data: InviteMemberFormData) => {
    setIsLoading(true);
    await onSubmitCallback(data);

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const beforeAddValidate = (tag: string, existingTags: string[]) => {
    if (!validateEmail(tag)) {
      toast.error('Email inválido');
      return false;
    }

    if (existingTags.includes(tag)) {
      toast.error('Email já adicionado');
      return false;
    }

    return true;
  };

  const handleEmailsChange = (tags: string[]) => {
    setValue('emails', tags);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Convidar Membros</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Emails dos membros
            </label>
            <TagsInput
              placeHolder="Digite o email e pressione Enter"
              value={emails}
              onChange={handleEmailsChange}
              beforeAddValidate={beforeAddValidate}
              separators={['Enter', 'Tab', ',', ';']}
            />
            {errors.emails && (
              <p className="text-sm text-red-500">
                {errors.emails.message as string}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Digite os emails separados por vírgula, ponto e vírgula, ou
              pressione Enter
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || emails.length === 0}>
              {isLoading ? (
                <>
                  <CgSpinner size={20} className="animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                'Enviar Convites'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
