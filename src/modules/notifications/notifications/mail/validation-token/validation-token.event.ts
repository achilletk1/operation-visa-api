import { User } from 'modules/users';

export class ValidationTokenEvent implements ValidationTokenMailData {
    token!: string;
    greetings!: string;
    receiver!: string;

    constructor(user: User, token: { value: string }) {
        this.greetings = 'Bonjour ' + (user?.fname || '') + ' ' + (user?.lname || '');
        this.token = token?.value || '';
        this.receiver = user?.email || '';
    }
}

interface ValidationTokenMailData {
    token: string;
    greetings: string;
    receiver: string;
}
