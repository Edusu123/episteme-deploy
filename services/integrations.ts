import api from './base/api';

export const getGoogleOAuthUrl = async () => {
  const response = await api.get('/integrations/google/authorize');

  return response.data;
};

export const completeGoogleOAuth = async ({
  state,
  code
}: {
  state: string;
  code: string;
}) => {
  const response = await api.post('/integrations/google/oauth/state/complete', {
    state,
    code
  });

  return response.data;
};

export const exchangeGoogleCode = async ({
  code,
  state
}: {
  code: string;
  state: string;
}) => {
  const response = await api.get(
    `/integrations/google/callback?code=${code}&state=${state}`
  );

  return response.data;
};
