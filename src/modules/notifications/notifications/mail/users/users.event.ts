import { config } from 'convict-config';
import { User } from 'modules/users';

export class UsersEvent implements UsersMailData {
    name!: string;
    receiver!: string;
    civility!: string;
    userCode!: string;
    actionUrl: string = config.get('baseUrl') + '/home';

    constructor(user: User) {
        this.civility = user?.sex === 'F' ? 'Mme' : ((user?.sex === 'M') ? 'M.' : 'M./Mme');
        this.name = user?.fullName || '';
        this.receiver = user?.email || '';
        this.userCode = user?.userCode || '';
        this.actionUrl
    }
}

interface UsersMailData {
    name: string;
    receiver: string;
    civility: string;
    userCode: string;
    actionUrl: string;
}