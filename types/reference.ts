import { IOption } from 'types';

export interface IReference {
  id?: string;
  title: string;
  authors: IAuthor[];
  createdOn: Date;
}

export interface IAuthor {
  id?: string;
  firstName: string;
  lastName: string;
}

export interface IReferenceList {
  id: string;
  formattedReference: string;
  formattedReferenceInText: string;
  createdAt: Date;
}

export const referenceTypes: IOption[] = [
  {
    id: 'webpage',
    name: 'Website'
  },
  {
    id: 'book',
    name: 'Livro'
  },
  {
    id: 'article_journal',
    name: 'Artigo'
  },
  {
    id: 'video',
    name: 'Vídeo'
  }
];
