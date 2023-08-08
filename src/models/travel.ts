import { User } from './user';
import { Attachment, ExpenseCategory, OpeVisaStatus, VisaTransaction, Validator } from './visa-operations';


export enum TravelType {
    SHORT_TERM_TRAVEL = 100,
    LONG_TERM_TRAVEL = 200

}

export interface ExpenseDetail {
    ref?: string;
    type?: OperationType;
    date?: number;
    currency?: any;
    amount?: number;
    object?: string;
    status?: OpeVisaStatus;
    rejectReason?: string;
    expenceCategory?: ExpenseCategory;
    validators?: Validator[];
    attachments?: Attachment[];
    isEdit?: boolean;
}

export interface OthersAttachement {
    ref?: string;
    type?: OperationType;
    date?: number;
    currency?: any;
    amount?: number;
    object?: string;
    status?: OpeVisaStatus;
    rejectReason?: string;
    attachments: Attachment[];
    validators?: Validator[];
    isEdit?: boolean;
}


export interface Travel {
    _id?: any;
    status?: OpeVisaStatus;
    user?: User;
    travelRef?: string;
    fullName?: string;
    travelType?: TravelType;
    ceiling?: number;
    dates?: {
        created: number;
        updated?: number;
    };
    proofTravel?: {
        continents?: string[];
        countries?: {
            name: string;
            continent: string;
            currency?: any;
        }[];
        dates?: {
            start: number;
            end?: number;
        };
        comment?: string;
        travelReason?: {
            _id?: string;
            label?: string;
            code?: number;
            otherLabel?: string;
        };
        isTransportTicket?: boolean;
        isVisa?: boolean;
        isPassOut?: boolean;
        isPassIn?: boolean;
        proofTravelAttachs?: Attachment[];
        status?: OpeVisaStatus;
        rejectReason?: string;
        validators?: Validator[];
        isEdit?: boolean;
    };
    expenseDetails?: ExpenseDetail[];
    expenseDetailsStatus?: OpeVisaStatus;
    expenseDetailAmount?: number;
    othersAttachements?: OthersAttachement[];
    othersAttachmentStatus?: OpeVisaStatus;
    otherAttachmentAmount?: number;
    transactions?: VisaTransaction[];
    validators?: Validator[];
    editors?: any[];
    validationLevel?: number;
}

export interface TravelMonth {
    _id?: any;
    status?: OpeVisaStatus;
    userId?: string;
    travelId?: string;
    month?: string;
    dates?: {
        created?: number;
        updated?: number;
    };
    expenseDetails?: ExpenseDetail[];
    expenseDetailsStatus?: OpeVisaStatus;
    expenseDetailsAmount?: number;
    transactions?: VisaTransaction[];

}
export enum OperationType {
    ELECTRONIC_PAYMENT_TERMINAL = 100,
    ATN_WITHDRAWAL = 200,
    ONLINE_PAYMENT = 300
}
