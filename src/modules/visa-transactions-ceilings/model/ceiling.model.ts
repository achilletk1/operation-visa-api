import { VisaCeilingType } from '../enum';

export interface VisaTransactionsCeiling {
    type: VisaCeilingType;
    value: number;
    description: string;
    date: {
        created: number;
        updated: number;
    };
}
