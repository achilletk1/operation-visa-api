import { RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { OnlinePaymentMonth } from "modules/online-payment";
import { Import } from "modules/imports";
import { Travel } from "modules/travel";

export class RejectTemplateSmsEvent implements RejectTemplateSmsData {

    constructor(
        public operation: Travel | Import | OnlinePaymentMonth | RequestCeilingIncrease ,
        public phone: string,
        public operationName: 'Travel' | 'Import' | 'OnlinePaymentMonth' | 'RequestCeilingIncrease'
    ) { }
}

interface RejectTemplateSmsData {
    phone: string;
    operationName: 'Travel' | 'Import' | 'OnlinePaymentMonth' | 'RequestCeilingIncrease';
}