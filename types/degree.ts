import { IOption } from 'types';

export type DegreeLevel =
  | 'ENSINO_MEDIO'
  | 'GRADUACAO'
  | 'ESPECIALIZACAO'
  | 'MESTRADO'
  | 'DOUTORADO';

export interface IDegree {
  id?: number;
  degreeLevel?: DegreeLevel;
  course: string;
  institution: string;
  startYear: string;
  thesisName: string;
  endYear: string;
}

export const degreeLevels: IOption[] = [
  {
    id: 'ENSINO_MEDIO',
    name: 'Ensino Médio'
  },
  {
    id: 'GRADUACAO',
    name: 'Graduação'
  },
  {
    id: 'ESPECIALIZACAO',
    name: 'Especialização'
  },
  {
    id: 'MESTRADO',
    name: 'Mestrado'
  },
  {
    id: 'DOUTORADO',
    name: 'Doutorado'
  }
];
