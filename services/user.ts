import { api } from './base/api';

export const me = async () => {
  const response = api.get('/users/me');

  return response;
};

export const updateProfileImage = async (image: File) => {
  var bodyFormData = new FormData();

  bodyFormData.append('file', image);

  const response = await api.put('/users/me/profile-image', bodyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data;'
    }
  });

  return response;
};

export const updateName = async (name: string) => {
  const response = await api.patch('/users/me', { name });

  return response;
};
