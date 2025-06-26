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

export const getFilesByResearch = async (researchId: string) => {
  const res = await api.get(`/researches/${researchId}/files`);
  return res;
};

export const uploadFile = async (researchId: string, file: File) => {
  var bodyFormData = new FormData();

  bodyFormData.append('file', file);

  const response = await api.post(
    `/researches/${researchId}/files`,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data;'
      }
    }
  );

  return response;
};
