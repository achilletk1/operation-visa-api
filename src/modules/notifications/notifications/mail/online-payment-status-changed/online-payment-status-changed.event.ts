import { getStatusExpression, transformDateExpression } from "modules/notifications";
import { OnlinePaymentMonth } from "modules/online-payment";

export class OnlinePaymentStatusChangedEvent implements OnlinePaymentStatusChangedMailData {
    name!: string;
    date!: string;
    status!: string;
    ceiling!: string;
    receiver!: string;
    civility!: string;

    constructor(onlinePayment: OnlinePaymentMonth) {
        this.civility = onlinePayment?.user?.sex === 'F' ? 'Mme' : ((onlinePayment?.user?.sex === 'M') ? 'M.' : 'M./Mme');
        this.name = onlinePayment?.user?.fullName || '';
        this.receiver = onlinePayment?.user?.email || '';
        this.status = getStatusExpression(onlinePayment?.status);
        this.date = transformDateExpression(String(onlinePayment?.currentMonth)) || '';
        this.ceiling = String(onlinePayment?.ceiling) || '';
    }
}

interface OnlinePaymentStatusChangedMailData {
    name: string;
    date: string;
    status: string;
    ceiling: string;
    receiver: string;
    civility: string;
}