'use client';

import { CustomInput } from '@/components/ui/custom/custom-input';
import RedirectButton from '@/components/ui/custom/redirect-button';
import { TagsInput } from '@/components/ui/custom/tags-input';
import { CameraIcon, CircleChevronLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { createResearch } from 'services/research';
import { IResearch } from 'types/research';

export default function RegisterResearchEnvironment() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IResearch>({
    title: '',
    description: '',
    emailsToInvite: []
  });

  const onSave = () => {
    setIsLoading(true);
    createResearch(data)
      .then((r) => {
        if (r.status === 201) {
          redirect(
            process.env.NEXT_PUBLIC_BASE_URL +
              '/dashboard?showResearchCreationSuccess=true'
          );
        } else {
          setIsLoading(false);
        }
      })
      .finally(() => {
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

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className={`block text-sm/6 font-medium dark:text-gray-100 text-gray-900'}`}
                >
                  Imagem de perfil
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
                  <div className="text-center">
                    <CameraIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        className="relative cursor-pointer rounded-md bg-none font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                        htmlFor="file-upload"
                      >
                        <span>Selecione um arquivo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">ou clique e arraste até aqui</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
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
