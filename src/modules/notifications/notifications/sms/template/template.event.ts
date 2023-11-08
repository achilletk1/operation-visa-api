export class TemplateSmsEvent implements TemplateSmsData {

    constructor(
        public datas: any,
        public phone: string,
        public key: string,
        public lang: 'fr' | 'en',
        public id: string,
        public subject: string,
    ) {}
}

interface TemplateSmsData {
    id: string;
    datas: any;
    key: string;
    phone: string;
    subject: string;
    lang: 'fr' | 'en';
}