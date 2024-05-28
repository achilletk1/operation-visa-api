import { OnlinePaymentMonth } from "modules/online-payment";
import { commonFields } from "common/interfaces";
import { commonField } from "common/base";

export class RejectOnlinePaymentEvent extends commonField implements RejectOnlinePaymentMailData {

    rejectReason!: string;

    constructor(onlinePaymentMonth: OnlinePaymentMonth, public cc: string = '') {
        super(onlinePaymentMonth);
        this.rejectReason = onlinePaymentMonth?.rejectReason || '';
    }
}

interface RejectOnlinePaymentMailData extends commonFields {
    cc: string;
    rejectReason: string;
}