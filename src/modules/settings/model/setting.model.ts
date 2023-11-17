import { User } from "modules/users";

export class Setting {
    _id?: any;
    key?: string;
    maxUploadFileSize?: string;
    dateCreated?: number;
    dateUpdated!: number[];
    users!: User[];
    data?:{
        value?: string;
        operator?: any;
    }
    label?: string;
    enabled? : boolean;
}