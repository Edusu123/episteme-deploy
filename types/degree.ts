export interface IDegree {
  degreeLevel?:
    | 'ENSINO_MEDIO'
    | 'GRADUACAO'
    | 'ESPECIALIZACAO'
    | 'MESTRADO'
    | 'DOUTORADO';
  course: string;
  institution: string;
  startYear: string;
  thesisName: string;
  endYear: string;
}
