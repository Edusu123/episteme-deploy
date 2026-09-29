import { ButtonHTMLAttributes, forwardRef, InputHTMLAttributes } from 'react';
import { CircleChevronLeft, LoaderCircle, PlusCircle } from 'lucide-react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text: string;
  isLoading?: boolean;
  indicator?: 'return' | 'add';
}

const buttonVariants = cva(
  'flex justify-center items-center px-3 py-1.5 rounded-md shadow-xs text-sm/6 w-full disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        submit:
          'bg-indigo-600 font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2',
        return:
          'dark:bg-[#f6f5ee] font-semibold dark:text-black dark:hover:bg-[#c3c2bc] bg-black text-white hover:bg-[#262626]'
      },
      size: {
        default: ''
      }
    },
    defaultVariants: {
      variant: 'submit',
      size: 'default'
    }
  }
);

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, indicator, isLoading = false, size, text, variant, ...props },
    ref
  ) => {
    return (
      <div>
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {indicator == 'add' && <PlusCircle className="h-5 w-5 mr-1" />}
          {indicator == 'return' && (
            <CircleChevronLeft className="h-5 w-5 mr-1" />
          )}
          {isLoading ? <LoaderCircle className="animate-spin" /> : text}
        </button>
      </div>
    );
  }
);

export { CustomButton };
