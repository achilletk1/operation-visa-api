import { OnlinePaymentMonth } from 'modules/online-payment';
import { getYearMonthLabel } from 'common/helpers';
import { commonFields } from 'common/interfaces';
import { commonField } from 'common/base';
import moment from "moment";

export class OnlinePaymentDeclarationEvent extends commonField implements OnlinePaymentDeclarationMailData {

    date!: string;
    created!: string;
    ceiling!: number;

    constructor(onlinePayment: OnlinePaymentMonth, public cc: string = '') {
        super(onlinePayment);
        this.ceiling = onlinePayment?.ceiling || 0;
        this.date = getYearMonthLabel(`${onlinePayment?.currentMonth || ''}`, 'both') || '';
        this.created = `${moment(onlinePayment?.dates?.created).format('DD/MM/YYYY')}`;
    }
}

interface OnlinePaymentDeclarationMailData extends commonFields {
    cc: string;
    date: string;
    created: string;
    ceiling: number;
}