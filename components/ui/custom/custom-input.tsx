'use client';

import React from 'react';
import { Input } from '../input';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  extraMessage?: string;
  extraMessageLink?: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, extraMessage, extraMessageLink, required, ...props }, ref) => {
    return (
      <div>
        <div className="flex flex-row items-center justify-between">
          <label
            className={`block text-sm/6 font-medium text-gray-900 dark:text-gray-100`}
          >
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>

          {extraMessage && (
            <div className="text-sm">
              <a
                className="font-semibold text-indigo-600 hover:text-indigo-500"
                href={extraMessageLink}
              >
                {extraMessage}
              </a>
            </div>
          )}
        </div>

        <div className="mt-2">
          <Input
            {...props}
            required={required}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
    );
  }
);

export { CustomInput };
