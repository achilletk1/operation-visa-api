export interface MailNotificationInterface {
    key: string;

    type: string;

    subject: string;
  
    hasAttachement: boolean;

    sendNotification(): any;
}


export interface commonFields {
    name?: string;
    ceiling?: number;
    amount?: number;
    date?: string;
    receiver: string;
    civility?: string;
    rejectReason?: string;
    end?: string;
    start?: string;
    created?: string;
}