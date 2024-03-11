import { Assignered, RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { CeilingAssignedEvent, CeilingAssignedMailData } from "../ceiling-assigned";
import { OperationTypeLabel } from "modules/visa-operations";
import { formatNumber } from "common/helpers";

export class CeilingCaeAssignedEvent extends CeilingAssignedEvent implements CeilingCaeAssignedMailData {

    clientCode!: string;
    currCeiling!: string;
    userFullName!: string;
    transactionType!: string;
    requiredCeiling!: string;

    constructor(ceiling: RequestCeilingIncrease, userAssigned: Assignered) {
        const { ATN_WITHDRAWAL, ONLINE_PAYMENT, ELECTRONIC_PAYMENT_TERMINAL } = OperationTypeLabel;
        super(ceiling, userAssigned);
        this.tel = String(ceiling?.user?.tel);
        this.receiver = userAssigned?.email || '';
        this.email = String(ceiling?.user?.email);
        this.clientCode = ceiling?.user?.clientCode || '';
        this.userFullName = ceiling?.user?.fullName || '';
        this.greetings = this.getCaeGreetings(userAssigned);
        this.currCeiling = formatNumber(String(ceiling?.currentCeiling?.amount)) || '';
        this.requiredCeiling = formatNumber(String(ceiling?.desiredCeiling?.amount)) || '';
        this.transactionType = ceiling?.currentCeiling?.type === 200 ? ONLINE_PAYMENT : `${ELECTRONIC_PAYMENT_TERMINAL}, ${ATN_WITHDRAWAL}`;
    }

    getCaeGreetings(userAssigned: Assignered): string {
        const assignedCae = (userAssigned?.fname || '') + ' ' + (userAssigned?.lname || '');
        const gender = userAssigned?.gender === 'm' ? 'M.' : ((userAssigned?.gender === 'f') ? 'Mme' : 'M./Mme');
        return `Bonjour ${gender} ${assignedCae},`;
    }
}

interface CeilingCaeAssignedMailData extends CeilingAssignedMailData {
    clientCode: string;
    currCeiling: string;
    userFullName: string;
    transactionType: string;
    requiredCeiling: string;
}
