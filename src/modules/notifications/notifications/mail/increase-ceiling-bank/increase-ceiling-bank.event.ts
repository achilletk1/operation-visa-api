import { IncreaseCeilingEvent, IncreaseCeilingMailData } from "../increase-ceiling/increase-ceiling.event";
import { RequestCeilingIncrease } from "modules/request-ceiling-increase";

export class IncreaseCeilingBankEvent extends IncreaseCeilingEvent implements IncreaseCeilingBankMailData {
    clientCode!: string;

    constructor(ceiling: RequestCeilingIncrease, bankReceiver: string) {
        super(ceiling);
        this.clientCode = ceiling?.user?.clientCode || '';
        this.receiver = bankReceiver || '';
    }

}

interface IncreaseCeilingBankMailData extends IncreaseCeilingMailData {
    clientCode: string;
}