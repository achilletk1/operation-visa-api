import { RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { formatNumber } from "common/helpers";
import { get } from "lodash";

export class ValidCeilingEvent implements ValidCeilingMailData {
    account!: string;
    receiver!: string;
    greetings!: string;
    clientCode!: string;
    accountType!: string;
    currCeiling!: string;
    userFullName!: string;
    desiredCeiling!: string;
    transactionType!: string;

    constructor(ceiling: RequestCeilingIncrease) {
        this.receiver = ceiling?.user?.email || '';
        this.account = ceiling?.account?.ncp || '';
        this.greetings = this.getGreetings(ceiling);
        this.accountType = ceiling?.account?.inti || '';
        this.userFullName = ceiling?.user?.fullName || '';
        this.clientCode = ceiling?.user?.clientCode || '';
        this.currCeiling = formatNumber(String(ceiling?.currentCeiling?.amount)) + ' XAF' || '';
        this.desiredCeiling = formatNumber(String(ceiling?.desiredCeiling?.amount)) + ' XAF' || '';
        this.transactionType = ceiling?.currentCeiling?.type === 200 ? 'PAIEMENT INTERNET' : 'PAIEMENT TPE, RETRAIT DAB';
    }

    getGreetings(ceiling: RequestCeilingIncrease) {
        const userFullName = `${get(ceiling?.user, 'fullName', '')}`;
        const gender = ceiling?.user?.gender === 'm' ? 'M.' : ((ceiling?.user?.gender === 'f') ? 'Mme' : 'M./Mme');
        return `Bonjour ${gender} ${userFullName},`;
    }
}

export interface ValidCeilingMailData {
    account: string;
    receiver: string;
    greetings: string;
    clientCode: string;
    accountType: string;
    currCeiling: string;
    userFullName: string;
    desiredCeiling: string;
    transactionType: string;
}
