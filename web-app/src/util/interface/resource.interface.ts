interface ResourceInfo {
    _id: string,
    title: string,
    link: string,
    publisher: string,
    tags: { _id: string; name: string; }[];
    createdAt:string;
    isReadByUser:boolean;
    isResource:boolean
}