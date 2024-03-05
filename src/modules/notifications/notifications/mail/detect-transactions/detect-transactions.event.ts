import { VisaExcedingEvent, VisaExcedingMailData } from "../visa-exceding";

export class DetectTransactionsEvent extends VisaExcedingEvent implements DetectTransactionsMailData {

    constructor(data: { transactions: any, ceiling: string, amount: number }, public receiver: string = '', lang: 'fr' | 'en', public id?: string, public cc: string = '', ) {
        super(data, receiver, lang, id, cc);
    }
}

interface DetectTransactionsMailData extends VisaExcedingMailData {}