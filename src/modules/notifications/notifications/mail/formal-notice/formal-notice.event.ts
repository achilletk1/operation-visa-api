import { VisaExcedingEvent, VisaExcedingMailData } from "../visa-exceding";
import { Travel } from "modules/travel";
import { getTotal } from "common/utils";

export class FormalNoticeEvent extends VisaExcedingEvent  implements FormalNoticeMailData {

    constructor(travel: Travel, lang: 'fr' | 'en') {
        super({ transactions: travel?.transactions, ceiling: String(travel?.ceiling), amount: getTotal(travel?.transactions) || 0 }, travel?.user?.email, lang, travel?._id?.toString());
    }
}

interface FormalNoticeMailData extends VisaExcedingMailData {}