export class UserValidator {
    _id?: any;
    userId?: string;
    level?: number;
    enabled?: boolean;
    email?: string;
    fname?: string;
    lname?: string;
    gender?: 'M' | 'F';
    tel?: string;
    fullRights?: boolean;
    dates!: {
        created: number;
        updated?: number;
    };

}