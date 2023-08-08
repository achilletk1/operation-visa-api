import { User } from './user';
import { Attachment, ExpenseCategory, OpeVisaStatus, Validator, VisaTransaction } from './visa-operations';

export interface OnlinePaymentMonth {
  _id?: any;
  user?: User;
  currentMonth?: number;
  status?: OpeVisaStatus;
  dates?: {
    created?: number;
    updated?: number;
  };
  amounts?: number;
  ceiling?: number;
  statements?: OnlinePaymentStatement[];
  statementAmounts?: number;
  othersAttachements?: any[];
  othersAttachmentStatus?: OpeVisaStatus;
  transactions?: VisaTransaction[];
  validationLevel?: number;
  validators?: Validator[];
  editors?: any[];
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
  expenseCategory?: ExpenseCategory;
  isEdit?: boolean;
}

