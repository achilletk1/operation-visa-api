import { User } from "./user";

export interface VisaOperations {
  _id?: string;
  clientCode?: string;
  userId?: string;
  currentMonth?: number;
  ncp?: string;
  nbrTransactions?: {
    tpew?: number; // Retrait et paiement tpe
    onp?: number; // paiement en ligne
  };
  amounts?: {
    tpew?: number; // Retrait et paiement tpe
    onp?: number; // paiement en ligne
    exceedingTpew?: number; // paiement en ligne
  };
  cards?: any[];
  date?: {
    created?: number;
    updated?: number;
  };
  operationTypes?: OperationType[];
  attachements?: Attachment[];
  status?: OperationStatus; // 100: aucun upload, 101: au moins un upload, 200: upload complet, en cours, 201: accepté, 202: refusé
  rejectReason?: string;
}

export interface Attachment {
  name?: string;
  status?: AttachementStatus;
  label?: string;
  contentType?: string;
  path?: string; // file's path in the volume
  content?: string;
  voucherId?: string; date?: {
    created?: number;
    updated?: number;
  };
  rejectReason?: string;
  isRequired?: boolean;
  extensions?: string;
}

export enum AttachementStatus {
  UNAVAILABLE = 100, // When attachement is not uploaded
  PENDING = 200, // When attachechement is uploaded but not changed
  ACCEPTED = 300, // When attachement is accepted
  REJECTED = 400, // When attachement is refused

}

export enum OperationType {
  ONP = 100,
  TPE = 200,
  ELECTRONIC_PAYMENT_TERMINAL = 300,
  ATN_WITHDRAWAL = 400,
}

export enum OperationStatus {
  UNAVAILABLE = 100, // aucun upload,
  AVAILABLE = 101, // au moins un upload,
  PENDING = 200, //  upload complet , en cours
  ACCEPTED = 201, // accepté
  REJECTED = 202, //  refusé
}

export interface FileAttachement {
  label?: string;
  extensions?: string;
  isRequired?: boolean;
}

export interface SettingFile {
  _id?: string;
  label?: string; // type d'opération(retrait GAB & paiement ou paiement en ligne)
  type?: number; // 100:retrait GAB & paiement tpe, 200:paiement en ligne
  date?: {
    created?: number;
    updated?: number;
  };
  files?: FileAttachement[];
}

export interface VisaTransaction {
  _id?: string;
  clientCode?: string;
  fullName?: string;
  beneficiary?: string;
  amount?: number;
  date?: number;
  type: string;
  ncp?: string;
  age?: string;
  card?: {
    code: string;
    label: string;
  };
  country?: string;
  category?: string;
  currentMonth?: number;
  statementRef?: string
}

export interface VisaCeiling {
  _id: string;
  type: number;
  value: number;
  description: string;
  date: {
    created?: number;
    updated?: number;
  };
  user?: {
    _id: string;
    fullName: string;
  };
}





export interface Validator {
  _id?: string;
  fullName?: string;
  clientCode?: string; // is only for admin with clientCode
  signature?: string;
  date?: number

}
export enum OpeVisaStatus {
  WAITING = 100,
  PENDING = 400,
  ACCEPTED = 200,
  REJECTED = 300,
}

export interface OnlinePayment {
  _id?: any;
  user?: User;
  currentMonth?: number;
  status?: OpeVisaStatus;
  dates?: {
    created?: number;
    updated?: number;
  };
  amounts?:number;
  ceiling?: number;
  statements?: OnlinePaymentStatement[];
  transactions?: VisaTransaction[];
  othersAttachements?: any[];
}

export interface OnlinePaymentStatement {
  fullName?: string;
  label?: string;
  date?: number;
  amount: number;
  nature?: any;
  statementRef?: string;
  comment?: string;
  attachments?: Attachment[];
  transactionRef?: string;
  validators?: Validator[];
  status?: OpeVisaStatus;
  expenseCategory?: any;
  transactions?: VisaTransaction[];
}

export interface Chat {
  _id?: string;
  operationId?: string; // online payment ID or Travel ID
  type?: number;  // 100: travel, 200: online payment;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  type?: string;
  message?: string;
  reply?: string;
  sender?: string;
  date?: string;
  files?: any[];
  quote?: string;
  avatar?: string;
}


export interface Voucher {
  _id?: string;
  label?: string;
  extension?: string;
  description?: string;
  isRequired?: boolean;
}

export interface LongTravelType {
  _id?: string;
  label?: string;
  vouchers?: Voucher[];
  dates?: {
    created?: number;
    updated?: number;
  };
}

export interface PropertyAndServicesType {
  _id?: string;
  label?: string;
  vouchers?: Voucher[];
  dates?: {
    created?: number;
    updated?: number;
  };
}