'use client';

import React from 'react';
import { Input } from '../input';
import { useTheme } from 'next-themes';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    return (
      <div>
        <label
          className={`block text-sm/6 font-medium text-gray-900 dark:text-gray-100`}
        >
          {label}
        </label>
        <div className="mt-2">
          <Input
            {...props}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
    );
  }
);

export { CustomInput };
