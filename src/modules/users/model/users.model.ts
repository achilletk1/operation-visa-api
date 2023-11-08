import { UserCategory } from "../enum";

export class User {
    _id!: string;
    userCode?: string;
    category?: UserCategory;
    fname?: string;
    lname?: string;
    fullName?: string;
    password?: string;
    tel?: string;
    email?: string;
    lang?: string;
    function?: string;
    enabled?: boolean;
    pwdReseted?: boolean;
    clientCode?: string;
    ncp?: string;
    code?: string;
    otp?: { value: string, expiresAt?: number };
    ceiling?: CeilingInfors[]; // infors ceilings
    option?: number;
    commissionProfil?: string;
    walletAirtel?: Wallet;
    walletGIMAC?: Wallet;
    walletMTN?: Wallet;
    isNotSubscriber?: boolean;
    sex?: 'M' | 'F';
    gender?: string;
    visaOpValidation?: {
        level?: number;
        fullRigth?: boolean;
        joinValidation?: boolean;
        enabled?: boolean
    };

    constructor(userCode: string, fname: string) {
        this.userCode = userCode;
        this.fname = fname;
    }

    isValid() {
        // Validate user data here
        return this.fname && this.userCode;
    }
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

