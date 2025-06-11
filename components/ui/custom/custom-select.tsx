'use client';

import { forwardRef } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react';
import { ChevronsUpDown } from 'lucide-react';
import { IOption } from 'types';

interface InputProps {
  label: string;
  onChange: (value: IOption) => void;
  options: IOption[];
  required?: boolean;
  showImages?: boolean;
  value: IOption | undefined;
}

const CustomSelect = forwardRef<HTMLSelectElement, InputProps>(
  (
    { label, onChange, options, required = false, showImages = false, value },
    ref
  ) => {
    if (!value) value = { id: '', name: 'Selecione...' };

    return (
      <Listbox onChange={onChange} ref={ref} value={value}>
        <label
          className={`block text-sm/6 font-medium text-gray-900 dark:text-gray-100`}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>

        <div className="relative">
          <ListboxButton className="border border-input grid h-10 w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:text-gray-100 dark:bg-background">
            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
              {showImages && value && (
                <img
                  alt=""
                  src={value?.imageUrl ?? ''}
                  className="size-5 shrink-0 rounded-full"
                />
              )}
              <span className="block truncate">{value.name}</span>
            </span>
            <ChevronsUpDown
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute border z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-background py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
          >
            {options.map((o: IOption) => (
              <ListboxOption
                key={o.id}
                value={o}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 dark:text-gray-100 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <div className="flex items-center">
                  {showImages && (
                    <img
                      alt=""
                      src={o.imageUrl}
                      className="size-5 shrink-0 rounded-full"
                    />
                  )}
                  <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                    {o.name}
                  </span>
                </div>

                {/* <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span> */}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    );
  }
);

export { CustomSelect };
