import { VisaExceedingEvent, VisaExceedingMailData } from "../visa-exceeding";
import { OnlinePaymentMonth } from "modules/online-payment";
import { Travel } from "modules/travel";
import { getTotal } from 'common/utils';
import { Import } from "modules/imports";

export class TransactionOutsideNotJustifiedEvent extends VisaExceedingEvent implements TransactionOutsideNotJustifiedMailData {
    
    
    constructor(operation: Travel | OnlinePaymentMonth | Import, isSensitiveCustomer: boolean, lang: 'fr' | 'en', public cc: string = '') {
        const ceiling = 'ceiling' in operation ? String(operation.ceiling) : '0';
        super({ transactions: operation?.transactions, ceiling, amount: getTotal(operation?.transactions as any) || 0, isSensitiveCustomer }, operation?.user?.email, lang, operation?._id?.toString(), cc);
    }
}

interface TransactionOutsideNotJustifiedMailData extends VisaExceedingMailData { }