import { Attachment, ExpenseCategory, OpeVisaStatus, Validator } from "modules/visa-operations";
import { VisaTransaction } from "modules/visa-transactions";
import { User } from "modules/users";

export class OnlinePaymentMonth {
    _id?: any;
    user?: Partial<User>;
    currentMonth?: number;
    status?: OpeVisaStatus;
    dates?: {
        created?: number;
        updated?: number;
    };
    amounts?: number;
    ceiling?: number;
    month?: any;
    year?: any;
    //statements!: OnlinePaymentStatement[];
    // statementAmounts?: number;
    othersAttachements?: any[];
    othersAttachmentStatus?: OpeVisaStatus;
    expenseDetailsStatus?: OpeVisaStatus;
    expenseDetailAmount?: number;
    expenseDetailsLevel?: number;
    transactions?: VisaTransaction[];
    validationLevel?: number;
    validators?: Validator[];
    editors?: any[];
    rejectReason?: string;
    notifications?: { data: any, type: 'SMS' | 'EMAIL', template: string }[];
}

export class OnlinePaymentStatement {
    fullName?: string;
    label?: string;
    date?: number;
    amount?: number;
    nature?: any;
    statementRef?: string;
    comment?: string;
    attachments?: Attachment[];
    transactionRef?: string;
    validators!: Validator[];
    status?: OpeVisaStatus;
    expenseCategory?: ExpenseCategory;
    isEdit?: boolean;
}
