import { IAuthor, IReference, IReferenceList } from 'types/reference';
import { TableCell, TableRow } from '../ui/table';
import { ActionButton } from '../ui/custom/action-button';

interface IProps {
  reference: IReferenceList;
  deleteAction: (id: string) => void;
}

export function Reference({ reference, deleteAction }: IProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div
          dangerouslySetInnerHTML={{ __html: reference.formattedReference }}
        ></div>
      </TableCell>
      <TableCell>{reference.formattedReferenceInText}</TableCell>
      <TableCell className="hidden md:table-cell">
        {reference.createdAt.toLocaleDateString('pt-br')}
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
