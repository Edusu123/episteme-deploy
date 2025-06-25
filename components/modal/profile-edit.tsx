'use client';

import Image from 'next/image';
import { DialogContent } from '../ui/dialog';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { Pen, Plus, X } from 'lucide-react';
import { CustomInput } from '../ui/custom/custom-input';
import { CustomFileInput } from '../ui/custom/custom-file-input';
import { CustomSelect } from '../ui/custom/custom-select';
import { IOption } from 'types';
import { Button } from '../ui/button';
import { IDegree } from 'types/degree';
import { IUser } from 'types/user';
import { importLattes } from 'services/file';
import { AxiosResponse } from 'axios';
import { updateName, updateProfileImage } from 'services/user';
import { toast } from 'sonner';
import { CgSpinner } from 'react-icons/cg';
import { useProfileModal } from 'hooks/modal';

const degreeLevels: IOption[] = [
  {
    id: 'ENSINO_MEDIO',
    name: 'Ensino Médio'
  },
  {
    id: 'GRADUACAO',
    name: 'Graduação'
  },
  {
    id: 'ESPECIALIZACAO',
    name: 'Especialização'
  },
  {
    id: 'MESTRADO',
    name: 'Mestrado'
  },
  {
    id: 'DOUTORADO',
    name: 'Doutorado'
  }
];

interface IProps {
  id: string;
  name: string;
  email: string;
  callbackAction: () => void;
  readOnly?: boolean;
}

export default function ProfileEdit({
  id,
  name,
  email,
  callbackAction,
  readOnly = false
}: IProps) {
  const settingsModal = useProfileModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lattesXMLFile, setLattesXMLFile] = useState<File | undefined>();
  const [picUrl, setPicUrl] = useState<string | undefined>();
  const [profileInfo, setProfileInfo] = useState<IUser>({
    id: '',
    name: '',
    email: '',
    profilePic: '',
    formation: [
      {
        degreeLevel: undefined,
        course: '',
        institution: '',
        startYear: '',
        thesisName: '',
        endYear: ''
      }
    ]
  });
  const [profileImage, setProfileImage] = useState<File | undefined>();

  const addFormation = () => {
    setProfileInfo((prev: IUser) => ({
      ...prev,
      formation: [
        ...(profileInfo.formation ?? []),
        {
          degreeLevel: undefined,
          course: '',
          institution: '',
          startYear: '',
          thesisName: '',
          endYear: ''
        }
      ]
    }));
  };

  const updateLattesFile = (file: File) => {
    setLattesXMLFile(file);

    importLattes(file).then((r: AxiosResponse) => {
      setProfileInfo((prev: IUser) => ({
        ...prev,
        formation: r.data.educations.educations.map(
          (item: any): IDegree => ({
            degreeLevel: item.nivel,
            course: item.curso,
            institution: item.instituicao,
            thesisName: item.tituloTeste ?? '',
            startYear: item.anoInicio,
            endYear: item.anoFormacao
          })
        )
      }));
    });
  };

  const saveInfo = async () => {
    setIsLoading(true);

    if (profileImage) {
      const [updateImageResponse, updateNameResponse] = await Promise.all([
        updateProfileImage(profileImage),
        updateName(profileInfo.name)
      ]);

      if (
        updateImageResponse.status !== 200 ||
        updateNameResponse.status !== 200
      ) {
        toast.error(
          'Ocorreu um erro com a sua solicitação. Por favor, tente novamente.'
        );
      } else {
        toast.success('Dados atualizados com sucesso!');
        callbackAction();
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPicUrl(settingsModal.imageURL);
    setProfileInfo((prev: IUser) => ({
      ...prev,
      name: name,
      id: id,
      email: email
    }));
  }, [settingsModal.imageURL]);

  return (
    <DialogContent className="w-full max-w-[40vw] max-h-[700px] overflow-auto">
      <div className="gap-3 grid grid-cols-[35%_65%]">
        <div className="flex flex-row justify-center w-full">
          <div className="relative w-auto">
            <div className="w-48 h-48">
              {picUrl && (
                <Image
                  className="h-full object-contain rounded-full w-full"
                  src={picUrl}
                  alt={''}
                  width="64"
                  height="64"
                />
              )}
            </div>

            {!readOnly && (
              <span
                className="bottom-0 cursor-pointer flex flex-row items-center justify-center left-36 absolute w-10 h-10 bg-black border-2 border-white dark:border-gray-800 rounded-full text-white dark:text-black"
                onClick={() => {
                  document.getElementById('profilePicInput')?.click();
                }}
              >
                <Pen className="dark:text-white" width={14} height={14} />

                <input
                  accept="image/*"
                  className="hidden"
                  id="profilePicInput"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                      setProfileImage(e.target.files[0]);
                      setPicUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  type="file"
                />
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <CustomInput
            label={'Nome'}
            name="name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setProfileInfo((prev: IUser) => ({
                ...prev,
                name: e.target.value
              }));
            }}
            required
            disabled={readOnly}
            value={profileInfo.name}
          />

          <CustomInput
            label={'E-mail'}
            name="email"
            disabled={true}
            onChange={(e) => {
              setProfileInfo((prev: IUser) => ({
                ...prev,
                email: e.target.value
              }));
            }}
            required
            value={profileInfo.email}
          />
        </div>
      </div>

      <div className="gap-3 grid grid-cols-[35%_65%]">
        <div>
          {!readOnly && (
            <CustomFileInput
              inputText="Arquivo"
              fileName={lattesXMLFile?.name}
              handleChange={(file: File) => {
                updateLattesFile(file);
              }}
              label="Lattes XML"
            />
          )}
        </div>

        <div>
          {profileInfo.formation?.map((degree: IDegree, index: number) => (
            <DegreeFields
              degree={degree}
              key={index}
              profileInfo={profileInfo}
              setProfileInfo={setProfileInfo}
              readOnly={readOnly}
            />
          ))}
        </div>

        <div></div>

        {!readOnly && (
          <div className="flex flex-row justify-between p-2">
            <Button
              className="font-semibold text-base w-52"
              onClick={addFormation}
              variant="secondary"
            >
              <Plus height={24} width={24} />
              Adicionar Formação
            </Button>

            <Button
              className="font-semibold text-base w-48"
              onClick={() => saveInfo()}
              variant="default"
            >
              {isLoading ? (
                <CgSpinner size={20} className="animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

interface IDegreeFieldsProps {
  degree: IDegree;
  profileInfo: IUser;
  setProfileInfo: Dispatch<SetStateAction<IUser>>;
  readOnly: boolean;
}

function DegreeFields({
  degree,
  profileInfo,
  setProfileInfo,
  readOnly
}: IDegreeFieldsProps) {
  const removeFormation = (degree: IDegree) => {
    setProfileInfo((prev: IUser) => ({
      ...prev,
      formation: profileInfo?.formation?.filter((d: IDegree) => d != degree)
    }));
  };

  return (
    <div className="border flex flex-col gap-2 m-2 p-4 rounded-lg">
      <div className="flex flex-row justify-end h-5">
        {!readOnly && (
          <X
            className="cursor-pointer h-4 w-4"
            onClick={() => {
              removeFormation(degree);
            }}
          />
        )}
      </div>

      <CustomSelect
        label="Nível da Formação"
        options={degreeLevels}
        value={
          degreeLevels.filter((o: IOption) => o.id == degree.degreeLevel)[0]
        }
        onChange={(option: IOption) => {
          setProfileInfo((prev: IUser) => ({
            ...prev,
            formation: profileInfo.formation?.map((d: IDegree) => {
              if (
                d == degree &&
                (option.id == 'ENSINO_MEDIO' ||
                  option.id == 'GRADUACAO' ||
                  option.id == 'ESPECIALIZACAO' ||
                  option.id == 'MESTRADO' ||
                  option.id == 'DOUTORADO')
              ) {
                return { ...d, degreeLevel: option.id };
              } else {
                return d;
              }
            })
          }));
        }}
        disabled={readOnly}
      />

      <CustomInput
        label={'Curso'}
        value={degree.course}
        readOnly={readOnly}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setProfileInfo((prev: IUser) => ({
            ...prev,
            formation: profileInfo.formation?.map((d: IDegree) =>
              d == degree ? { ...d, course: e.target.value } : d
            )
          }));
        }}
      />

      <CustomInput
        label={'Instituição'}
        value={degree.institution}
        readOnly={readOnly}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setProfileInfo((prev: IUser) => ({
            ...prev,
            formation: profileInfo.formation?.map((d: IDegree) =>
              d == degree ? { ...d, institution: e.target.value } : d
            )
          }));
        }}
      />

      <CustomInput
        label={'Tese'}
        value={degree.thesisName}
        readOnly={readOnly}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setProfileInfo((prev: IUser) => ({
            ...prev,
            formation: profileInfo.formation?.map((d: IDegree) =>
              d == degree ? { ...d, thesisName: e.target.value } : d
            )
          }));
        }}
      />

      <div className="flex flex-row gap-2 justify-between w-full">
        <CustomInput
          label={'Ano Início'}
          value={degree.startYear}
          readOnly={readOnly}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setProfileInfo((prev: IUser) => ({
              ...prev,
              formation: profileInfo.formation?.map((d: IDegree) =>
                d == degree ? { ...d, startYear: e.target.value } : d
              )
            }));
          }}
        />

        <CustomInput
          label={'Ano Término'}
          value={degree.endYear}
          readOnly={readOnly}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setProfileInfo((prev: IUser) => ({
              ...prev,
              formation: profileInfo.formation?.map((d: IDegree) =>
                d == degree ? { ...d, endYear: e.target.value } : d
              )
            }));
          }}
        />
      </div>
    </div>
  );
}
