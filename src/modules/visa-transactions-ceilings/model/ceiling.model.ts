import { Editor } from 'modules/users';
import { VisaCeilingType } from '../enum';

export interface VisaTransactionsCeiling {
    _id: string;
    type: VisaCeilingType;
    value: number;
    description: string;
    date: {
        created: number;
        updated: number;
    };
    editors?: Editor[];
}
