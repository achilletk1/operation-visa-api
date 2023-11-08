import { ValidCeilingEvent, ValidCeilingMailData } from "../valid-ceiling";
import { RequestCeilingIncrease } from "modules/request-ceiling-increase";

export class RejectCeilingEvent extends ValidCeilingEvent implements RejectCeilingMailData {

    rejectReason!: string;

    constructor(ceiling: RequestCeilingIncrease) {
        super(ceiling);
        this.rejectReason = ceiling?.validator?.rejectReason || '';
    }
}

interface RejectCeilingMailData extends ValidCeilingMailData {
    rejectReason: string;
}