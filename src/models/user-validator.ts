export interface UserValidator {
    _id?: any;
    userId?: string,
    level?: number,
    enabled?: boolean,
    email?: string,
    tel?: string,
    fullRights?: boolean,
    dates?: {
        created?: number,
        updated?: number
    },

}