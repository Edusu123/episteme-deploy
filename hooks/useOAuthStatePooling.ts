import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';

type OAuthState = {
  authUrl: string;
  state: string;
  scope: string[];
  code?: string | null;
  error?: string | null;
  status: 'pending' | 'completed' | 'error';
  completedAt?: string;
  errorAt?: string;
};

function getBackendUrl(): string {
  return process.env.API_BASE_URL || 'http://localhost:9000';
}

export const useOAuthStatePolling = ({
  sessionKey,
  onCodeReceived,
  setError,
  statusMessages: {
    success = 'Authentication successful. Completing authorization...',
    timeout = 'Your authentication has timed out. Please close the popup and try again.'
  } = {}
}: {
  sessionKey: string;
  onCodeReceived: (code: string) => Promise<void>;
  setError: (error: { message: string; status: number | null }) => void;
  statusMessages?: {
    success?: string;
    timeout?: string;
  };
}) => {
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const pollingTimer = useRef<NodeJS.Timeout | null>(null); // Reference to timer so we can clean it up

  useQuery({
    queryKey: [`oauth_state`, sessionKey],
    queryFn: () =>
      axios
        .get<OAuthState>(
          `${getBackendUrl()}/integrations/google/oauth/state/${sessionKey}`
        )
        .then(async ({ data }) => {
          if (data.status === 'completed' || data.status === 'error') {
            setPolling(false);
            clearTimeout(pollingTimer.current!);

            if (data.status === 'error' && data.error) {
              setError({ message: data.error, status: null });
              setLoading(false);
              setStatusMessage('');
              return;
            }

            if (data.status === 'completed' && data.code) {
              setStatusMessage(success);
              try {
                await onCodeReceived(data.code);
              } finally {
                setLoading(false);
                setStatusMessage('');
              }
            }
          }

          return data;
        }),
    enabled: polling,
    // Poll OAuth state every second
    refetchInterval: 1000
  });

  const openOAuthWindow = async (oauthUrl: string) => {
    setLoading(true);
    setPolling(true);
    pollingTimer.current = setTimeout(() => {
      setLoading(false);
      setPolling(false);
      setStatusMessage(timeout);
    }, 300_000); // Stop polling in 5 minutes

    window.open(oauthUrl, 'popup', 'popup=true');
  };

  return {
    loading,
    openOAuthWindow,
    polling,
    statusMessage
  };
};


// Example usage:
/*
import { useOAuthStatePolling } from './useOAuthStatePolling';

function GoogleOAuthIntegration() {
  const [oauthState, setOauthState] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; status: number | null } | null>(null);

  const { loading, openOAuthWindow, polling, statusMessage } = useOAuthStatePolling({
    sessionKey: oauthState || '',
    onCodeReceived: async (code: string) => {
      // Handle the OAuth code here
      console.log('OAuth code received:', code);
      
      // You can make a call to your callback endpoint if needed
      // await axios.post('/integrations/google/callback', { code, state: oauthState });
      
      // Or handle the completion in your own way
    },
    setError: (error) => {
      setError(error);
    },
    statusMessages: {
      success: 'Google account connected successfully!',
      timeout: 'Connection timed out. Please try again.',
    },
  });

  const handleConnectGoogle = async () => {
    try {
      // Get OAuth URL from your API
      const response = await axios.get('/integrations/google/authorize', {
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      
      const { authUrl, state } = response.data;
      setOauthState(state);
      
      // Open OAuth window and start polling
      await openOAuthWindow(authUrl);
    } catch (error) {
      setError({ 
        message: 'Failed to start OAuth process', 
        status: error.response?.status || null 
      });
    }
  };

  return (
    <div>
      <button onClick={handleConnectGoogle} disabled={loading}>
        {loading ? 'Connecting...' : 'Connect Google Account'}
      </button>
      
      {polling && (
        <div>
          <p>Connecting to Google...</p>
        </div>
      )}
      
      {statusMessage && (
        <div>
          <p>{statusMessage}</p>
        </div>
      )}
      
      {error && (
        <div>
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  );
}
*/
