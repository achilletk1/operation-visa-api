import { IncreaseCeilingEvent, IncreaseCeilingMailData } from "../increase-ceiling";
import { RequestCeilingIncrease } from "modules/request-ceiling-increase";

export class ValidCeilingEvent extends IncreaseCeilingEvent implements ValidCeilingMailData {

    constructor(ceiling: RequestCeilingIncrease) {
        super(ceiling);
    }

}

export interface ValidCeilingMailData extends IncreaseCeilingMailData {}
