import { getStatusExpression } from "modules/notifications";
import { OnlinePaymentMonth } from "modules/online-payment";
import { getYearMonthLabel } from "common/helpers";

export class OnlinePaymentStatusChangedEvent implements OnlinePaymentStatusChangedMailData {
    name!: string;
    date!: string;
    status!: string;
    ceiling!: string;
    receiver!: string;
    civility!: string;

    constructor(onlinePayment: OnlinePaymentMonth, public reason: string) {
        this.civility = onlinePayment?.user?.gender?.toUpperCase() === 'F' ? 'Mme' : ((onlinePayment?.user?.gender?.toUpperCase() === 'M') ? 'M.' : 'M./Mme');
        this.name = onlinePayment?.user?.fullName || '';
        this.receiver = onlinePayment?.user?.email || '';
        this.status = getStatusExpression(onlinePayment?.status);
        this.date = getYearMonthLabel(`${onlinePayment?.currentMonth || ''}`, 'both') || '';
        this.ceiling = onlinePayment?.ceiling?.toString() || '';
    }
}

interface OnlinePaymentStatusChangedMailData {
    name: string;
    date: string;
    status: string;
    reason: string;
    ceiling: string;
    receiver: string;
    civility: string;
}