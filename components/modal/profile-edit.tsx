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
import { DegreeLevel, degreeLevels, IDegree } from 'types/degree';
import { IUser } from 'types/user';
import { importLattes } from 'services/file';
import { AxiosResponse } from 'axios';
import {
  getEducation,
  setEducation,
  updateName,
  updateProfileImage
} from 'services/user';
import { toast } from 'sonner';
import { CgSpinner } from 'react-icons/cg';
import { useProfileModal } from 'hooks/modal';
import api from 'services/base/api';
import { useOAuthStatePolling } from 'hooks/useOAuthStatePooling';
import { completeGoogleOAuth, exchangeGoogleCode, getGoogleOAuthUrl } from 'services/integrations';
import { AxiosError } from 'axios';

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
        id: undefined,
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

  // OAuth state
  const [oauthState, setOauthState] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<{
    message: string;
    status: number | null;
  } | null>(null);

  const { loading, openOAuthWindow, polling, statusMessage } =
    useOAuthStatePolling({
      sessionKey: oauthState || '',
      onCodeReceived: async (code: string) => {
        // Handle the OAuth code here
        console.log('OAuth code received:', code);

        try {
          // Complete the OAuth process by calling the backend
          await exchangeGoogleCode({ code, state: oauthState || '' });


          toast.success('Conta Google conectada com sucesso!');
        } catch (error) {
          console.error('Failed to complete OAuth:', error);
          setOauthError({
            message: 'Failed to complete OAuth process',
            status:
              error instanceof AxiosError
                ? (error.response?.status ?? 500)
                : null
          });
        }
      },
      setError: (error) => {
        setOauthError(error);
      },
      statusMessages: {
        success: 'Google account connected successfully!',
        timeout: 'Connection timed out. Please try again.'
      }
    });

  const handleConnectGoogle = async () => {
    try {
      // Get OAuth URL from your API
      const response = await getGoogleOAuthUrl();

      const { authUrl, state } = response;
      setOauthState(state);

      // Open OAuth window and start polling
      await openOAuthWindow(authUrl);
    } catch (error) {
      const errorMessage = 'Falha ao iniciar processo OAuth';
      setOauthError({
        message: errorMessage,
        status:
          error instanceof AxiosError ? (error.response?.status ?? 500) : null
      });
      toast.error(errorMessage);
    }
  };

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
      const updateImageResponse = await updateProfileImage(profileImage);

      if (updateImageResponse.status !== 200) {
        toast.error(
          'Ocorreu um erro com a sua solicitação. Por favor, tente novamente.'
        );

        setIsLoading(false);

        return;
      }
    }

    const [updateNameResponse, setEducationResponse] = await Promise.all([
      updateName(profileInfo.name),
      setEducation(profileInfo.formation ?? [])
    ]);

    if (
      updateNameResponse.status !== 200 ||
      setEducationResponse.status !== 200
    ) {
      toast.error(
        'Ocorreu um erro com a sua solicitação. Por favor, tente novamente.'
      );
    } else {
      toast.success('Dados atualizados com sucesso!');
      callbackAction();
    }

    setIsLoading(false);
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

  useEffect(() => {
    if (api.defaults.headers.Authorization)
      getEducation().then((r: AxiosResponse) => {
        if (r.status === 200)
          setProfileInfo((prev: IUser) => ({
            ...prev,
            formation: r.data.map((item: any): IDegree => {
              return {
                id: item.educationId,
                course: item.course,
                institution: item.institution,
                thesisName: item.thesisTitle,
                degreeLevel: (degreeLevels.filter(
                  (level: IOption) => level.name == item.level
                )[0].id ?? '') as DegreeLevel,
                endYear: item.graduationYear,
                startYear: item.startYear
              };
            })
          }));
      });
  }, [api.defaults.headers.Authorization]);

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

          <div className="flex flex-row justify-center p-2 mt-4">
            <Button
              variant="outline"
              onClick={handleConnectGoogle}
              disabled={loading || polling}
              className="font-semibold text-base w-64 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
            >
              {loading || polling ? (
                <CgSpinner size={20} className="animate-spin mr-2" />
              ) : (
                <Image
                  src="/google-icon.svg"
                  className="mr-2"
                  alt="Google"
                  width={24}
                  height={24}
                />
              )}
              {loading || polling ? 'Conectando...' : 'Conectar com Google'}
            </Button>
          </div>

          {/* Status messages */}
          {polling && (
            <div className="flex flex-row justify-center p-2">
              <p className="text-sm text-blue-600">Conectando ao Google...</p>
            </div>
          )}

          {statusMessage && (
            <div className="flex flex-row justify-center p-2">
              <p className="text-sm text-green-600">{statusMessage}</p>
            </div>
          )}

          {oauthError && (
            <div className="flex flex-row justify-center p-2">
              <p className="text-sm text-red-600">Erro: {oauthError.message}</p>
            </div>
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
