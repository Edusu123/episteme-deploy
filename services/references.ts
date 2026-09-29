import { api } from './base/api';

export const getReferences = async () => {
  const response = await api.get('/references');
  return response;
};

export const generateReferenceInfo = async (type: string, link: string) => {
  const res = await api.get(
    `/references/integration/search?source=${type}&query=${link}`
  );

  if (res.status !== 200) {
    return res;
  }

  const resPost = await api.post('/references/integration/generate', {
    source: type,
    metadata: res.data[0].metadata
  });

  return resPost;
};
