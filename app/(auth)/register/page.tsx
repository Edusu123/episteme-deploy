'use client';

import { CustomButton } from '@/components/ui/custom/custom-button';
import { CustomInput } from '@/components/ui/custom/custom-input';
import ThemeSwitch from '@/components/ui/theme-switch';
import { AxiosResponse } from 'axios';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { register } from 'services/auth';
import { toast } from 'sonner';
import { IUser } from 'types/user';

export default function page() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [disabledSave, setDisabledSave] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (user.password != user.passwordConfirmation) {
      toast.error('As senhas não coincidem...');
      setLoading(false);
      return;
    }

    register(user).then((r: AxiosResponse) => {
      if (r.status == 201) {
        setDisabledSave(true);
        toast.success('Acesse o link enviado para o seu e-mail para entrar!');
      } else {
        toast.error(
          'Ocorreu um erro na solicitação. Por favor, tente novamente.'
        );
      }

      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
      <div className="flex flex-row justify-end mb-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <ThemeSwitch />
      </div>

      <div className="rounded-md sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-max w-auto"
          src={`${resolvedTheme === 'dark' ? 'episteme-dark-high-resolution-logo.webp' : 'episteme-high-resolution-logo.webp'}`}
          alt="Your Company"
        />
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action="#"
          className="bg-white dark:bg-[#020916] rounded-md p-3 space-y-6"
          method="POST"
          onSubmit={handleSubmit}
        >
          <CustomInput
            id="name"
            label={'Nome Completo'}
            name="name"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            type="text"
          />

          <CustomInput
            id="email"
            label={'E-mail'}
            name="email"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            type="email"
          />

          <CustomInput
            id="password"
            label={'Senha'}
            name="password"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            type="password"
          />

          <CustomInput
            id="passwordConfirmation"
            label={'Confirmação de Senha'}
            name="passwordConfirmation"
            onChange={(e) =>
              setUser((prev) => ({
                ...prev,
                passwordConfirmation: e.target.value
              }))
            }
            required
            type="password"
          />

          <CustomButton
            disabled={disabledSave}
            isLoading={loading}
            text={'Salvar'}
            type="submit"
            variant="submit"
          />

          <CustomButton
            indicator="return"
            onClick={() => {
              router.push('/login');
            }}
            text={'Voltar'}
            type="button"
            variant="return"
          />
        </form>
      </div>
    </div>
  );
}
