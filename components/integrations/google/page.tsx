import { useState } from 'react';
import { useOAuthStatePolling } from 'hooks/useOAuthStatePooling';
import axios, { AxiosError } from 'axios';
import { getGoogleOAuthUrl } from 'services/integrations';

export default function GoogleOAuthIntegration() {
  const [oauthState, setOauthState] = useState<string | null>(null);
  const [error, setError] = useState<{
    message: string;
    status: number | null;
  } | null>(null);

  const { loading, openOAuthWindow, polling, statusMessage } =
    useOAuthStatePolling({
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
        timeout: 'Connection timed out. Please try again.'
      }
    });

  const handleConnectGoogle = async () => {
    try {
      // Get OAuth URL from your API
      const response = await getGoogleOAuthUrl();

      const { authUrl, state } = response.data;
      setOauthState(state);

      // Open OAuth window and start polling
      await openOAuthWindow(authUrl);
    } catch (error) {
      setError({
        message: 'Failed to start OAuth process',
        status:
          error instanceof AxiosError ? (error.response?.status ?? 500) : null
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
