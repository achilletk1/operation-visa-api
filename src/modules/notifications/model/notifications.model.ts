import { VisaOperationsAttachment } from "modules/visa-operations";
import { NotificationFormat, NotificationStatus } from "../enum";

export interface MailAttachment { name: string; content: string | Buffer; contentType: string; }

export interface Notification {
    _id?: string;
    object: string;
    format: NotificationFormat; // 100 SMS, 200 MAIL, 300 WHATSAPP
    message: string;
    email: string | undefined;
    tel: string | undefined;
    id: string | undefined; // online payment Id, voyage Id, travel-month Id
    dates: {
        createdAt: number;
        sentAt?: number;
        receivedAt?: number;
        readAt?: number;
    };
    status?: NotificationStatus; // 100 (Created), 200 (Success Sent), 300 (Unsuccess Sent), 400 (Pending Sent)
    attachments: VisaOperationsAttachment[];
    key: string;
    name?: string; // User name;
    editors?: any[];
};