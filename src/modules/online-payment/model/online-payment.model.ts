import { OpeVisaStatus, Validator, VisaOperationsAttachment } from "modules/visa-operations";
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
    othersAttachements?: VisaOperationsAttachment[];
    // othersAttachmentStatus?: OpeVisaStatus;
    expenseDetailsStatus?: OpeVisaStatus;
    expenseDetailAmount?: number;
    expenseDetailsLevel?: number;
    transactions?: VisaTransaction[];
    validationLevel?: number;
    validators?: Validator[];
    editors?: any[];
    initiator?: Partial<User>;
    rejectReason?: string;
    notifications?: { data: any, type: 'SMS' | 'EMAIL', template: string }[];
    isUntimely?: boolean;
}

// export class OnlinePaymentStatement {
//     fullName?: string;
//     label?: string;
//     date?: number;
//     amount?: number;
//     nature?: any;
//     statementRef?: string;
//     comment?: string;
//     attachments?: VisaOperationsAttachment[];
//     transactionRef?: string;
//     validators!: Validator[];
//     status?: OpeVisaStatus;
//     expenseCategory?: ExpenseCategory;
//     isEdit?: boolean;
// }
