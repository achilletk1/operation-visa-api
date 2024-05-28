import { VisaExceedingEvent, VisaExceedingMailData } from "../visa-exceeding";

export class SecondReminderOfFormalNoticeEvent extends VisaExceedingEvent implements SecondReminderOfFormalNoticeMailData {

    constructor(data: { transactions: any, ceiling: string, amount: number, isSensitiveCustomer: boolean }, public receiver: string = '', lang: 'fr' | 'en', public id?: string, public cc: string = '') {
        super(data, receiver, lang, id, cc);
    }
}

interface SecondReminderOfFormalNoticeMailData extends VisaExceedingMailData { }