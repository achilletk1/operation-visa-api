import { RequestCeilingValidator } from "./validator.model";
import { Status } from "../enum";

export interface RequestCeilingIncrease {
    _id: string;
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
        assignered?: Assignered;
    };
    validator?: RequestCeilingValidator;
    status?: Status;
    desc: string;
    signature: any;
    othersAttachements?: any[];
    dates?: {
        created?: number;
        assigned?: number;
        accepted?: number;
        rejected?: number;
    };
    cardType?: any;
    cardProfileType?: any;
}

export interface Assignered {
    _id?: string;
    tel: string;
    fname: string;
    lname: string;
    email: string;
    gender?: string;
}
