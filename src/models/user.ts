
export enum UserCategory {
  DEFAULT = 100,
  BILLERS = 200,
  BILLEROLD = 201,
  BANK_USER = 500,
  ADMIN = 600,
  CREATOR = 601,
  VALIDATOR = 602,
  AUDITOR = 603,
  OPERATOR = 604
}


export enum Status {
  ATTENTE = 100,
  VALIDER = 200,
  REJETER = 300,

}

export interface Wallet {
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

export interface User {
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
  function?: string;
  enabled?: boolean;
  pwdReseted?: boolean;
  clientCode?: string;
  ncp?: string;
  code?: string;
  otp?: { value: string, expiresAt: number };
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
  }
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

