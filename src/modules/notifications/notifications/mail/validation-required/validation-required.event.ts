import { UserValidator } from "modules/validations";
import moment from "moment";

export class ValidationRequiredEvent implements ValidationRequiredMailData {
    date!: string;
    name!: string;
    type!: string;
    client!: string;
    subject!: string;
    civility!: string;

    constructor(
        fullName: string,
        public receiver: string = '',
        user: UserValidator,
        type: 'travel' | 'onlinePayment',
    ) {
        this.client = fullName || '';
        this.date = moment().format('DD/MM/YYYY');
        this.subject = 'Validation requise pour' + this.type;
        this.name = (user?.fname || '') + ' ' + (user?.lname || '');
        this.civility = user?.gender === 'F' ? 'Mme' : ((user?.gender === 'M') ? 'M.' : 'M./Mme');
        this.type = type === 'travel' ? 'Déclaration de voyage hors zone CEMAC' : 'Déclaration de paiement en ligne';
    }
}

interface ValidationRequiredMailData {
    name: string;
    date: string;
    type: string;
    client: string;
    subject: string;
    receiver: string;
    civility: string;
}