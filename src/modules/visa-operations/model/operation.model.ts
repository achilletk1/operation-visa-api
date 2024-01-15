import { OpeVisaStatus } from "../enum";

export interface Validator {
    _id?: string;
    fullName?: string;
    userCode?: string; // is only for admin with clientCode
    clientCode?: string;
    signature?: string;
    date?: number;
    status?: OpeVisaStatus;
    level: number;
    rejectReason?: string;
    step?: 'Preuve de voyage' | 'État détaillé des dépenses';
    indexes?: number[]; // List of indexes validated or rejected

}