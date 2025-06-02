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
