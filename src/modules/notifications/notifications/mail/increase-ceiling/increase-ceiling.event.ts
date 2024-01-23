import { RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { formatNumber } from "common/helpers";

export class IncreaseCeilingEvent implements IncreaseCeilingMailData {
    tel!: string;
    receiver!: string;
    email!: string;
    account!: string;
    greetings!: string;
    userFullName!: string;
    cardNumber!: string;
    cardType!: string;
    desiredProfile!: string;
    cost!: string;


    constructor(ceiling: RequestCeilingIncrease) {
        this.tel = ceiling?.user?.tel || '';
        this.receiver = ceiling?.user?.email || '';
        this.email = ceiling?.user?.email || '';
        this.account = ceiling?.cardType?.NUM_CPTE || '';
        this.userFullName = ceiling?.user?.fullName || '';
        this.cardNumber = ceiling?.cardType?.NUM_CARTE || '';
        this.cardType = ceiling?.cardType?.LIBELLE_TYPE || '';
        this.desiredProfile = ceiling?.cardProfileType?.label || '';
        this.cost = formatNumber(String(ceiling?.cardProfileType?.amount)) + ' XAF' || '';
        this.greetings = this.getGreetings(ceiling);
    }

    getGreetings(ceiling: RequestCeilingIncrease) {
        const userFullName = ceiling?.user?.fullName || '';
        const gender = ceiling?.user?.gender === 'm' ? 'M.' : ((ceiling?.user?.gender === 'f') ? 'Mme' : 'M./Mme');
        return `Bonjour ${gender} ${userFullName},`;
    }
}

export interface IncreaseCeilingMailData {
    tel: string;
    email: string;
    receiver: string;
    account: string;
    greetings: string;
    userFullName: string;
    cardNumber: string;
    cardType: string;
    desiredProfile: string;
    cost: string;
}