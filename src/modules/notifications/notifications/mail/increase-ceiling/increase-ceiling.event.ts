import { RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { formatNumber } from "common/helpers";

export class IncreaseCeilingEvent implements IncreaseCeilingMailData {
    tel!: string;
    email!: string;
    account!: string;
    receiver!: string;
    greetings!: string;
    accountType!: string;
    currCeiling!: string;
    userFullName!: string;
    desiredCeiling!: string;
    transactionType!: string;

    constructor(ceiling: RequestCeilingIncrease) {
        this.tel = ceiling?.user?.tel || '';
        this.email = ceiling?.user?.email || '';
        this.account = ceiling?.account?.ncp || '';
        this.receiver = ceiling?.user?.email || '';
        this.greetings = this.getGreetings(ceiling);
        this.accountType = ceiling?.account?.inti || '';
        this.userFullName = ceiling?.user?.fullName || '';
        this.currCeiling = formatNumber(String(ceiling?.currentCeiling?.amount)) + ' XAF' || '';
        this.desiredCeiling = formatNumber(String(ceiling?.desiredCeiling?.amount)) + ' XAF' || '';
        this.transactionType = ceiling?.currentCeiling?.type === 200 ? 'PAIEMENT INTERNET' : 'PAIEMENT TPE, RETRAIT DAB';
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
    account: string;
    receiver: string;
    greetings: string;
    accountType: string;
    currCeiling: string;
    userFullName: string;
    desiredCeiling: string;
    transactionType: string;
}