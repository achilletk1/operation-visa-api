export interface Attachement {
    extension?: any;
    code?: string;
    path?: string;
    label?: string;
    status?: AttachementStatus;
    voucherId?: string;
    contentType?: string;
    content?: string;
    dates?: {
        created?: number;
        updated?: number;
    };
    isRequired?: boolean;
    rejectReason?: string;
}

export interface Voucher {
    _id?: string;
    label?: string;
    extension?: string;
    description?: string;
    isRequired?: boolean;
}

export enum AttachementStatus {
    UNAVAILABLE = 100, // When attachement is not uploaded
    PENDING = 200, // When attachechement is uploaded but not changed
    ACCEPTED = 300, // When attachement is accepted
    REJECTED = 400, // When attachement is refused

}

export enum OperationType {
    ELECTRONIC_PAYMENT_TERMINAL = 100,
    ATN_WITHDRAWAL = 200
}
export enum OperationStatus {
    UNAVAILABLE = 100, // aucun upload,
    AVAILABLE = 101, // au moins un upload,
    PENDING = 200, //  upload complet , en cours
    ACCEPTED = 201, // accepté
    REJECTED = 202, //  refusé
}
export interface VisaTransaction {
    _id?: string;
    clientCode?: string;
    fullName?: string;
    beneficiary?: string;
    amount?: number;
    date?: number;
    type: string;
    ncp?: string;
    age?: string;
    card?: {
        code: string;
        label: string;
    };
    country?: string;
    category?: string;
    currency?: string;
    currentMonth?: number;
    statementRef?: string;
}
export interface VisaCeiling {
    _id: string;
    type: number;
    value: number;
    description: string;
    date: {
        created?: number;
        updated?: number;
    };
    user?: {
        _id: string;
        fullName: string;
    };
}

export interface Travel {
    _id?: string;
    fullName?: string;
    clientCode?: string;
    userId?: string;
    travelRef?: string;
    dates?: {
        start: number;
        end?: number;
        created: number;
        updated?: number;
    };
    continents?: string[];
    countries?: {
        name: string;
        continent: string;
        currency?: string;
    }[];
    status: OperationStatus;
    comment?: string;
    signature?: string;
    travelReason?: {
        code: string;
        label: string;
        otherLabel?: string;
    };
    travelAttachments?: Attachement[];
    expenseDetails?: {
        type?: OperationType;
        date?: number;
        currency?: string;
        amount?: number;
        reason?: string;
        expenseAttachements?: Attachement[];
    }[];
    transaction?: VisaTransaction[];
}


export interface OnlinePayment {
    _id?: string;
    clientCode?: string;
    userId?: string;
    dates?: {
        created: number;
        updated?: number;
    };
    status: OperationStatus;
    currentMonth?: number;
    transactions?: VisaTransaction[];
    statements?: OnlinePaymentStatement[];
}

export interface OnlinePaymentStatement {
    fullName?: string;
    date?: number;
    account?: {
        ncp: number;
        age: number;
    },
    statementRef?: string,
    comment?: string;
    signature?: string;
    attachments?: Attachement[];
}

export interface Chat {
    _id?: string;
    operationId?: string;
    type?: number;  // 100: travel, 200: online payment;
    messages?: ChatMessage[];
}

export interface ChatMessage {
    type?: string;
    message?: string;
    reply?: string;
    sender?: string;
    date?: string;
    files?: any[];
    quote?: string;
    avatar?: string;
}

