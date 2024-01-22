import { VisaTransaction } from "modules/visa-transactions";
import { OpeVisaStatus, Validator } from "modules/visa-operations";
import { Editor } from "modules/users";

export class TravelMonth {
    _id?: any;
    status?: OpeVisaStatus;
    userId?: string;
    travelId?: string;
    month?: string;
    dates!: {
        created: number;
        updated?: number;
    };
    // expenseDetails!: ExpenseDetail[];
    expenseDetailsStatus?: OpeVisaStatus;
    expenseDetailAmount?: number;
    transactions?: VisaTransaction[];
    expenseDetailsLevel?: number;
    validators?: Validator[];
    editors?: Editor[];
    isUntimely?: boolean;

}