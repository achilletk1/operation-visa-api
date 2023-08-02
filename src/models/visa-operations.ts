import { TemporaryFile } from './settings';

export enum ExpenseCategory {
  IMPORT_OF_GOODS = 100,
  IMPORT_OF_SERVICES = 200,
}
export interface Attachment {
  label?: string; // setting file name in backoffice
  fileName?: string; // name of the file at the upload
  name?: string; // internal name to identify the file in the server
  contentType?: string;
  content?: any;
  path?: string;
  voucherId?: string;
  dates?: {
    created?: number;
    updated?: number;
  };
  isRequired?: boolean;
  extension?: string;
  temporaryFile?: TemporaryFile;
}


export enum AttachementStatus {
  UNAVAILABLE = 100, // When attachement is not uploaded
  PENDING = 200, // When attachechement is uploaded but not changed
  ACCEPTED = 300, // When attachement is accepted
  REJECTED = 400, // When attachement is refused

}

export enum OperationStatus {
  UNAVAILABLE = 100, // aucun upload,
  AVAILABLE = 101, // au moins un upload,
  PENDING = 200, //  upload complet , en cours
  ACCEPTED = 201, // accepté
  REJECTED = 202, //  refusé
}

export interface VisaTransaction {
  _id?: string;
  clientCode?: string;
  fullName?: string;
  manager?: {
    code?: string;
    name?: string
  };
  beneficiary?: string;
  amount?: number;
  amountTrans?: number;
  currencyTrans?: string;
  amountCompens?: number;
  currencyCompens?: number;
  date?: number;
  type?: string;
  ncp?: string;
  age?: string;
  card?: {
    code?: string;
    label?: string;
    name?: string;
  };
  cha: string;
  country?: string;
  category?: string;
  reference?: string;
  currentMonth?: number;
  statementRef?: string;
  tel?: string;
  email?: string;
 }

export interface VisaCeiling {
  _id: string;
  type: VisaCeilingType;
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

export enum VisaCeilingType {
  SHORT_TERM_TRAVEL = 100,
  ONLINE_PAYMENT = 200,
  LONG_TERM_TRAVEL = 300,
  STUDYING_TRAVEL = 400,
}



export interface Validator {
  _id?: string;
  fullName?: string;
  clientCode?: string; // is only for admin with clientCode
  signature?: string;
  date?: number;
  status?: OpeVisaStatus;
  level?: number;
  rejectReason?: string;

}
export enum OpeVisaStatus {
  EMPTY = 101,
  TO_COMPLETED = 100,
  TO_VALIDATED = 400,
  EXCEDEED = 500,
  JUSTIFY = 200,
  REJECTED = 300,
  CLOSED = 600,
  VALIDATION_CHAIN = 700

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

export enum OperationType {
  ELECTRONIC_PAYMENT_TERMINAL = 100,
  ATN_WITHDRAWAL = 200,
  ONLINE_PAYMENT = 300
}
