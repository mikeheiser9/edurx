export interface TypeResourceTags {
  _id: string;
  name: string;
  type: string;
  forumType: string;
  createdAt: string;
  updatedAt: string;
}
export interface TypeResourceData {
  title: string;
  link: string;
  publisher: string;
  isResource: boolean;
  tags: TypeResourceTags[] | string[];
  createdAt?: string;
  _id?: string;
}

export interface TypeCategoryFilter {
  _id?: string;
  name: string;
  type: string;
  forumType: string | { label:string,value:string}[];
  createdAt?: string;
}
