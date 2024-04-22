import { VisaExceedingEvent, VisaExceedingMailData } from "../visa-exceding";
import { Travel } from "modules/travel";
import { getTotal } from "common/utils";

export class FormalNoticeEvent extends VisaExceedingEvent  implements FormalNoticeMailData {

    constructor(travel: Travel, lang: 'fr' | 'en', public cc: string = '') {
        super({ transactions: travel?.transactions, ceiling: String(travel?.ceiling), amount: getTotal(travel?.transactions) || 0 }, travel?.user?.email, lang, travel?._id?.toString(), cc);
    }
}

interface FormalNoticeMailData extends VisaExceedingMailData {}