import { ExpenseCategory, OpeVisaStatus, VisaOperationsAttachment } from "modules/visa-operations";
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
  finalPayment?: boolean | Event;
  // tslint:disable-next-line: variable-name
  created_at?: number;
  // tslint:disable-next-line: variable-name
  updated_at?: number;
  editors?: Editor[];
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
  type?: 'PAIEMENT INTERNET' | 'PAIEMENT TPE' | 'RETRAIT DAB';
}
