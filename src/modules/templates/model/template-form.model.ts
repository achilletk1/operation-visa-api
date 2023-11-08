import { User } from "modules/users";
import { SendType } from "../enum";

export interface TemplateForm {
    _id: any;
    label?: string;
    desc?: string;
    sendType?: SendType; // 100: SMS; 200: Email ; 300 :Les deux ;
    period: number;
    enabled?: boolean;
    author?: User;
    key?: string;
    dates?: {
        created?: number;
        updated?: number;
    };
    fr?: {
        email?: string;
        sms?: string;
        obj?: string;
    }
    en?: {
        email?: string;
        sms?: string;
        obj?: string;
    }
}