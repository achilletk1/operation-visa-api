import { isSensitiveCustomer } from "common/interfaces";

export class VisaExceedingEvent implements VisaExceedingMailData {

    amount!: number;
    ceiling!: string;
    civility!: string;
    transactions!: any;

    constructor(
        data: { transactions: any, ceiling: string, amount: number, } & isSensitiveCustomer,
        public receiver: string = '',
        public lang: 'fr' | 'en',
        public id?: string,
        public cc: string = '',
    ) {
        this.civility = 'M./Mme';
        this.amount = data?.amount || 0;
        this.ceiling = data?.ceiling.toString();
        this.transactions = data?.transactions;
    }
}

export interface VisaExceedingMailData {
    cc: string;
    lang: 'fr' | 'en';
    amount: number;
    ceiling: string;
    receiver: string;
    civility: string;
    transactions: any;
}