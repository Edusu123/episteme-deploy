'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { completeGoogleOAuth } from 'services/integrations';
import { toast } from 'sonner';
import { CgSpinner } from 'react-icons/cg';

export default function GoogleCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autorização...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Erro na autorização: ' + error);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Código de autorização ou estado não encontrado');
          return;
        }

        // Complete the OAuth process
        const response = await completeGoogleOAuth({ state, code });
        
        setStatus('success');
        setMessage('Conta Google conectada com sucesso!');
        
        // Close the popup window after a short delay
        setTimeout(() => {
          window.close();
        }, 2000);

      } catch (error) {
        console.error('Error completing OAuth:', error);
        setStatus('error');
        setMessage('Erro ao completar a autorização');
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <CgSpinner size={48} className="animate-spin mx-auto mb-4 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Conectando com Google
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Sucesso!
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Esta janela será fechada automaticamente...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Erro
              </h2>
              <p className="text-gray-600">{message}</p>
              <button
                onClick={() => window.close()}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Fechar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 