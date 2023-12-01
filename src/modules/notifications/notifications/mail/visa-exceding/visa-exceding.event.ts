
export class VisaExcedingEvent implements VisaExcedingMailData {
    lang!: 'fr' | 'en';
    amount!: number;
    ceiling!: string;
    civility!: string;
    transactions!: any;

    constructor(
        data: { transactions: any, ceiling: string, amount: number },
        public receiver: string = '', lang: 'fr' | 'en',
        public id?: string,
    ) {
        this.lang = lang;
        this.civility = 'M./Mme';
        this.amount = data?.amount || 0;
        this.ceiling = data?.ceiling;
        this.transactions = data?.transactions;
    }
}

export interface VisaExcedingMailData {
    lang: 'fr' | 'en';
    amount: number;
    ceiling: string;
    receiver: string;
    civility: string;
    transactions: any;
}