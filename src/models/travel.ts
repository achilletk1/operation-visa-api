import { ChatMessage } from "./chat-message";
import { User } from "./user";
import { OperationType, OpeVisaStatus, VisaTransaction } from "./visa-operations";

export interface TravelAttachment {
    code?: string; // files collection Id
    label?: string; // setting file name in backoffice
    fileName?: string; // name of the file at the upload
    name?: string; // internal name to identify the file in the server
    contentType?: string;
    path?: string;
    content?: string;
    voucherId?: string;
    dates?: {
        created?: number;
        updated?: number;
    };
    isRequired?: boolean;
    extension?: string;
}

export interface Validator {
    _id?: string;
    fullName?: string;
    clientCode?: string; // is only for admin with clientCode
    signature?: string;
    date?: number

}

export enum TravelType {
    SHORT_TERM_TRAVEL = 100,
    LONG_TERM_TRAVEL = 200

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
            _id: string;
            label: string;
            code?: number;
            otherLabel?: string;
        };
        isTransportTicket?: boolean;
        isVisa?: boolean;
        isPassOut?: boolean;
        isPassIn?: boolean;
        proofTravelAttachs?: TravelAttachment[];
        status?: OpeVisaStatus;
        rejectReason?: string;
        validators?: Validator[]
    };
    expenseDetails?: ExpenseDetail[];
    expenseAttachements?: ExpenseAttachement[];
    othersAttachements?: OthersAttachment[];
    transactions?: VisaTransaction[];
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
}

export interface ExpenseAttachement {
    expenseRef?: string;
    status?: OpeVisaStatus;
    rejectReason?: string;
    attachments: TravelAttachment[];
    validators?: Validator[];
}

export interface OthersAttachment {
    type?: OperationType;
    date?: number;
    currency?: any;
    amount?: number;
    object?: string;
    status?: OpeVisaStatus;
    rejectReason?: string;
    attachments: TravelAttachment[];
    validators?: Validator[];
}

export enum ExpenseCategory {
    IMPORT_OF_GOODS = 100,
    IMPORT_OF_SERVICES = 200,
}
