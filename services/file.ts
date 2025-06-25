import { api } from './base/api';

export const importLattes = async (file: File) => {
  var bodyFormData = new FormData();

  bodyFormData.append('file', file);

  const response = await api.post('/files/import-lattes', bodyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data;'
    }
  });

  return response;
};
