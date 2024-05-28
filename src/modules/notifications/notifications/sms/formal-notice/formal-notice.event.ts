export class FormalNoticeSmsEvent implements FormalNoticeSmsData {

    constructor(
        public phone: string,
    ) {}
}

interface FormalNoticeSmsData {
    phone: string;
}