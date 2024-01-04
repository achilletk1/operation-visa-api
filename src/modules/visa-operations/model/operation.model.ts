import { OpeVisaStatus } from "../enum";

export interface Validator {
    _id?: string;
    fullName?: string;
    userCode?: string; // is only for admin with clientCode
    signature?: string;
    date?: number;
    status?: OpeVisaStatus;
    level: number;
    rejectReason?: string;

}