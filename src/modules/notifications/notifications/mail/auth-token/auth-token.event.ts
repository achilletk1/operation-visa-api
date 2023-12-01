// import { User } from "modules/users";

export class AuthTokenEmailEvent implements AuthTokenEmailData {
    receiver!: string;
    greetings!: string;

    constructor(user: any, public token: string) {
        this.greetings = 'Bonjour ' + (user?.fname || '') + ' ' + (user?.lname || '');
        this.receiver = user.email || '';
    }
}

interface AuthTokenEmailData {
    token: string;
    greetings: string;
    receiver: string;
}