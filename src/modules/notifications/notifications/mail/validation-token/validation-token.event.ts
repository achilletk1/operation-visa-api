import { User } from 'modules/users';

export class ValidationTokenEvent implements ValidationTokenMailData {
    token!: string;
    greetings!: string;

    constructor(user: User, token: { value: string }) {
        this.greetings = 'Bonjour ' + (user?.fname || '') + ' ' + (user?.lname || '');
        this.token = token?.value || '';
    }
}

interface ValidationTokenMailData {
    token: string;
    greetings: string;
}
