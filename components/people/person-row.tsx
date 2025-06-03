import Image from 'next/image';
import { IUser } from 'types/user';
import { TableCell, TableRow } from '../ui/table';
import { IResearch } from 'types/research';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { ActionButton } from '../ui/custom/action-button';
import { PersonActionButton } from './person-action-button';

interface IProps {
  person: IUser;
}

export function PersonRow({ person }: IProps) {
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
                    <Image
                      loader={() => r.imageUrl ?? ''}
                      className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                      src={r.imageUrl ?? ''}
                      alt=""
                      width="64"
                      height="64"
                    />
                  </TooltipTrigger>
                  <PersonActionButton
                    personId={person.id ?? ''}
                    researchId={r.researchId ?? ''}
                    isOwner={r.isOwner ?? false}
                    accessLink={`dashboard/research-environment/${r.researchId}`}
                    deleteResearchPerson={(
                      personId: string,
                      researchId: string
                    ): void => {
                      throw new Error('Function not implemented.');
                    }}
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
    </TableRow>
  );
}
