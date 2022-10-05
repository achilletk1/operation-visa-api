import { User } from "./user";
import { Attachment, OpeVisaStatus, Validator, VisaTransaction } from "./visa-operations";

export interface OnlinePayment {
  _id?: string;
  user?: User;
  currentMonth?: number;
  status?: OpeVisaStatus;
  dates?: {
    created?: number;
    updated?: number;
  };
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
