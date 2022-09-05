import { Attachment, OpeVisaStatus, VisaTransaction } from "./visa-operations";

export interface OnlinePayment {
    _id?: string;
    clientCode?: string;
    userId?: string;
    currentMonth?: number;
    status: OpeVisaStatus;
    dates?: {
      created: number;
      updated?: number;
    };
    amounts?: number;
    statements?: OnlinePaymentStatement[];
    transactions?: VisaTransaction[];
  }
  
  export interface OnlinePaymentStatement {
    fullName?: string;
    date?: number;
    amount: string;
    account?: {
      ncp: number;
      age: number;
    };
    statementRef?: string;
    comment?: string;
    signature?: string;
    attachments?: Attachment[];
    transactions?: VisaTransaction[];
  }
  