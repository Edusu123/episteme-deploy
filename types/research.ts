import { IUser } from './user';

export interface IResearch {
  researchId?: string;
  imageUrl?: string;
  title?: string;
  status?: boolean;
  description?: string;
  emailsToInvite?: string[];
  usersList?: IUser[];
  createdAt?: Date;
  isOwner?: boolean;
}
