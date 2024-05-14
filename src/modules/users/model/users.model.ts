import { CbsAccounts } from "modules/cbs/model";
import { UserCategory } from "../enum";

export enum visaOpeCategory {
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
    category?: UserCategory;        // authorization profile
    cbsCategory?: '1' | '2' | '3';  // 1 = PARTICULIER; 2 = SOCIETE; 3 = ENTREPRISE INDIVIDUELLE; 
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
        fullRight?: boolean;
        joinValidation?: boolean;
        enabled?: boolean
    };
    editors?: Editor[];
    connectionHistory?: ConnectionHistory[];
    visaOpeCategory?: visaOpeCategory;
    created_at?: number;
    updated_at?: number;
    otp2fa?: boolean;
    accounts?: CbsAccounts[];
    userGesCode?: string; // this is the manager code of the bank customer's account manager
    gesCode?: string; // this is the back-office user manager code (only for back-office user)
    bankUserCode?: string;
    bankProfileCode?: string;
    bankProfileName?: string;

    constructor(userCode: string, fname: string) {
        this.userCode = userCode;
        this.fname = fname;
    }

    // isValid() {
    //     // Validate user data here
    //     return this.fname && this.userCode;
    // }
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

export interface ClaimUser {
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
    steps?: string;
}

export interface ConnectionHistory {
    time?: number;
    language?: string;
    browser?: string;
    isMobile?: string;
    platform?: string;
    userAgent?: string;
    host?: string;
    method?: string;
    app?: string;
  }
