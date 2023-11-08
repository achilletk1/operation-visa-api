export class TokenSmsEvent implements TokenSmsData {

    constructor(
        public token: string,
        public phone: string,
    ) {}
}

interface TokenSmsData {
    token: string;
    phone: string;
}