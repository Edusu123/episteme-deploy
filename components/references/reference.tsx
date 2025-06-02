import { IAuthor, IReference } from 'types/reference';
import { TableCell, TableRow } from '../ui/table';
import { ActionButton } from '../ui/custom/action-button';

interface IProps {
  reference: IReference;
  deleteAction: (id: string) => void;
}

export function Reference({ reference, deleteAction }: IProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{reference.title}</TableCell>
      <TableCell>
        {reference.authors.length > 1
          ? reference.authors.map((a: IAuthor) => a.firstName).join(', ')
          : reference.authors[0].firstName +
            ' ' +
            reference.authors[0].lastName}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {reference.createdOn.toLocaleDateString('pt-br')}
      </TableCell>
      <TableCell>
        <ActionButton
          itemId={reference.id ?? ''}
          accessLink={`/references/${reference.id}`}
          deleteAction={deleteAction}
        />
      </TableCell>
    </TableRow>
  );
}
