import { UserCategory } from "../enum";

export enum visaOpecategory {
    CODIR = 100,
    CHEF_DE_REGION = 200,
    GESTIONNAIRE = 300,
    CHEF_AGENCE = 400,
    AGENT_DE_BANQUE = 500,
    EXTERNE = 600
}
export class User {
    _id?: string;
    userCode?: string;
    category?: UserCategory;
    fname?: string;
    lname?: string;
    fullName?: string;
    password?: string;
    tel?: string;
    email?: string;
    lang?: string;
    age?: { label?: string; code?: string; };
    function?: string;
    enabled?: boolean;
    pwdReseted?: boolean;
    clientCode?: string;
    otp?: { value: string, expiresAt?: number };
    ceiling?: CeilingInfors[]; // infors ceilings
    gender?: 'm' | 'f' | string;
    visaOpValidation?: {
        level?: number;
        fullRigth?: boolean;
        joinValidation?: boolean;
        enabled?: boolean
    };
    editors?: Editor[];
    visaOpecategory?: visaOpecategory;
    created_at?: number;
    updated_at?: number;
    otp2fa?: boolean;

    constructor(userCode: string, fname: string) {
        this.userCode = userCode;
        this.fname = fname;
    }

    // isValid() {
    //     // Validate user data here
    //     return this.fname && this.userCode;
    // }
}

export class BankClient extends User {

    NOMREST?: string;
    NOM?: string;
    PRE?: string;
    NRC?: string;
    NIDF?: string;
    AGE?: string;
    NCP?: string[];
    CLC?: string;
    CIVILITY?: string;
    ADDRESS?: string;
    TEL?: string;
    EMAIL?: string;
    POB?: string;
    DOB?: string;
    IDTYPE?: string;
    IDNUM?: string;
    CHA?: string;
    CLI?: string;
    accounts?: string[];


}

export class Wallet {
    provider?: {
        code?: number; // 1:Airtel; 2: MTN; 3: GIMAC
        label?: string;
    };
    account?: {
        age?: string;
        ncp?: string;
        clc?: string;
    };
    tel?: string;
    enable?: boolean;
    commissionProfil?: string;
    isPendingLinkage?: boolean;
    linkInfo?: {
        bciHolderInfo?: any;
        mtnHolderInfo?: any;
        airtelHolderInfo?: any;
    };

}

export interface Claimuser {
    _id?: string;
    fname: string;
    lname: string;
    tel: string;
    email: string;
}

export interface UserRequest {
    _id?: string;
    fname: string;
    lname: string;
    tel: string;
    email: string;
}

export interface CeilingInfors {
    ncp?: string;
    clc?: string;
    age?: string;
    inti?: string;
    amount?: number;
}

export interface Editor {
    _id?: string;
    date: number;
    fullName?: string;
}