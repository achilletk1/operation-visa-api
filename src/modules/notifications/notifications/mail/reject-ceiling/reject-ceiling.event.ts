import { RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { commonFields } from "common/interfaces";
import { formatNumber } from "common/helpers";
import { commonField } from "common/base";
import moment from "moment";

export class RejectCeilingEvent extends commonField implements RejectCeilingMailData {

    tel!: string;
    cost!: string;
    email!: string;
    account!: string;
    cardType!: string;
    validity!: string;
    greetings!: string;
    cardNumber!: string;
    userFullName!: string;
    rejectReason!: string;
    desiredProfile!: string;
    startDateValidity!: string;
    
    constructor(requestIncreaseCeiling: RequestCeilingIncrease, public cc: string = '') {
        super(requestIncreaseCeiling);
        this.tel = requestIncreaseCeiling?.user?.tel || '';
        this.email = requestIncreaseCeiling?.user?.email || '';
        this.account = requestIncreaseCeiling?.cardType?.NUM_CPTE || '';
        this.userFullName = requestIncreaseCeiling?.user?.fullName || '';
        this.cardNumber = requestIncreaseCeiling?.cardType?.NUM_CARTE || '';
        this.cardType = requestIncreaseCeiling?.cardType?.LIBELLE_TYPE || '';
        this.rejectReason = requestIncreaseCeiling?.validator?.rejectReason || '';
        this.desiredProfile = requestIncreaseCeiling?.cardProfileType?.label || '';
        this.validity = `${requestIncreaseCeiling?.validity?.duration || 'N-A'}`;
        this.startDateValidity = `${(moment(requestIncreaseCeiling?.validity?.periodStart).format('DD/MM/YYYY') +
        ' au ' + moment(requestIncreaseCeiling?.validity?.periodEnd).format('DD/MM/YYYY')) || 'N-A'}`;
        this.cost = formatNumber(requestIncreaseCeiling?.cardProfileType?.amount?.toString() || 0) + ' XAF' || '';
    }

}

interface RejectCeilingMailData extends commonFields {
    cc: string;
    tel: string;
    cost: string;
    email: string;
    account: string;
    cardType: string;
    validity: string;
    greetings: string;
    cardNumber: string;
    userFullName: string;
    rejectReason: string;
    desiredProfile: string;
    startDateValidity: string;
}