export interface MailNotificationInterface {
    key: string;

    type: string;

    subject: string;
  
    hasAttachement: boolean;

    sendNotification(): any;
}
