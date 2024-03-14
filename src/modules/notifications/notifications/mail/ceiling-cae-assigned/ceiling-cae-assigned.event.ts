import { IncreaseCeilingBankEvent, IncreaseCeilingBankMailData } from "../increase-ceiling-bank";
import { AssignTo, RequestCeilingIncrease } from "modules/request-ceiling-increase";

export class CeilingCaeAssignedEvent extends IncreaseCeilingBankEvent  implements CeilingCaeAssignedMailData {

    constructor(ceiling: RequestCeilingIncrease, userAssigned: AssignTo) {
        super(ceiling, userAssigned?.email);
        this.greetings = this.getCaeGreetings(userAssigned);
    }

    getCaeGreetings(userAssigned: AssignTo): string {
        const assignedCae = (userAssigned?.fname || '') + ' ' + (userAssigned?.lname || '');
        const gender = userAssigned?.gender === 'm' ? 'M.' : ((userAssigned?.gender === 'f') ? 'Mme' : 'M./Mme');
        return `Bonjour ${gender} ${assignedCae},`;
    }
}

interface CeilingCaeAssignedMailData extends IncreaseCeilingBankMailData {}
