import { OnlinePaymentMonth } from 'modules/online-payment';
import moment from "moment";

export class OnlinePayementDeclarationEvent implements OnlinePayementDeclarationMailData {
    name!: string;
    created!: string;
    ceiling!: string;
    receiver!: string;
    civility!: string;

    constructor(onlinePayement: OnlinePaymentMonth) {
        this.civility = onlinePayement?.user?.gender === 'F' ? 'Mme' : ((onlinePayement?.user?.gender === 'M') ? 'M.' : 'M./Mme');
        this.name = onlinePayement?.user?.fullName || '';
        this.receiver = onlinePayement?.user?.email || '';
        this.ceiling = String(onlinePayement?.ceiling) || '';
        this.created = `${moment(+Number(onlinePayement?.dates?.created)).format('DD/MM/YYYY')}`;
    }
}

interface OnlinePayementDeclarationMailData {
    name: string;
    created: string;
    ceiling: string;
    receiver: string;
    civility: string;
}