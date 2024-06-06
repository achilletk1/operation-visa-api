import { VisaExceedingEvent, VisaExceedingMailData } from "../visa-exceeding";
import { Travel } from "modules/travel";
import { getTotal } from "common/utils";

export class FormalNoticeEvent extends VisaExceedingEvent implements FormalNoticeMailData {

    headLeftText!: string
    headRightText!: string;
    letterRef!: string;
    objectText!: string;
    salutationText!: string;
    introductionTexT!: string;
    bodyText!: string;
    conclusionText!: string;
    signatureText!: string;
    footerText!: string;

    constructor(travel: Travel, isSensitiveCustomer: boolean, lang: 'fr' | 'en', public cc: string = '', public type: 'proofTravel' | 'exceedingCeiling' | 'import') {
        super({ transactions: travel?.transactions, ceiling: String(travel?.ceiling), amount: getTotal(travel?.transactions) || 0, isSensitiveCustomer }, travel?.user?.email, lang, travel?._id?.toString(), cc);
    }
}

interface FormalNoticeMailData extends VisaExceedingMailData {
    headLeftText: string
    headRightText: string;
    letterRef: string;
    objectText: string;
    salutationText: string;
    introductionTexT: string;
    bodyText: string;
    conclusionText: string;
    signatureText: string;
    footerText: string;
    type: 'proofTravel' | 'exceedingCeiling' | 'import';
}