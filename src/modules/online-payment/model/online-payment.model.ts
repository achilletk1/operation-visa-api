import { Attachment, ExpenseCategory, Validator, VisaTransaction } from "models/visa-operations";
import { OpeVisaStatus } from "modules/visa-operations";
import { User } from "modules/users";

export class OnlinePaymentMonth {
    _id?: any;
    user!: Partial<User>;
    currentMonth?: string;
    status!: OpeVisaStatus;
    dates!: {
        created?: number;
        updated?: number;
    };
    amounts?: number;
    ceiling?: number;
    statements!: OnlinePaymentStatement[];
    statementAmounts?: number;
    othersAttachements?: any[];
    othersAttachmentStatus?: OpeVisaStatus;
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
    amount!: number;
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

