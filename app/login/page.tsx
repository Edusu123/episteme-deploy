'use client';

import { signIn, SignInResponse } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    const callbackUrl = searchParams.get('callbackUrl');
    e.preventDefault();

    await signIn('credentials', { email, password, redirect: false }).then(
      (res: SignInResponse | undefined) => {
        if (!res) {
          toast.error('Não foi possível acessar o serviço... Tente novamente.');
          return;
        }

        if (res.error && res.error == 'CredentialsSignin') {
          toast.error('Login inválido');
          return;
        }

        if (callbackUrl) {
          router.push(callbackUrl as Route);
        } else {
          router.push('/dashboard');
        }
      }
    );
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-max w-auto"
          src={`${resolvedTheme === 'dark' ? 'episteme-dark-high-resolution-logo.webp' : 'episteme-high-resolution-logo.webp'}`}
          alt="Your Company"
        />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          action="#"
          method="POST"
        >
          <div>
            <label
              className={`block text-sm/6 font-medium ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
            >
              E-mail
            </label>
            <div className="mt-2">
              <Input
                className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block text-sm/6 font-medium ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
              >
                Senha
              </label>
              <div className="text-sm">
                <a
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  href="#"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <Input
                className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                id="password"
                name="password"
                required
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
            >
              Entrar
            </button>
          </div>

          <div>
            <button
              className="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_13183_10121)">
                  <path
                    d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                    fill="#3F83F8"
                  ></path>
                  <path
                    d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                    fill="#FBBC04"
                  ></path>
                  <path
                    d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                    fill="#EA4335"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_13183_10121">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0.5)"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
              <div>Entrar com Google</div>
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Não possui uma conta?{' '}
          <a
            className="font-semibold text-indigo-600 hover:text-indigo-500"
            href="#"
          >
            Registre-se aqui!
          </a>
        </p>
      </div>
    </div>
  );
}
