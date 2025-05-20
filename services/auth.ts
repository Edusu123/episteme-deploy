import { IUserRegister } from 'types/user';
import { api } from './base/api';

export const register = async (data: IUserRegister) => {
  const response = await api.post('/register', data);
  return response;
};
