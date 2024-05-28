import { ExpenseCategory, OpeVisaStatus, VisaOperationsAttachment, Validator, OperationTypeLabel } from "modules/visa-operations";
import { Editor, User } from "modules/users";

export class Import {
  // tslint:disable-next-line: variable-name
  _id?: string;
  user?: Partial<User>;
  type?: { code: ExpenseCategory; label: string; };
  transactions?: ImportOperation[];
  attachments?: VisaOperationsAttachment[];
  status?: OpeVisaStatus;
  subject?: string;
  desc?: string;
  ceiling?: number;
  // tslint:disable-next-line: variable-name
  created_at?: number;
  // tslint:disable-next-line: variable-name
  updated_at?: number;
  editors?: Editor[];
  finalPayment?: boolean | Event;
  validators?: Validator[];
  isUntimely?: boolean;
}

export class ImportOperation {
  // tslint:disable-next-line: variable-name
  _id?: string;
  parent?: {
    _id?: string;
    type?: 'travel' | 'online-payment' | 'travel-month';
  };
  date?: string;
  amount?: number;
  ncp?: string;
  age?: string;
  cardCode?: string;
  country?: string;
  beneficiary?: string;
  type?: OperationTypeLabel;
}
