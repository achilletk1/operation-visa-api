import { User } from "modules/users";

export class Setting {
    _id?: any;
    key?: string;
    label?: string;
    created_at?: number;
    updated_at!: { user: Partial<User>, date: number; }[];
    data?: string | number | any; 
}