
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
    currentMonth?: string;
    statementRef?: string;
    tel?: string;
    email?: string;
    attachments?: any[];
    match: string;
}
