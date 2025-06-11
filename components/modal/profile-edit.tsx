'use client';

import Image from 'next/image';
import { DialogContent } from '../ui/dialog';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Pen, Plus, X } from 'lucide-react';
import { CustomInput } from '../ui/custom/custom-input';
import { CustomFileInput } from '../ui/custom/custom-file-input';
import { CustomSelect } from '../ui/custom/custom-select';
import { IOption } from 'types';
import { IProfile } from 'types/profile';
import { Button } from '../ui/button';
import { IDegree } from 'types/degree';

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

export default function ProfileEdit() {
  const [picUrl, setPicUrl] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | undefined>();
  const [profileInfo, setProfileInfo] = useState<IProfile>({
    email: '',
    fullName: '',
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

  const addFormation = () => {
    setProfileInfo((prev: IProfile) => ({
      ...prev,
      formation: [
        ...profileInfo.formation,
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

  return (
    <DialogContent className="w-full max-w-[40vw] max-h-[700px] overflow-auto">
      <div className="gap-3 grid grid-cols-[35%_65%]">
        <div className="flex flex-row justify-center w-full">
          <div className="relative w-auto">
            <Image
              className="w-48 h-48 object-contain rounded-full"
              src={
                picUrl ??
                'https://assets.brasildefato.com.br/2024/09/image_processing20220512-20730-jb29gt.jpeg'
              }
              alt={''}
              width="64"
              height="64"
            />

            <span
              className="bottom-0 cursor-pointer flex flex-row items-center justify-center left-36 absolute w-10 h-10 bg-black border-2 border-white dark:border-gray-800 rounded-full"
              onClick={() => {
                document.getElementById('fileInput')?.click();
              }}
            >
              <Pen width={14} height={14} />

              <input
                accept="image/*"
                className="hidden"
                id="fileInput"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) {
                    setProfilePic(e.target.files[0]);
                    setPicUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                type="file"
              />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <CustomInput
            label={'Nome'}
            name="name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setProfileInfo((prev: IProfile) => ({
                ...prev,
                fullName: e.target.value
              }));
            }}
            required
            value={profileInfo.fullName}
          />

          <CustomInput
            label={'E-mail'}
            name="email"
            readOnly={true}
            onChange={(e) => {
              setProfileInfo((prev: IProfile) => ({
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
          <CustomFileInput
            inputText="Arquivo Lattes"
            fileName={profilePic?.name}
            handleChange={(file: File) => {
              setProfilePic(file);
            }}
          />
        </div>

        <div>
          {profileInfo.formation?.map((degree: IDegree, index: number) => (
            <DegreeFields
              degree={degree}
              key={index}
              profileInfo={profileInfo}
              setProfileInfo={setProfileInfo}
            />
          ))}
        </div>

        <div></div>

        <div className="flex flex-row justify-between p-2">
          <Button
            className="font-semibold text-base w-52"
            onClick={addFormation}
            variant="secondary"
          >
            <Plus height={24} width={24} />
            Adicionar Formação
          </Button>

          <Button className="font-semibold text-base w-48" variant="default">
            Salvar
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

interface IDegreeFieldsProps {
  degree: IDegree;
  profileInfo: IProfile;
  setProfileInfo: Dispatch<SetStateAction<IProfile>>;
}

function DegreeFields({
  degree,
  profileInfo,
  setProfileInfo
}: IDegreeFieldsProps) {
  const removeFormation = (degree: IDegree) => {
    setProfileInfo((prev: IProfile) => ({
      ...prev,
      formation: profileInfo.formation.filter((d: IDegree) => d != degree)
    }));
  };

  return (
    <div className="border flex flex-col gap-2 m-2 p-4 rounded-lg">
      <div className="flex flex-row justify-end h-5">
        <X
          className="cursor-pointer h-4 w-4"
          onClick={() => {
            removeFormation(degree);
          }}
        />
      </div>

      <CustomSelect
        label="Nível da Formação"
        options={degreeLevels}
        value={
          degreeLevels.filter((o: IOption) => o.id == degree.degreeLevel)[0]
        }
        onChange={(option: IOption) => {
          setProfileInfo((prev: IProfile) => ({
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
      />

      <CustomInput
        label={'Curso'}
        value={degree.course}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setProfileInfo((prev: IProfile) => ({
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
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setProfileInfo((prev: IProfile) => ({
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
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setProfileInfo((prev: IProfile) => ({
            ...prev,
            formation: profileInfo.formation?.map((d: IDegree) =>
              d == degree ? { ...d, thesisName: e.target.value } : d
            )
          }));
        }}
      />

      <div className="flex flex-row justify-between w-full">
        <CustomInput
          label={'Ano Início'}
          value={degree.startYear}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setProfileInfo((prev: IProfile) => ({
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setProfileInfo((prev: IProfile) => ({
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
