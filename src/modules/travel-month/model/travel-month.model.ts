import { VisaTransaction } from "modules/visa-transactions";
import { OpeVisaStatus } from "modules/visa-operations";
import { ExpenseDetail } from "modules/travel";

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
    expenseDetails!: ExpenseDetail[];
    expenseDetailsStatus?: OpeVisaStatus;
    expenseDetailAmount?: number;
    transactions?: VisaTransaction[];

}