import { config } from 'convict-config';
import { User } from 'modules/users';

export class UsersOtpEvent implements UsersOtpMailData {
    name!: string;
    receiver!: string;
    civility!: string;
    otp!: string;
    actionUrl: string = config.get('baseUrl') + '/home';

    constructor(user: User) {
        this.civility = user?.gender === 'F' ? 'Mme' : ((user?.gender === 'M') ? 'M.' : 'M./Mme');
        this.name = user?.fullName || '';
        this.receiver = user?.email || '';
        this.otp = user?.otp?.value || '';
        this.actionUrl
    }
}

interface UsersOtpMailData {
    name: string;
    receiver: string;
    civility: string;
    otp: string;
    actionUrl: string;
}