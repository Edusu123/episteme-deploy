import Image from 'next/image';
import { IUser } from 'types/user';
import { TableCell, TableRow } from '../ui/table';
import { IResearch } from 'types/research';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { PersonActionButton } from './person-action-button';
import { deleteResearchPerson } from 'services/research';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { MoreHorizontal, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useProfileModal } from 'hooks/modal';
import { Dialog } from '../ui/dialog';
import ProfileEdit from '../modal/profile-edit';
interface IProps {
  person: IUser;
  refetch: () => void;
}

export function PersonRow({ person, refetch }: IProps) {
  const profileModal = useProfileModal();

  const deleteResearchPersonAction = async (
    researchId: string,
    userId: string
  ) => {
    try {
      await deleteResearchPerson({ researchId, userId });
      toast.success('Pessoa deletada da pesquisa');
      refetch();
    } catch (error) {
      toast.error('Erro ao deletar pessoa da pesquisa');
    }
  };

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="User image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={person.profilePic ?? ''}
          loader={() => person.profilePic ?? ''}
          width="64"
        />
      </TableCell>

      <TableCell className="font-medium">{person.name}</TableCell>

      <TableCell>{person.email}</TableCell>

      <TableCell>
        {person.mutualResearches?.map((r: IResearch) => (
          <Badge className="capitalize" key={r.researchId} variant="outline">
            <div className="hover:text-foreground">
              <Tooltip>
                <div className="flex flex-row justify-between">
                  <TooltipTrigger asChild>
                    {r.imageUrl ? (
                      <Image
                        loader={() => r.imageUrl ?? ''}
                        className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                        src={r.imageUrl ?? ''}
                        alt=""
                        width="64"
                        height="64"
                      />
                    ) : (
                      <Image
                        className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                        src="/default-image.svg"
                        alt=""
                        width="64"
                        height="64"
                      />
                    )}
                  </TooltipTrigger>
                  <PersonActionButton
                    personId={person.id}
                    researchId={r.researchId ?? ''}
                    isOwner={r.isOwner ?? false}
                    accessLink={`dashboard/research-environment/${r.researchId}`}
                    deleteResearchPerson={deleteResearchPersonAction}
                  />
                </div>

                <TooltipContent side="left">{r.title}</TooltipContent>
              </Tooltip>
            </div>
          </Badge>
        ))}
      </TableCell>

      <TableCell className="hidden md:table-cell">
        {person.createdAt?.toLocaleDateString('pt-br')}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              {/* TODO: Open modal with user information(Create back-end endpoint) */}
              <Button
                className="cursor-pointer flex flex-row justify-between"
                onClick={() =>
                  profileModal.setModal(
                    true,
                    person.profilePic ?? 'https://ui.shadcn.com/placeholder.svg'
                  )
                }
              >
                Acessar
                <SquareArrowOutUpRight size={15} />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <Dialog
        open={profileModal.isOpen}
        onOpenChange={(open: boolean) => {
          profileModal.setModal(open, person.profilePic ?? '');
        }}
      >
        <ProfileEdit
          id={person.id}
          name={person.name}
          email={person.email}
          readOnly={true}
          callbackAction={refetch}
        />
      </Dialog>
    </TableRow>
  );
}
