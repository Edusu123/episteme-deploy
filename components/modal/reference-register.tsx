'use client';

import { IOption } from 'types';
import { CustomSelect } from '../ui/custom/custom-select';
import { DialogContent } from '../ui/dialog';
import { referenceTypes } from 'types/reference';
import { ChangeEvent, useState } from 'react';
import { CustomInput } from '../ui/custom/custom-input';
import { Button } from '../ui/button';
import { CgSpinner } from 'react-icons/cg';
import { generateReferenceInfo } from 'services/references';
import { AxiosResponse } from 'axios';

interface IProps {
  callbackAction: () => void;
}

export default function ReferenceRegisterModal({ callbackAction }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [link, setLink] = useState<string>('');
  const [selectedType, setSelectedType] = useState<IOption>();

  const saveInfo = async () => {
    setIsLoading(true);

    generateReferenceInfo(selectedType?.id ?? '', link).then(
      (r: AxiosResponse) => {
        callbackAction();
      }
    );
  };

  return (
    <DialogContent className="w-full max-w-[40vw] max-h-[700px] overflow-auto">
      <CustomSelect
        label="Tipo da Referência"
        onChange={(option: IOption) => setSelectedType(option)}
        options={referenceTypes}
        required
        value={selectedType}
      />

      <CustomInput
        label={'Link da referência'}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setLink(e.target.value);
        }}
        value={link}
      />

      <div className="w-full flex flex-row justify-end">
        <Button
          className="font-semibold text-base w-48"
          onClick={saveInfo}
          variant="default"
        >
          {isLoading ? (
            <CgSpinner size={20} className="animate-spin" />
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </DialogContent>
  );
}
