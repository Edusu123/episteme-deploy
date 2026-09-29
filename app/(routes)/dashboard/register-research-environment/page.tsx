'use client';

import { CustomFileInput } from '@/components/ui/custom/custom-file-input';
import { CustomInput } from '@/components/ui/custom/custom-input';
import RedirectButton from '@/components/ui/custom/redirect-button';
import { TagsInput } from '@/components/ui/custom/tags-input';
import { AxiosResponse } from 'axios';
import { CircleChevronLeft } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { createResearch, researchProfilePic } from 'services/research';
import { toast } from 'sonner';
import { IResearch } from 'types/research';

export default function RegisterResearchEnvironment() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IResearch>({
    title: '',
    description: '',
    emailsToInvite: []
  });
  const [profilePic, setProfilePic] = useState<File | undefined>();

  const onSave = async () => {
    setIsLoading(true);

    createResearch(data, profilePic)
      .then((response: AxiosResponse) => {
        if (response.status == 200 || response.status === 201) {
          router.push('/dashboard?showResearchCreationSuccess=true');
        } else {
          toast.error(
            'Ocorreu um erro com a sua solicitação. Por favor, tente novamente.'
          );

          setIsLoading(false);
        }
      })
      .catch(() => {
        toast.error(
          'Ocorreu uma exceção com a sua solicitação. Por favor, tente novamente.'
        );

        setIsLoading(false);
      });
  };

  return (
    <div className="mt-3">
      <RedirectButton route={'/dashboard'}>
        <CircleChevronLeft className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Voltar
        </span>
      </RedirectButton>
      <form action={onSave}>
        <div className="space-y-12">
          <div className="border-b border-gray-900 pb-12">
            <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-1">
                <CustomInput
                  name="researchEnvName"
                  label={'Nome do ambiente'}
                  value={data.title}
                  onChange={(e) => {
                    setData((prev: IResearch) => ({
                      ...prev,
                      title: e.target.value
                    }));
                  }}
                />
              </div>
              <div className="col-span-3">
                <CustomInput
                  name="researchEnvDescription"
                  label={'Descrição'}
                  value={data.description}
                  onChange={(e) => {
                    setData((prev: IResearch) => ({
                      ...prev,
                      description: e.target.value
                    }));
                  }}
                />
              </div>

              <div className="col-span-full">
                <div className="">
                  <div
                    className={`block text-sm/6 font-medium dark:text-gray-100 text-gray-900'}`}
                  >
                    E-mails dos convidados:
                  </div>
                  <TagsInput
                    value={data.emailsToInvite}
                    onChange={(list: string[]) => {
                      setData((prev: IResearch) => ({
                        ...prev,
                        emailsToInvite: list
                      }));
                    }}
                    name="fruits"
                    placeHolder="Insira o e-mail e aperte enter..."
                    maxTagsCount={3}
                  />
                </div>
              </div>

              <CustomFileInput
                fileName={profilePic?.name}
                label={'Imagem do ambiente'}
                handleChange={(file: File) => {
                  setProfilePic(file);
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm/6 font-semibold dark:text-gray-100 text-gray-900"
          >
            Limpar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white dark:text-gray-900"
          >
            {isLoading ? (
              <CgSpinner size={20} className="animate-spin" />
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
