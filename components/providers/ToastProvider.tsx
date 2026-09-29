import { Toaster } from 'sonner';

type Props = {
  children?: React.ReactNode;
};

export const ToastProvider = ({ children }: Props) => {
  return (
    <div>
      <Toaster richColors position="top-center" />
      {children}
    </div>
  );
};
