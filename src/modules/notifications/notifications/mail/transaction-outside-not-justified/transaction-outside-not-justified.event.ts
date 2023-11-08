import { VisaExcedingEvent, VisaExcedingMailData } from "../visa-exceding";
import { getTotal } from 'common/utils';
import { Travel } from "modules/travel";

export class TransactionOutsideNotJustifiedEvent extends VisaExcedingEvent implements TransactionOutsideNotJustifiedMailData {

    constructor(travel: Travel, lang: 'fr' | 'en') {
        super({ transactions: travel?.transactions, ceiling: String(travel?.ceiling), amount: getTotal(travel?.transactions) || 0 }, travel?.user?.email, lang, travel?._id?.toString());
    }
}

interface TransactionOutsideNotJustifiedMailData extends VisaExcedingMailData {}