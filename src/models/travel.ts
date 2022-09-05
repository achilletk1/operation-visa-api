import { ChatMessage } from "./chat-message";
import { OperationType, OpeVisaStatus, VisaTransaction } from "./visa-operations";

export interface TravelAttachement {
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
    clientCode?: string;
    userId?: string;
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
            code: number;
            label: string;
            otherLabel?: string;
            vouchersList?: string[];
        };
        isTransportTicket?: boolean;
        isVisa?: Boolean;
        proofTravelAttachs?: TravelAttachement[];
        status?: OpeVisaStatus;
        rejectReason?: string;
        validators?: Validator[]
    }

    expenseDetails?: {
        ref?: string;
        type?: OperationType;
        date?: number;
        currency?: any;
        amount?: number;
        object?: string;
        status?: OpeVisaStatus;
        rejectReason?: string;
        validators?: Validator[]
    }[];

    expenseAttachements?: {
        expenseRef?: string;
        status?: OpeVisaStatus;
        rejectReason?: string;
        attachments: TravelAttachement[];
        validators?: Validator[]
    };

    othersAttachements?: {
        type?: OperationType;
        date?: number;
        currency?: any;
        amount?: number;
        object?: string;
        status?: OpeVisaStatus;
        rejectReason?: string;
        attachments: TravelAttachement[];
        validators?: Validator[]
    };

    chat?: ChatMessage[];

    transactions?: VisaTransaction[];
}
