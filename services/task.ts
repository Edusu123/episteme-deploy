import { api } from './base/api';

export const getTasks = async (researchId: string) => {
  const res = await api.get(`/researches/${researchId}/tasks`);
  return res;
};
