import { VisaExceedingEvent, VisaExceedingMailData } from "../visa-exceeding";

export class FirstReminderOfFormalNoticeEvent extends VisaExceedingEvent implements FirstReminderOfFormalNoticeMailData {

    constructor(data: { transactions: any, ceiling: string, amount: number, isSensitiveCustomer: boolean }, public receiver: string = '', lang: 'fr' | 'en', public id?: string, public cc: string = '',) {
        super(data, receiver, lang, id, cc);
    }
}

interface FirstReminderOfFormalNoticeMailData extends VisaExceedingMailData { }
