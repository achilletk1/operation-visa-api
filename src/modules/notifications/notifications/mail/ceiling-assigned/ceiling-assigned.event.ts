import { AssignTo, RequestCeilingIncrease } from "modules/request-ceiling-increase";
import { IncreaseCeilingEvent, IncreaseCeilingMailData } from "../increase-ceiling";
import moment from "moment";

export class CeilingAssignedEvent extends IncreaseCeilingEvent implements CeilingAssignedMailData {
    date!: string;
    hour!: string;
    assignTo!: string;

    constructor(ceiling: RequestCeilingIncrease, userAssigned: AssignTo) {
        super(ceiling);
        this.tel = `${userAssigned?.tel || ''}`;
        this.email = `${userAssigned?.email || ''}`;
        this.assignTo= `${userAssigned?.fname || ''} ${userAssigned?.lname || ''}`;
        this.hour = moment(ceiling?.dates?.assigned).format('HH:mm');
        this.date = moment(ceiling?.dates?.assigned).format('DD/MM/YYYY');
    }

}

export interface CeilingAssignedMailData extends IncreaseCeilingMailData {
    date: string;
    hour: string;
    assignTo: string;
}

