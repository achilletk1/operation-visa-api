import { RequestCeilingIncrease } from "modules/request-ceiling-increase";

export class IncreaseCeilingSmsEvent implements IncreaseCeilingSmsData {
    constructor(
        public ceiling: RequestCeilingIncrease,
        public phone: string
    ) { }
}

interface IncreaseCeilingSmsData {
    phone: string;
}