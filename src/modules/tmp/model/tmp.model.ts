export interface TmpController {
    _id?: any;
    email?:string;
    gender?:string;
    fname?:string;
    lname?:string;
    tel?:string;
    category?:string;
    clientCode?:string;
    label?: string;
    otpChannel?: string;
    value?: string;
    ncp?: string;
    otp?: { value: string, expiresAt?: number };
    expired_at?: number;
}
