import { VisaOperationsAttachment } from "modules/visa-operations";
import { RequestCeilingValidator } from "./validator.model";
import { Status } from "../enum";

export class RequestCeilingIncrease {
    _id!: string;
    user?: {
        _id?: string;
        clientCode?: string;
        fullName?: string;
        tel?: string;
        email?: string;
        gender?: string;
    };
    desiredCeiling?: {
        type?: number;
        amount?: number
    };
    currentCeiling?: {
        type?: number;
        amount?: number
    };
    account?: {
        age?: string;
        ncp?: string;
        clc?: string;
        inti?: string;
    };
    assignment?: {
        assigner?: {
            _id: string;
            fname?: string;
            lname?: string;
        }
        assignered?: AssignTo;
    };
    validity?: Validity;
    validators?: RequestCeilingValidator[];
    rejectReason?: string;
    status?: Status;
    desc!: string;
    signature: any;
    dates?: {
        created?: number;
        assigned?: number;
        accepted?: number;
        rejected?: number;
    };
    othersAttachements?: VisaOperationsAttachment[];
    cardType?: any;
    cardProfileType?: any;
}

export interface Validity {
    periodStart: number; // date on milliseconds
    periodEnd: number; // date on milliseconds
    duration: number;
};

export interface AssignTo {
    _id?: string;
    tel: string;
    fname: string;
    lname: string;
    email: string;
    gender?: string;
}
