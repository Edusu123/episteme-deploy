import { IUser } from 'types/user';
import { api } from './base/api';

export const register = async (data: IUser) => {
  const response = await api.post('/register', data);
  return response;
};

export const activateAccount = async (token: string) => {
  const response = await api.post(`/activate/${token}`);
  return response;
};
