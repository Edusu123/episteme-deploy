import { IDegree } from './degree';
import { IResearch } from './research';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  passwordConfirmation?: string;
  profilePic?: string;
  mutualResearches?: IResearch[];
  createdAt?: Date;
  formation?: IDegree[];
}

export interface IUserRegister {
  name: string;
  email: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

export interface IUserInfo {
  id: string;
  name: string;
  profilePic: string;
}
