import { User } from "./user";

export interface Setting {
    _id?: any;
    key?:string;
    maxUploadFileSize?: string;
    dateCreated?:number;
    dateUpdated?:number[];
    users?:User[]
}
