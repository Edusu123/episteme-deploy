'use client';

import React from 'react';
import { Input } from '../input';
import { useTheme } from 'next-themes';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const CustomTextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ label, ...props }, ref) => {
    const { resolvedTheme } = useTheme();

    return (
      <div>
        <label
          className={`block text-sm/6 font-medium 
            ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        >
          {label}
        </label>
        <div className="mt-2">
          <textarea
            {...props}
            ref={ref}
            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
    );
  }
);

export { CustomTextArea };
