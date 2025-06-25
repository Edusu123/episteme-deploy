import { degreeLevels, IDegree } from 'types/degree';
import { api } from './base/api';
import { IOption } from 'types';

//TODO: Types API responses with zod
export const me = async () => {
  const response = await api.get('/users/me');

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

export const getEducation = async () => {
  const response = await api.get('/users/me/educations');
  return response;
};

export const setEducation = async (list: IDegree[]) => {
  const response = await api.put('/users/me/educations', {
    educations: list.map((item: IDegree): any => ({
      educationId: item.id,
      course: item.course,
      institution: item.institution,
      thesisTitle: item.thesisName,
      level: degreeLevels.filter(
        (level: IOption) => level.id == item.degreeLevel
      )[0].name,
      graduationYear: Number(item.endYear),
      startYear: Number(item.startYear)
    }))
  });

  return response;
};
