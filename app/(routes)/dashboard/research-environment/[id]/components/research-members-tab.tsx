'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Plus, Trash } from 'lucide-react';
import {
  deleteResearchPerson as deleteResearchPersonService,
  inviteMembersToResearch,
  getResearchMembers
} from 'services/research';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useState } from 'react';
import InviteMemberModal from 'components/modal/invite-member';
import { InviteMemberFormData } from 'types/research';

interface IProps {
  researchId: string;
}

export function ResearchMembersTab({ researchId }: IProps) {
  const currentUser = useCurrentUser();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: researchMembers, refetch } = useQuery({
    queryKey: ['research-members', researchId],
    queryFn: () => getResearchMembers({ researchId })
  });

  const deleteResearchPerson = async ({ userId }: { userId: string }) => {
    try {
      await deleteResearchPersonService({ researchId, userId });
      refetch();
      toast.success('Pessoa removida com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao remover pessoa');
    }
  };

  const handleInvite = async (data: InviteMemberFormData) => {
    try {
      await inviteMembersToResearch({ researchId, emails: data.emails });
      refetch();
      toast.success('Convites enviados com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar convites');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pessoas</CardTitle>
            <Button onClick={() => setIsInviteModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Pessoa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {researchMembers?.data.users.length === 0 ? (
                <TableRow>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-lg font-medium">
                        Nenhum dado encontrado
                      </div>
                      <div className="text-sm">
                        Não há documentos para exibir no momento.
                      </div>
                    </div>
                  </td>
                </TableRow>
              ) : (
                researchMembers?.data.users.map((user: any) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Image
                        alt={user.name}
                        height={32}
                        src={user.fileUrl || 'https://github.com/shadcn.png'}
                        width={32}
                      />
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          deleteResearchPerson({
                            userId: user.userId
                          });
                        }}
                        disabled={currentUser?.data.userId === user.userId}
                      >
                        <Trash className="h-5 w-5 text-red-700 dark:text-red-200" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        researchId={researchId}
        onSubmit={handleInvite}
      />
    </>
  );
}
