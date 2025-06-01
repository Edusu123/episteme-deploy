import { IResearch } from 'types/research';
import { api } from './base/api';

export const createResearch = async (
  research: IResearch,
  profilePic?: File
) => {
  const response = await api.post('/researches', research);

  if (response.status === 201 && profilePic) {
    const responseProfilePic = await researchProfilePic(
      response.data.research.researchId,
      profilePic
    );

    return responseProfilePic;
  }

  return response;
};

export const researchProfilePic = async (researchId: string, image: File) => {
  const bodyFormData = new FormData();
  bodyFormData.set(
    'file',
    new Blob([await image.arrayBuffer()], { type: image.type })
  );

  const response = await api.put(
    `/researches/${researchId}/profile-image`,
    bodyFormData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );

  return response;
};

export const getResearches = async () => {
  if (api.defaults.headers.Authorization) {
    const response = await api.get('/researches');

    return response;
  }

  return null;
};
