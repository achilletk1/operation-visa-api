import { ExpenseCategory, VisaOperationsAttachment } from "modules/visa-operations";

export interface VisaTransaction {
    _id?: string;
    clientCode?: string;
    fullName?: string;
    manager?: {
        code?: string;
        name?: string
    };
    lang?: string;
    beneficiary?: string;
    amount?: number;
    amountTrans?: number;
    currencyTrans?: string;
    amountCompens?: number;
    currencyCompens?: string;
    date?: string;
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
    attachments?: VisaOperationsAttachment[];
    match: string;
    isExceed: boolean;  // porperty to mark operation which make overrun
    isJustify?: boolean;
    status?: number;
    nature?: { _id?: string; label?: string; otherLabel?: string; };
    expenseCategory?: ExpenseCategory;
}
