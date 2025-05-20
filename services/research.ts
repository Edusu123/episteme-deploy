import { IResearch } from 'types/research';
import { api } from './base/api';

export const createResearch = async (research: IResearch) => {
  const response = await api.post('/researches', research);
  return response;
};
