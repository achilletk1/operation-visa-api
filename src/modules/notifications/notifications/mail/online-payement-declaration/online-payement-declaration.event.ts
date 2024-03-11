import { OnlinePaymentMonth } from 'modules/online-payment';
import { getYearMonthLabel } from 'common/helpers';
import moment from "moment";

export class OnlinePaymentDeclarationEvent implements OnlinePaymentDeclarationMailData {
    name!: string;
    date!: string;
    created!: string;
    ceiling!: string;
    receiver!: string;
    civility!: string;

    constructor(onlinePayment: OnlinePaymentMonth) {
        this.civility = onlinePayment?.user?.gender === 'F' ? 'Mme' : ((onlinePayment?.user?.gender === 'M') ? 'M.' : 'M./Mme');
        this.name = onlinePayment?.user?.fullName || '';
        this.receiver = onlinePayment?.user?.email || '';
        this.ceiling = String(onlinePayment?.ceiling) || '';
        this.date = getYearMonthLabel(`${onlinePayment?.currentMonth || ''}`, 'both') || '';
        this.created = `${moment(+Number(onlinePayment?.dates?.created)).format('DD/MM/YYYY')}`;
    }
}

interface OnlinePaymentDeclarationMailData {
    name: string;
    date: string;
    created: string;
    ceiling: string;
    receiver: string;
    civility: string;
}