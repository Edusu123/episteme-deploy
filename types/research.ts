import { z } from 'zod';
import { IUser, IUserInfo } from './user';

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

export interface IResearchList {
  researchId: string;
  imageUrl: string;
  title: string;
  status: boolean;
  description: string;
  usersList: IUserInfo[];
  createdAt: Date;
}

export interface ResearchEnvironment {
  researchId: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  imageId: string | null;
  deletedAt: Date | null;
  fileId: string | null;
  fileName: string | null;
  fileType: string | null;
  fileUrl: string | null;
  filePath: string | null;
  deletedBy: string | null;
  filePurpose: string | null;
  uploadedBy: string | null;
  users: {
    userId: string;
    researchId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    email: string;
    isRoot: boolean;
    isActive: boolean;
    activationToken: string;
    profileImageId: string;
    fileId: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    filePurpose: string;
  }[];
}

export const inviteMemberSchema = z.object({
  emails: z
    .array(z.string().email('Email inválido'))
    .min(1, 'Adicione pelo menos um email')
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
