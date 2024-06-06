import { OnlinePaymentMonth } from "modules/online-payment";
import { Import } from "modules/imports";
import { Travel } from "modules/travel";
import moment from "moment";

export class DeclarationTemplateSmsEvent implements DeclarationTemplateSmsData {

    created!: string;

    constructor(
        public operation: Travel | Import | OnlinePaymentMonth,
        public phone: string
    ) {
        this.created = `${moment(this.getCreatedDate(operation)).format('DD/MM/YYYY')}`;
    }

    getCreatedDate(operation: Travel | Import | OnlinePaymentMonth) {
        let date: number | undefined;
        ('dates' in operation) && (operation?.dates) && ('created_at' in operation?.dates) && (date = operation?.dates?.created);
        ('created_at' in operation) && (date = operation?.created_at);
        return date;
    }
}

interface DeclarationTemplateSmsData {
    phone: string;
    created: string;
}