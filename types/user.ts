import { IResearch } from './research';

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  profilePic?: string;
  mutualResearches?: IResearch[];
  createdAt?: Date;
}

export interface IUserInfo {
  id: string;
  name: string;
  profilePic: string;
}
