'use client';

import RedirectButton from '@/components/ui/custom/redirect-button';
import { PlusCircle } from 'lucide-react';
import { ReferencesTable } from '@/components/references/references-table';
import { references } from 'app/api/seed/mocks';
import { useSearchParams } from 'next/navigation';
import { getReferences } from 'services/references';
import { AxiosResponse } from 'axios';
import { IReferenceList } from 'types/reference';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import api from 'services/base/api';
import { Dialog } from '@/components/ui/dialog';
import { useReferenceRegisterModal } from 'hooks/modal';
import ReferenceRegisterModal from '@/components/modal/reference-register';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const referencesPerPage = 5;

export default function page() {
  const searchParams = useSearchParams();
  const session = useSession();
  const registerModal = useReferenceRegisterModal();

  const offset = Number(searchParams.get('offset') ?? 5);

  const [references, setReferences] = useState<IReferenceList[]>([]);
  const [filteredReferences, setFilteredReferences] = useState<
    IReferenceList[]
  >([]);

  const callback = () => {
    toast.success('Nova referência criado com sucesso!');
    registerModal.setModal(false);
    getAllReferences();
  };

  const getAllReferences = async () => {
    getReferences().then((r: AxiosResponse) => {
      const list = r.data.map(
        (item: any): IReferenceList => ({
          id: item.referenceId,
          createdAt: new Date(item.createdAt),
          formattedReference: item.formattedReferenceStr,
          formattedReferenceInText: item.formattedInTextCitationStr
        })
      );

      setReferences(list);
      setFilteredReferences(list);
    });
  };

  useEffect(() => {
    if (api.defaults.headers.Authorization) getAllReferences();
  }, [session]);

  useEffect(() => {
    const q = searchParams.get('q') || '';

    setFilteredReferences(
      references.filter(
        (item: IReferenceList) =>
          q == '' ||
          item.formattedReference
            .toLocaleLowerCase()
            .includes(q.toLocaleLowerCase()) ||
          item.formattedReferenceInText
            .toLocaleLowerCase()
            .includes(q.toLocaleLowerCase())
      )
    );
  }, [searchParams]);

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="ml-auto flex items-center gap-2 mb-3">
          <Button onClick={() => registerModal.setModal(true)}>
            <PlusCircle className="h-4 mr-2 w-4" />

            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Nova Referência
            </span>
          </Button>
        </div>
      </div>

      <ReferencesTable
        references={filteredReferences.slice(
          offset - referencesPerPage,
          offset
        )}
        offset={offset}
        totalReferences={references.length}
        deleteAction={(id: string) => {}}
      />

      <Dialog onOpenChange={registerModal.setModal} open={registerModal.isOpen}>
        <ReferenceRegisterModal callbackAction={callback} />
      </Dialog>
    </div>
  );
}
