import { Attachment, ExpenseCategory, OperationType, OpeVisaStatus, Validator } from "modules/visa-operations";
import { VisaTransaction } from "modules/visa-transactions";
import { TravelType } from "../enum";
import { User } from "modules/users";

export class ExpenseDetail {
    ref?: string;
    type?: OperationType;
    date?: number;
    currency?: any;
    amount?: number;
    object?: string;
    status?: OpeVisaStatus;
    rejectReason?: string;
    expenceCategory?: ExpenseCategory;
    validators!: Validator[];
    attachments!: Attachment[];
    isEdit?: boolean;
}

export class OthersAttachement {
    ref?: string;
    type?: OperationType;
    date?: number;
    currency?: any;
    amount?: number;
    object?: string;
    status?: OpeVisaStatus;
    rejectReason?: string;
    attachments?: Attachment[];
    validators!: Validator[];
    isEdit?: boolean;
}


export class Travel {
    _id?: any;
    status!: OpeVisaStatus;
    user!: Partial<User>;
    travelRef?: string;
    fullName?: string;
    travelType!: TravelType;
    ceiling?: number;
    dates?: {
        created: number;
        updated?: number;
    };
    proofTravel!: {
        continents: string[];
        countries: {
            name: string;
            continent: string;
            currency?: any;
        }[];
        dates: {
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
        proofTravelAttachs: Attachment[];
        status: OpeVisaStatus;
        rejectReason?: string;
        validators: Validator[];
        isEdit?: boolean;
        nbrefOfMonth?: number;
    };
    expenseDetails!: ExpenseDetail[];
    expenseDetailsStatus!: OpeVisaStatus;
    expenseDetailAmount?: number;
    othersAttachements!: OthersAttachement[];
    othersAttachmentStatus?: OpeVisaStatus;
    otherAttachmentAmount?: number;
    transactions!: VisaTransaction[];
    validators?: Validator[];
    editors?: any[];
    validationLevel?: number;
    notifications?: { data: any, type: 'SMS' | 'EMAIL', template: string }[];
}