import { IUserInfo } from './user';

export interface IDocument {
  id: string;
  name: string;
  fileUrl: string;
  uploadDate: Date;
  owner: IUserInfo;
}
