import { IncreaseCeilingEvent, IncreaseCeilingMailData } from "../increase-ceiling/increase-ceiling.event";
import { RequestCeilingIncrease } from "modules/request-ceiling-increase";

export class IncreaseCeilingBankEvent extends IncreaseCeilingEvent implements IncreaseCeilingBankMailData {
    ageCode!: string;
    clientCode!: string;

    constructor(ceiling: RequestCeilingIncrease) {
        super(ceiling);
        this.ageCode = ceiling?.account?.age || '';
        this.clientCode = ceiling?.user?.clientCode || '';
    }

}

interface IncreaseCeilingBankMailData extends IncreaseCeilingMailData {
    ageCode: string;
    clientCode: string;
}