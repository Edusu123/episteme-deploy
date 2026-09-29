import { IDegree } from './degree';

export interface IProfile {
  profilePic: string;
  fullName: string;
  email: string;
  lattesFile?: File;
  formation: IDegree[];
}
