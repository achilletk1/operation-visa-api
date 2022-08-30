
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

// export interface Recipient {
//     label?: string;
//     ncp?: string;
//     age?: string;
//     bankName?: string;
//     bankCode?: string;
// }

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

// export interface Validator {
//   validatorId?: string;
//   validatorName?: string;
//   date?: number;
//   isValidated?: boolean;
//   rejectReason?: string;
// }
