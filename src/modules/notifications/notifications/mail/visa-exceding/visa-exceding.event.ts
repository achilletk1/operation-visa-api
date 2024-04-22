
export class VisaExceedingEvent implements VisaExceedingMailData {
    lang!: 'fr' | 'en';
    amount!: number;
    ceiling!: string;
    civility!: string;
    transactions!: any;

    constructor(
        data: { transactions: any, ceiling: string, amount: number },
        public receiver: string = '', lang: 'fr' | 'en',
        public id?: string,
        public cc: string = '',
    ) {
        this.lang = lang;
        this.civility = 'M./Mme';
        this.amount = data?.amount || 0;
        this.ceiling = data?.ceiling;
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