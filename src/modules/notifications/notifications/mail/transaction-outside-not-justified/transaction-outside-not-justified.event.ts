import { VisaExceedingEvent, VisaExceedingMailData } from "../visa-exceding";
import { getTotal } from 'common/utils';
import { Travel } from "modules/travel";

export class TransactionOutsideNotJustifiedEvent extends VisaExceedingEvent implements TransactionOutsideNotJustifiedMailData {

    constructor(travel: Travel, isSensitiveCustomer: boolean, lang: 'fr' | 'en', public cc: string = '') {
        super({ transactions: travel?.transactions, ceiling: String(travel?.ceiling), amount: getTotal(travel?.transactions) || 0, isSensitiveCustomer }, travel?.user?.email, lang, travel?._id?.toString(), cc);
    }
}

interface TransactionOutsideNotJustifiedMailData extends VisaExceedingMailData { }